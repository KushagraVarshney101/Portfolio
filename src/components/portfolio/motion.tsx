import { gsap, ScrollTrigger, useGsap } from "@/lib/gsap";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-linked reveal: children translate + fade in with a slight stagger,
 * scrubbed against scroll position rather than fired as a one-shot.
 */
export function Reveal({
  children,
  className = "",
  stagger = 0.08,
  y = 44,
  scrub = true,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  scrub?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.children.length ? Array.from(el.children) : [el];
    gsap.set(targets, { willChange: "transform, opacity" });

    if (scrub) {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top 55%",
            scrub: 0.8,
          },
        },
      );
      return;
    }

    gsap.fromTo(
      targets,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power4.out",
        stagger,
        delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );
  }, [scrub, stagger, y, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Hero-grade word-by-word set-in. Runs once on mount, power4.out. */
export function SplitReveal({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
}) {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll("[data-word] > span"),
      { yPercent: 118, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.25,
        ease: "power4.out",
        stagger: 0.07,
        delay,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      },
    );
  }, [text, delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} data-word className="inline-block overflow-hidden pb-[0.06em]">
          <span className="inline-block">{word}</span>
          {i < text.split(" ").length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}

/** Counts up to `value` when scrolled into view. */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(
    () => `${(0).toLocaleString("en-US", { minimumFractionDigits: decimals })}`,
  );

  useGsap(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: value,
      duration: 1.9,
      ease: "power2.out",
      onUpdate: () =>
        setDisplay(
          obj.n.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }),
        ),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
    return () => {
      tween.kill();
    };
  }, [value, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/** Parallax drift for the decorative diagonal texture. */
export function DiagonalTexture({ opacity = 1 }: { opacity?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { yPercent: -8, xPercent: -2 },
      {
        yPercent: 8,
        xPercent: 2,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={ref}
        className="diagonals-layer -inset-y-[18%]"
        style={{ opacity, position: "absolute" }}
      />
    </div>
  );
}

/** Magnetic hover: element eases slightly toward the pointer. */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * strength,
        y: (e.clientY - (r.top + r.height / 2)) * strength,
        duration: 0.5,
        ease: "power3.out",
      });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return ref;
}

export { ScrollTrigger };
