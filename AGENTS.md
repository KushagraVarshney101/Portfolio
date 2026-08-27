# Agent notes

Personal portfolio for Kushagra Varshney — Security Engineer (AppSec / AI-LLM Security).
TanStack Start + React 19 + Tailwind v4, with GSAP + Lenis for motion and
React Three Fiber for the hero's WebGL scene.

## Design constraints — do not violate

The visual identity deliberately avoids hacker cliche. Never reintroduce:

- terminal / console UI with `$` prompts
- matrix-style falling code rain
- looping typewriter text
- glitch / scramble / "decrypt" text effects
- monospace as a design motif

Security identity is carried by colour (violet on near-black) and copy alone.
The one permitted nod is small uppercase section labels such as `01 / About`,
set in the body sans font.

## Colour system

Defined in `src/styles.css` as oklch tokens. Background `#0A0A0A`, accent
`#7C3AED`, text `#F5F5F5` primary and `#8A8A8A` muted. Change the tokens, not
individual components.

## Motion

- `src/lib/gsap.ts` — `useGsap` wraps `gsap.context` and bails out under
  `prefers-reduced-motion`, so anything it animates must be readable without JS.
- Elements hidden by the FOUC guard in `styles.css` (`[data-hero-reveal]`,
  `[data-nav-reveal]`, `[data-hero-orb]`) are only hidden under
  `prefers-reduced-motion: no-preference`. Keep that pairing intact.
- The hero WebGL scene is the only looping animation on the page.
