# Kushagra Varshney — Portfolio

Single-page personal portfolio for a security engineer working across
application security, AI/LLM security, and security automation.

Dark, minimal, editorial. The visual identity comes from colour and typography
rather than hacker cliche — there is no terminal UI, no code rain, no typewriter
or glitch text anywhere in the build, and monospace is not used as a motif.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | TanStack Start (SSR) + React 19 |
| Styling | Tailwind v4, oklch design tokens in `src/styles.css` |
| Motion | GSAP + ScrollTrigger, Lenis for inertia scrolling |
| 3D | React Three Fiber + Three.js (hero scene only) |

## Running it

```bash
npm install
npm run dev
```

The dev server listens on **http://localhost:8080**.

```bash
npm run build     # production build
npm run lint      # eslint + prettier
npm run format    # prettier --write
```

## Design system

Colours live as oklch custom properties in `src/styles.css`:

- Background `#0A0A0A`, panels `#121212`
- Accent `#7C3AED` electric violet
- Text `#F5F5F5` primary, `#8A8A8A` muted
- 1px white diagonal strokes at low opacity as background texture

Change the tokens rather than individual components.

## Motion architecture

- `src/lib/gsap.ts` — `useGsap` runs setup inside a `gsap.context` so every
  tween and ScrollTrigger is reverted on cleanup, and bails out entirely under
  `prefers-reduced-motion`.
- `src/components/portfolio/motion.tsx` — `Reveal` (scroll-scrubbed fade + rise),
  `SplitReveal` (one-shot word set-in), `Counter` (count-up on enter),
  `DiagonalTexture` (parallax background strokes), `useMagnetic` (pointer-follow).
- `src/components/portfolio/SmoothScroll.tsx` — Lenis driven off the GSAP ticker
  so ScrollTrigger stays in sync.
- `src/components/portfolio/Cursor.tsx` — custom cursor, `gsap.quickTo` for lag.

### Hero WebGL

`HeroOrb` lazy-loads `OrbCanvas` after mount, keeping Three.js out of the SSR
pass and out of the main bundle. It falls back to a CSS gradient when WebGL is
unavailable or motion is reduced, and parks the render loop via
`IntersectionObserver` once the hero scrolls away. Shaders live in
`orbShaders.ts` so they can be compiled and inspected independently.

## Accessibility

Every animation is gated on `prefers-reduced-motion`. The FOUC guard in
`styles.css` hides hero and nav elements *only* under
`prefers-reduced-motion: no-preference` — reduced-motion visitors get the
content already visible, since GSAP never runs to reveal it. Keep that pairing
intact when adding new load-in animations.
