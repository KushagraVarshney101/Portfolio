import { useRef } from "react";
import { FileText, Github, Linkedin, Globe } from "lucide-react";
import { gsap, useGsap } from "@/lib/gsap";
import { DiagonalTexture, useMagnetic } from "./motion";
import { HeroOrb } from "./HeroOrb";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.2);
  return (
    <a
      ref={ref}
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex text-foreground/80 transition-colors duration-300 hover:text-primary"
    >
      {children}
    </a>
  );
}

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const resumeRef = useMagnetic<HTMLAnchorElement>(0.25);

  useGsap(() => {
    const el = root.current;
    if (!el) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 0.8 } });
    tl.fromTo(
      el.querySelectorAll("[data-hero-reveal]"),
      { y: 44, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1 },
      0,
    ).fromTo(
      orb.current,
      { scale: 0.86, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.6 },
      0.1,
    );
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16"
    >
      <DiagonalTexture opacity={0.45} />

      {/* soft violet bleed behind the orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.541 0.253 293.009 / 45%) 0%, oklch(0.541 0.253 293.009 / 12%) 45%, transparent 72%)",
        }}
      />

      {/* WebGL scene — full-bleed so the particle field has room to spread */}
      <div ref={orb} data-hero-orb aria-hidden className="pointer-events-none absolute inset-0">
        <HeroOrb className="inset-0" />
      </div>

      <div className="relative mx-auto w-full max-w-[1240px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div data-hero-reveal className="lg:pr-8">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Hello, I'm</p>
            <h1 className="mt-4 font-semibold leading-[0.94] tracking-[-0.03em] text-foreground">
              <span className="block text-[clamp(2.75rem,7vw,4.5rem)]">KUSHAGRA</span>
              <span className="block text-[clamp(2.75rem,7vw,4.5rem)]">VARSHNEY</span>
            </h1>
          </div>

          <div data-hero-reveal className="lg:text-right">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
              A Security Professional
            </p>
            <p className="mt-4 font-semibold leading-[0.94] tracking-[-0.03em]">
              <span className="block bg-gradient-to-r from-primary to-foreground bg-clip-text text-[clamp(2.75rem,7vw,4.5rem)] text-transparent lg:bg-gradient-to-l">
                SECURITY
              </span>
              <span className="block text-[clamp(2.75rem,7vw,4.5rem)] text-foreground">
                ENGINEER
              </span>
            </p>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between lg:mt-28">
          <div data-hero-reveal className="flex flex-col gap-5">
            <IconLink href="https://github.com/kushagravarshney101" label="GitHub">
              <Github className="size-5" />
            </IconLink>
            <IconLink href="https://linkedin.com/in/hacksprob" label="LinkedIn">
              <Linkedin className="size-5" />
            </IconLink>
            <IconLink href="https://kushagra.social" label="Website">
              <Globe className="size-5" />
            </IconLink>
          </div>

          <a
            ref={resumeRef}
            data-hero-reveal
            href="https://drive.google.com/file/d/1eJsZgMBH7LMPUmEBpAgcNuVnrp7it3rq/view?usp=sharing"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            <FileText className="size-4" /> Resume
          </a>
        </div>
      </div>
    </section>
  );
}
