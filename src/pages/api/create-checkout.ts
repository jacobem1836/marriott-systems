import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-04-22.dahlia',
});

const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://marriottsystems.net';

export const POST: APIRoute = async ({ request }) => {
  let body: { business_name?: string; email?: string; lead_id?: string } = {};

  try {
    const text = await request.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch {
    // body is optional – proceed with empty
  }

  if (!import.meta.env.STRIPE_SECRET_KEY) {
    return new Response(
      JSON.stringify({ error: 'STRIPE_SECRET_KEY not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = import.meta.env
    .STRIPE_AUDIT_PRICE_ID
    ? [{ price: import.meta.env.STRIPE_AUDIT_PRICE_ID, quantity: 1 }]
    : [
        {
          price_data: {
            currency: 'aud',
            unit_amount: 29700,
            product_data: {
              name: 'Brisbane Hospitality Visibility Audit',
              description:
                '5-min video + PDF fix list + competitor comparison. Delivered in 48 hours.',
            },
          },
          quantity: 1,
        },
      ];

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    line_items: lineItems,
    success_url: `${SITE_URL}/hospitality/audit/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/hospitality/audit`,
    submit_type: 'pay',
    metadata: {
      source: 'marriottsystems.net',
      lead_id: body.lead_id ?? '',
      business_name: body.business_name ?? '',
    },
  };

  if (body.email) {
    sessionParams.customer_email = body.email;
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
