import { useEffect, useRef, useState } from "react";
import { gsap, useGsap } from "@/lib/gsap";
import { useMagnetic } from "./motion";

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

const EMAIL = "kushagravarshney12a@gmail.com";

function NavLink({
  href,
  label,
  active,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3);
  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      className={`inline-block text-[0.7rem] uppercase tracking-[0.24em] transition-colors duration-300 hover:text-primary ${
        active ? "text-primary" : "text-muted-foreground"
      } ${className}`}
    >
      {label}
    </a>
  );
}

export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);

  // Part of the one-time hero load-in: nav items settle in before the name.
  useGsap(() => {
    const el = navRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll("[data-nav-reveal]"),
      { y: -18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power4.out", stagger: 0.1 },
    );
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { threshold: [0.15, 0.4], rootMargin: "-15% 0px -45% 0px" },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        ref={navRef}
        className="relative mx-auto flex w-full max-w-[1240px] items-center justify-between px-6 py-6"
      >
        <a
          data-nav-reveal
          href="#top"
          className="text-sm font-semibold uppercase tracking-[0.18em] transition-colors hover:text-primary"
        >
          Kushagra<span className="text-primary">.</span>
        </a>
        <a
          data-nav-reveal
          href={`mailto:${EMAIL}`}
          className="absolute left-1/2 hidden -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary lg:inline-block"
        >
          {EMAIL}
        </a>
        <ul data-nav-reveal className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <NavLink href={`#${l.id}`} label={l.label} active={active === l.id} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          data-nav-reveal
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      {open && (
        <ul className="space-y-1 border-t border-border/70 bg-background/95 px-6 py-4 backdrop-blur-md md:hidden">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`block py-2 text-sm uppercase tracking-[0.2em] ${
                  active === l.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${EMAIL}`} className="block py-2 text-sm text-muted-foreground">
              {EMAIL}
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
