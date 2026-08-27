import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const INTERACTIVE = "a, button, [data-cursor-hover]";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    if (window.matchMedia("(hover: none)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const moveDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const moveRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      moveDot(e.clientX);
      moveDotY(e.clientY);
      moveRing(e.clientX);
      moveRingY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(INTERACTIVE);
      if (!target) return;
      gsap.to(dot, { scale: 0.35, duration: 0.35, ease: "power3.out" });
      gsap.to(ring, {
        scale: 2.6,
        borderColor: "oklch(0.541 0.253 293.009)",
        backgroundColor: "oklch(0.541 0.253 293.009 / 18%)",
        boxShadow: "0 0 1.25rem oklch(0.541 0.253 293.009 / 55%)",
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(INTERACTIVE);
      if (!target) return;
      gsap.to(dot, { scale: 1, duration: 0.35, ease: "power3.out" });
      gsap.to(ring, {
        scale: 1,
        borderColor: "oklch(1 0 0 / 35%)",
        backgroundColor: "transparent",
        boxShadow: "none",
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onLeaveWindow = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeaveWindow);
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 size-9 rounded-full border border-white/35"
      />
      <div ref={dotRef} className="absolute left-0 top-0 size-1.5 rounded-full bg-primary" />
    </div>
  );
}
