import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-04-22.dahlia',
});

function getSupabase() {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not configured');
  return createClient(url, key);
}

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook verification failed';
    return new Response(`Webhook error: ${message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session);
  } else if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.error('[stripe-webhook] payment_failed:', pi.id, pi.last_payment_error?.message);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const supabase = getSupabase();

  // Check idempotency – skip if already recorded
  const { data: existing } = await supabase
    .from('audit_orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle();

  if (existing) return;

  const leadId = session.metadata?.lead_id || null;
  const businessName = session.metadata?.business_name || null;
  const customerEmail = session.customer_email ?? session.customer_details?.email ?? null;
  const customerName = session.customer_details?.name ?? null;

  await supabase.from('audit_orders').insert({
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null,
    amount_cents: session.amount_total ?? 29700,
    currency: session.currency ?? 'aud',
    status: 'paid',
    customer_email: customerEmail,
    customer_name: customerName,
    business_name: businessName,
    lead_id: leadId || null,
    metadata: session.metadata ?? {},
  });

  // If linked to a lead, mark audit_purchased_at
  if (leadId) {
    await supabase
      .from('leads')
      .update({ audit_purchased_at: new Date().toISOString() })
      .eq('id', leadId);
  }
}
