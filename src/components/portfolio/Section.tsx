import type { ReactNode } from "react";
import { DiagonalTexture, Reveal, SplitReveal } from "./motion";

export function Section({
  id,
  label,
  heading,
  children,
}: {
  id: string;
  label: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 border-t border-border/60 py-20 sm:py-28">
      <DiagonalTexture opacity={0.4} />
      <div className="relative mx-auto w-full max-w-[1100px] px-6">
        <Reveal scrub={false} stagger={0.1} y={32}>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
          <SplitReveal
            as="h2"
            text={heading}
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          />
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function Hl({ children }: { children: ReactNode }) {
  return <span className="font-medium text-primary">{children}</span>;
}
