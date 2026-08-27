import { Suspense, lazy, useEffect, useRef, useState } from "react";

const OrbCanvas = lazy(() => import("./OrbCanvas"));

/**
 * Static stand-in for the WebGL orb. Also the final visual for
 * prefers-reduced-motion and for browsers without WebGL.
 */
function StaticOrb() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 rounded-full blur-2xl"
      style={{
        background:
          "radial-gradient(circle at 44% 40%, oklch(0.82 0.12 293.009 / 88%) 0%, oklch(0.541 0.253 293.009 / 72%) 34%, oklch(0.35 0.2 293.009 / 30%) 62%, transparent 76%)",
      }}
    />
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * Soft glowing abstract orb — the hero's focal visual.
 *
 * Client-only: the Three.js bundle is lazy-loaded after mount so it never
 * reaches the SSR pass. Rendering pauses while the hero is off-screen.
 */
export function HeroOrb({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!hasWebGL()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!enabled || !el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? true), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return (
    <div ref={host} aria-hidden className={`pointer-events-none absolute ${className}`}>
      {enabled ? (
        <Suspense fallback={<StaticOrb />}>
          <OrbCanvas active={visible} />
        </Suspense>
      ) : (
        <StaticOrb />
      )}
    </div>
  );
}
