# Manual steps – Marriott Systems ecosystem

Updated 2026-07-13 after the apex consolidation. In order:

## 1. Cloudflare DNS – two CNAMEs (blocks three things)

Cloudflare → marriottsystems.net → DNS → add, both **DNS only** (grey cloud):

| Type | Name | Target |
|---|---|---|
| CNAME | `console` | `cname.vercel-dns.com` |
| CNAME | `demo` | `cname.vercel-dns.com` |

Both domains are already attached to their Vercel projects (`brain-console`,
`restaurant-demo`). When added, tell Claude **"DNS is live – do the link swap pass"**,
which flips: hub + /consulting Brain Console links to console.marriottsystems.net,
the /hospitality demo link to demo.marriottsystems.net, and activates the
console.jacobmarriott.com → console.marriottsystems.net redirect
(see `~/brain-console/docs/domain-consolidation-brief.md`, Phase 1).

## 2. Stripe dashboard – webhook endpoint

The audit checkout now runs on marriottsystems.net, but webhook events still point at
the old endpoint (kept alive on web.jacobmarriott.com so nothing is lost):

1. Stripe dashboard → Developers → Webhooks → Add endpoint:
   `https://marriottsystems.net/api/stripe-webhook`
   with events `checkout.session.completed` and `payment_intent.payment_failed`.
2. Copy the new signing secret → Vercel → `marriott-systems` project →
   Settings → Environment Variables → add `STRIPE_WEBHOOK_SECRET` (sensitive,
   production + preview). All other env vars are already set.
3. Redeploy the hub (or tell Claude), test one $297 checkout end-to-end, then delete
   the old endpoint and the `web-jacobmarriott` project's env vars.

## 3. Email forwarding (optional, recommended)

Cloudflare → Email Routing → forward `hello@marriottsystems.net` to your inbox, then
tell Claude to swap the contact email across the hub (currently hello@jacobmarriott.com).

## 4. Hub repo → GitHub

The hub still deploys from local CLI. Create `jacobem1836/marriott-systems`, push, and
connect it in Vercel → marriott-systems → Settings → Git.

## 5. Claude Design

`CLAUDE-DESIGN-PROMPT.md` in this repo is ready to paste (attach
`design-system/tokens.css` with it). When you have the chosen direction's assets,
Claude implements them faithfully across the hub and spoke pages.

## 6. LinkedIn + GitHub profile (separate session)

- LinkedIn: headline "Founder, Marriott Systems · Software Engineering @ UQ", write the
  missing About section from jacobmarriott.com/#about, replace the dAIly banner, add
  Marriott Systems + Brain Console to Experience.
- GitHub profile: founder bio line + pin brain-console, dAIly, and the hub repo.

## 7. Decision log

- Umbrella proceeds on marriottsystems.net; Marriott International trademark adjacency
  consciously accepted (own-name defence; revisit on investment or expansion).
  Optional cheap defence: marriottsystems.dev ($9.99/yr).
- Hospitality is ONE spoke (websites + operations) at /hospitality; the separate
  restaurant-ops sub-brand idea is retired.
- jacobmarriott.com is founder/internship-only; company content lives on the apex.
