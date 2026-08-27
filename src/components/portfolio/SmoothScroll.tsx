import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Momentum-based smooth scroll, synced to GSAP's ticker + ScrollTrigger. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Route in-page anchors through Lenis for eased section jumps.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!link || !hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 600);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
