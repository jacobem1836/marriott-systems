# Manual steps – Marriott Systems ecosystem

Remaining actions Claude cannot perform locally. Tick them off in order.

## 1. Cloudflare DNS – console subdomain

The Brain Console migration to `console.marriottsystems.net` needs a DNS record
(marriottsystems.net DNS is managed in Cloudflare, not Vercel):

- Cloudflare → marriottsystems.net → DNS → Add record:
  - Type: `CNAME`
  - Name: `console`
  - Target: `cname.vercel-dns.com`
  - Proxy status: **DNS only** (grey cloud – Vercel handles TLS)
- The `console.marriottsystems.net` domain has been added to the `brain-console`
  Vercel project already (verify in Vercel → brain-console → Settings → Domains;
  add it there if missing).
- Once it resolves, add redirects from the old domain: in the brain-console repo
  `apps/website/next.config.*`, add a host-based permanent redirect from
  `console.jacobmarriott.com` to `console.marriottsystems.net` (ask Claude – this
  is queued as a follow-up once DNS is live). Do not remove the old domain from
  the Vercel project; it must stay attached so the redirect can serve.

## 2. Email forwarding (optional, recommended)

- Cloudflare → marriottsystems.net → Email Routing → enable, and forward
  `hello@marriottsystems.net` → your real inbox.
- Once live, ask Claude to swap the hub + hospitality-systems contact email from
  `hello@jacobmarriott.com` to `hello@marriottsystems.net`.

## 3. LinkedIn (separate task, out of scope for this build)

- Headline: add "Founder, Marriott Systems" alongside the UQ framing.
- About section: currently missing – write one; the founder bio on
  jacobmarriott.com/#about is the source.
- Banner: currently dAIly-branded; replace with a Marriott Systems or neutral
  terminal-editorial banner.
- Add Brain Console + Marriott Systems to Experience.

## 4. GitHub profile

- github.com/jacobem1836 profile README + bio: add "Founder, Marriott Systems
  (marriottsystems.net)" and pin brain-console, dAIly, and the hub repo.

## 5. Hub repo → GitHub (recommended)

The hub currently deploys via `vercel deploy` from local. For CI parity with the
other sites: create a GitHub repo `marriott-systems`, push, and connect it to the
Vercel project (Vercel → marriott-systems → Settings → Git).

## 6. Trademark note (decision recorded)

Proceeding on marriottsystems.net was a conscious call: "Marriott Systems" in the
hospitality vertical sits near Marriott International's trademark class; your
surname provides a good-faith own-name defence and risk at current scale is low.
Revisit if the company takes investment or expands into accommodation.
Optional cheap defence: register marriottsystems.dev ($9.99/yr, available).
