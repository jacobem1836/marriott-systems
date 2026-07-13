# Claude Design prompt – Marriott Systems visual identity exploration

Paste everything below the rule into Claude Design. Attach or paste
`design-system/tokens.css` from this repo alongside it (referenced throughout).

---

## Brief

Design the visual identity and landing experience for **Marriott Systems**
(marriottsystems.net) – a Brisbane software company founded by one engineer, building
AI products and operational systems. It is the umbrella over: **Brain Console**
(flagship – a business-wide AI brain for companies; enterprise buyers whose bar is
credibility), **dAIly** (voice-first morning-brief consumer product), an **AI systems
consulting** practice, and **hospitality websites + operational systems** for
independent Brisbane venues.

Produce **three distinct design directions** as full homepage concepts, then apply the
strongest one to two secondary pages so the system's range is visible.

### What the current site is (and why it's changing)

The current site inherits the founder's personal-site system: near-black graphite
background (oklch 18% 0.012 255), soft terminal-green accent (oklch 82% 0.16 150),
Newsreader display serif over Inter body and Geist Mono labels, numbered lowercase
section labels ("01 / company"), hairline borders, generous spacing. It is restrained
and coherent – but static: no depth, no motion, and its texture reads "developer
portfolio" more than "technology company". The founder wants something **more dynamic
and more interesting** that still feels engineered rather than decorated.

### The three directions to explore

1. **Terminal-editorial, evolved** – keep the graphite/green DNA and mono labelling,
   but add real depth and motion: layered surfaces, scroll-driven reveals, a hero
   with a living element (e.g. a slow-typing prompt, a system diagram that draws
   itself, data pulses along connection lines). The upgrade path with the least
   brand rupture.
2. **Swiss / International for software** – strict grid, oversized numerals,
   high-contrast type hierarchy, engineering-drawing motifs (registration marks,
   dimension lines, node-and-edge diagrams). Light and dark both first-class.
   Motion is precise and sparse: things align, snap, and settle.
3. **Your wildcard** – propose a third direction you believe fits a one-engineer
   company whose products are "systems that know you": memory, connection graphs,
   ambient intelligence. Avoid: gradient-blob AI clichés, glassmorphism defaults,
   generic SaaS dashboards-in-perspective, and dark-luxury tropes.

### Hard constraints (all directions)

- **Typography:** self-hosted fonts only. Current set (Newsreader Variable, Inter,
  Geist Mono) may be kept, partially swapped, or replaced – but justify any swap and
  keep the total to two families plus a mono. Fonts trend crisp and thin, not heavy.
- **Color:** define tokens in oklch. Dark and light themes both intentional – the
  current tokens file shows the shape expected. Accent may change from green, but the
  palette must be disciplined: one accent used semantically, not decoratively.
- **Motion:** compositor-friendly only (transform, opacity, clip-path); every effect
  must have a reduced-motion fallback; nothing that requires a heavy JS library –
  CSS scroll-driven animations and IntersectionObserver-class techniques preferred.
- **Structure to design for (homepage):** wordmark header → company statement hero →
  five ventures (Brain Console leads with visibly more weight; then dAIly, consulting,
  hospitality, founder) → compact footer. The ventures section must NOT be a uniform
  card grid – hierarchy over symmetry.
- **Secondary pages to apply the winner to:** `/hospitality` (a conversion page:
  services with prices, proof, FAQ, CTAs) and `/consulting` (a prose-led offer page).
- **Copy register:** company voice, formal, en dashes, Oxford commas; section labels
  may stay lowercase mono if the direction keeps them.
- **Accessibility:** AA contrast minimum for all text on both themes; visible focus
  states designed, not default.

### Deliverables

For each direction: homepage at 1440 and 390 widths, a tokens block (colors, type
scale, spacing, radii, motion durations), and one paragraph on why it fits the
company. Then: the chosen direction applied to /hospitality and /consulting, plus
hover/focus/active states for links, CTAs, and the FAQ accordion.

The implementation target is Astro with vanilla CSS custom properties – no Tailwind,
no component library – so express the system as tokens + composable patterns, not as
one-off art.
