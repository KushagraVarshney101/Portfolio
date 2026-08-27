import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Cursor } from "@/components/portfolio/Cursor";
import { Hero } from "@/components/portfolio/Hero";
import { Nav } from "@/components/portfolio/Nav";
import { Hl, Section } from "@/components/portfolio/Section";
import { SmoothScroll } from "@/components/portfolio/SmoothScroll";
import { Counter, DiagonalTexture, Reveal, useMagnetic } from "@/components/portfolio/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kushagra Varshney — Security Engineer & AppSec Specialist" },
      {
        name: "description",
        content:
          "Portfolio of Kushagra Varshney: security engineer working across application security, AI/LLM security, and security automation. Disclosures acknowledged by NASA, Zoho and NCIIPC.",
      },
      {
        property: "og:title",
        content: "Kushagra Varshney — Security Engineer & AppSec Specialist",
      },
      {
        property: "og:description",
        content:
          "Application security, AI/LLM security research, and security automation — most of it in Python.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

const EXPERIENCE = [
  {
    company: "The World Bank Group",
    role: "Application Security Testing Intern",
    place: "Chennai",
    period: "Apr 2026 – Present",
    points: [
      <>
        Reported a <Hl>High-severity prompt injection flaw</Hl> (Unicode filter bypass) found while
        testing AI-integrated financial tools; ongoing research covers LLM prompt injection, model
        inversion, and adversarial inputs.
      </>,
      <>
        Build Python tooling that automates remediation validation for Azure-hosted systems, and
        work with development teams to land fixes through Azure DevOps pipelines.
      </>,
      <>
        Run static and dynamic analysis with Veracode, Semgrep, and SonarQube on multi-tenant
        financial platforms serving government and institutional clients worldwide, targeting OWASP
        Top 10 vulnerability classes.
      </>,
    ],
  },
  {
    company: "Fluidech IT Services Pvt Ltd",
    role: "Junior Security Analyst",
    place: "Gurugram",
    period: "Jun 2025 – Apr 2026",
    points: [
      <>
        Designed, deployed, and ran a production SOC pipeline (Wazuh, ELK, Shuffle SOAR, MISP, DFIR
        IRIS) in a live data center, cutting 2,000,000+ daily log events to ~150 enriched alerts — a{" "}
        <Hl>99.99% noise reduction</Hl> with no added headcount.
      </>,
      <>
        Automated incident response end to end: detection scripts correlated IOCs and blocked
        malicious IPs on enterprise firewalls in real time, removing manual triage for known threat
        categories.
      </>,
      <>
        Designed and executed threat simulations against OT/ICS environments, modelling attacker
        TTPs from MITRE ATT&CK for ICS to find exploitable gaps in industrial control system
        configurations.
      </>,
    ],
  },
  {
    company: "CyberSapiens LLP",
    role: "Security Analyst, VAPT",
    place: "Remote",
    period: "Jul 2024 – Jan 2025",
    points: [
      <>
        Reported 100+ validated findings, Medium to Critical severity, across client infrastructures
        worldwide; disclosures acknowledged by <Hl>NASA</Hl>, <Hl>Zoho</Hl>, and 2× by India's{" "}
        <Hl>NCIIPC</Hl> (National Critical Information Infrastructure Protection Centre).
      </>,
      <>
        Validated findings technically and wrote remediation guidance delivered directly to client
        stakeholders.
      </>,
    ],
  },
];

const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "AppSec",
    items: [
      "OWASP Top 10",
      "Burp Suite Pro",
      "API Security",
      "Static Analysis (Veracode, Semgrep, SonarQube)",
      "DAST",
      "Secure Code Review",
      "Threat Modeling",
      "Web Pentesting",
    ],
  },
  {
    group: "AI Security",
    items: [
      "LLM Threat Modeling",
      "Prompt Injection",
      "Adversarial ML",
      "Agentic AI Security",
      "AI Integrated App Testing",
    ],
  },
  {
    group: "Dev Tooling",
    items: ["Git", "Linux", "CI/CD Pipelines (Azure DevOps)", "Azure Cloud", "REST APIs"],
  },
  {
    group: "SOC / SIEM",
    items: [
      "Splunk",
      "Wazuh",
      "Alert Triage",
      "IOC Analysis",
      "MISP",
      "OpenCTI",
      "Detection Engineering",
    ],
  },
  {
    group: "OT / ICS",
    items: [
      "ICS Threat Simulation",
      "Industrial Network Defense",
      "Critical Infrastructure Security",
    ],
  },
  {
    group: "Frameworks",
    items: ["MITRE ATT&CK", "NIST", "OWASP", "Responsible Disclosure", "CVE Research"],
  },
  { group: "Languages", items: ["Python", "Bash", "Rust"] },
];

const CERTS = [
  { name: "Certified Red Team Professional (CRTP)", issuer: "Altered Security" },
  { name: "Certified Application Security Practitioner (CASP)", issuer: "SecOps Group" },
  { name: "Certified Cybersecurity Technician (CCT)", issuer: "EC-Council" },
  { name: "Certified in Cybersecurity (CC)", issuer: "ISC2" },
  { name: "CyberOps Associate", issuer: "Cisco" },
];

function MagneticLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.22);
  return (
    <a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={className}
    >
      {children}
    </a>
  );
}

function Portfolio() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <SmoothScroll />
      <Cursor />
      <Nav />

      <Hero />

      {/* ── About ────────────────────────────────────────── */}
      <Section id="about" label="01 / About" heading="Summary">
        <Reveal y={38}>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Security engineer with 2 years of hands-on experience across application security,
            AI/LLM security, and security automation, most of it in Python. Currently testing
            enterprise financial platforms on Azure at The World Bank Group, where AI security
            research surfaced a <Hl>High-severity prompt injection flaw</Hl>. Built a production SOC
            pipeline that ran live in a data center, and <Hl>RedV01</Hl>, an agentic AI penetration
            testing system. Vulnerability disclosures acknowledged by <Hl>NASA</Hl>, <Hl>Zoho</Hl>,
            and India's <Hl>NCIIPC</Hl>.
          </p>
        </Reveal>
        <Reveal className="mt-12 grid gap-4 sm:grid-cols-3" stagger={0.12} y={48}>
          <div
            data-cursor-hover
            className="h-full rounded-md border border-border bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--glow)]"
          >
            <p className="text-3xl font-semibold tracking-tight text-primary">
              <Counter value={99.99} decimals={2} suffix="%" />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              noise reduction — <Counter value={2000000} suffix="+" /> daily events → ~150 alerts
            </p>
          </div>
          <div
            data-cursor-hover
            className="h-full rounded-md border border-border bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--glow)]"
          >
            <p className="text-3xl font-semibold tracking-tight text-primary">
              <Counter value={100} suffix="+" />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              validated findings, Medium to Critical severity
            </p>
          </div>
          <div
            data-cursor-hover
            className="h-full rounded-md border border-border bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--glow)]"
          >
            <p className="text-lg font-medium text-primary">GHSA-gjm7-g266-w3wj</p>
            <p className="mt-2 text-sm text-muted-foreground">SSRF advisory · CVE pending</p>
          </div>
        </Reveal>
      </Section>

      {/* ── Experience ───────────────────────────────────── */}
      <Section id="experience" label="02 / Experience" heading="Work History">
        <div className="relative space-y-14 border-l border-border pl-6 sm:space-y-20 sm:pl-10">
          {EXPERIENCE.map((job) => (
            <Reveal key={job.company} y={52} stagger={0.06}>
              <article className="relative">
                <span className="absolute -left-[1.9rem] top-2 size-2.5 rounded-full bg-primary accent-glow sm:-left-[2.9rem]" />
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {job.period} · {job.place}
                </p>
                <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{job.company}</h3>
                <p className="mt-1 text-sm text-primary">{job.role}</p>
                <ul className="mt-5 space-y-3">
                  {job.points.map((p, j) => (
                    <li
                      key={j}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
                    >
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Projects ─────────────────────────────────────── */}
      <Section id="projects" label="03 / Projects" heading="Selected Work">
        <Reveal className="grid gap-6 lg:grid-cols-2" stagger={0.14} y={56}>
          <article
            data-cursor-hover
            className="flex h-full flex-col rounded-md border border-border bg-panel p-7 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.012] hover:border-primary/70 hover:shadow-[0_1.5rem_3rem_-1rem_oklch(0_0_0/60%),var(--glow)]"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Dec 2024 – Present
            </p>
            <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
              RedV01 — Agentic AI Penetration Testing System
            </h3>
            <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-sm border border-primary/50 px-3 py-1.5 text-xs text-primary">
              <Award className="size-3.5" />
              AWS AI for Bharat 2026 – Semifinalist (Prototype Phase)
            </span>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                <span>
                  Built an agentic AI system that runs the full VAPT workflow, from attack surface
                  discovery through active exploitation to report generation, cutting manual
                  overhead by ~60%.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                <span>
                  Designed the multi-agent architecture on LangFlow and LLMs, with real-time
                  vulnerability correlation and CVSS-based risk scoring wired into the generated
                  reports.
                </span>
              </li>
            </ul>
            <a
              href="https://kushagra.social"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-flex items-center gap-2 text-sm text-primary transition-opacity hover:opacity-70"
            >
              <ExternalLink className="size-4" /> kushagra.social
            </a>
          </article>
          <article
            data-cursor-hover
            className="flex h-full flex-col rounded-md border border-border bg-panel p-7 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.012] hover:border-primary/70 hover:shadow-[0_1.5rem_3rem_-1rem_oklch(0_0_0/60%),var(--glow)]"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Jun 2024 – Aug 2024
            </p>
            <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
              Phishing URL Detection using AI/ML
            </h3>
            <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-sm border border-primary/50 px-3 py-1.5 text-xs text-primary">
              <Award className="size-3.5" />
              IBM Hackathon — 3rd Prize
            </span>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                <span>
                  Trained a Random Forest classifier to <Hl>98.97% accuracy</Hl> on a multi-feature
                  extraction pipeline, classifying URLs as phishing or benign from signals derived
                  during training.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                <span>
                  Built a generative-AI agent on top of it that captures the suspect page in real
                  time, processes the screenshot server-side, and reports the specific{" "}
                  <Hl>red flags and green flags</Hl> behind each verdict — turning a bare
                  classification into an explanation a user can act on.
                </span>
              </li>
            </ul>
          </article>
        </Reveal>
      </Section>

      {/* ── Skills ───────────────────────────────────────── */}
      <Section id="skills" label="04 / Skills" heading="Toolkit">
        <div className="space-y-9">
          {SKILLS.map((group) => (
            <Reveal key={group.group} y={40} stagger={0.05}>
              <div className="grid gap-4 sm:grid-cols-[190px_1fr]">
                <p className="text-sm uppercase tracking-[0.16em] text-primary">{group.group}</p>
                <ul className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      data-cursor-hover
                      className="cursor-default rounded-sm border border-border bg-panel px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Certifications ───────────────────────────────── */}
      <Section id="certifications" label="05 / Certifications" heading="Credentials">
        <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09} y={44}>
          {CERTS.map((c) => (
            <div
              key={c.name}
              data-cursor-hover
              className="flex h-full items-start gap-4 rounded-md border border-border bg-panel p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--glow)]"
            >
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium leading-snug">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.issuer}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* ── Achievements ─────────────────────────────────── */}
      <Section id="achievements" label="06 / Achievements" heading="Recognition">
        <Reveal className="grid gap-4 md:grid-cols-2" stagger={0.1} y={48}>
          <div
            data-cursor-hover
            className="h-full rounded-md border border-border bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--glow)]"
          >
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Security acknowledgements from <Hl>NASA</Hl>, <Hl>Zoho</Hl>, and 2× <Hl>NCIIPC</Hl>{" "}
              (Govt. of India) for responsible vulnerability disclosures
            </p>
          </div>
          <a
            href="https://github.com/basecamp/once-campfire/security/advisories/GHSA-gjm7-g266-w3wj"
            target="_blank"
            rel="noreferrer noopener"
            className="block h-full rounded-md border border-primary/40 bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--glow)]"
          >
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Discovered and reported an SSRF vulnerability (CWE-918) in Basecamp's open-source
              once-campfire — published as <Hl>GHSA-gjm7-g266-w3wj</Hl>; <Hl>CVE pending</Hl>{" "}
              assignment.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-xs text-primary">
              <ExternalLink className="size-3.5" /> view advisory
            </span>
          </a>
          <div
            data-cursor-hover
            className="h-full rounded-md border border-border bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--glow)]"
          >
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              <Hl>AWS AI for Bharat 2026 – Semifinalist</Hl> (Prototype Phase), AWS AI for Bharat
              2026 (AWS × Hack2skill), with <Hl>RedV01</Hl>
            </p>
          </div>
          <div
            data-cursor-hover
            className="h-full rounded-md border border-border bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--glow)]"
          >
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Chapter Lead – OWASP Student Chapter, GLA University; Technical Lead – Club
              Cyberonites; built CTF challenges for university events
            </p>
          </div>
          <div
            data-cursor-hover
            className="h-full rounded-md border border-border bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--glow)] md:col-span-2"
          >
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Ranked 19th nationally in Defcon Delhi CTF; top 5% globally on TryHackMe
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── Publications & Education ──────────────────────── */}
      <Section
        id="publications"
        label="07 / Publications & Education"
        heading="Writing / Academics"
      >
        <Reveal className="grid gap-6 md:grid-cols-2" stagger={0.12} y={44}>
          <div className="h-full rounded-md border border-border bg-panel p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Publication</p>
            <p className="mt-3 text-lg leading-snug">
              "The Rise of Deepfakes: Impact, Origins, and Technical Insights"
            </p>
            <p className="mt-2 text-sm text-primary">Cyber Peace Foundation (Jul 2025)</p>
          </div>
          <div className="h-full rounded-md border border-border bg-panel p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Education · 2022 – 2026
            </p>
            <p className="mt-3 text-lg leading-snug">GLA University, Mathura</p>
            <p className="mt-2 text-sm text-muted-foreground">
              B.Tech, Computer Science &amp; Engineering (Specialization in Cyber Security &amp;
              Forensics)
            </p>
            <p className="mt-2 text-sm text-primary">First Division with Honours, CPI 8.11</p>
          </div>
        </Reveal>
      </Section>

      {/* ── Contact ──────────────────────────────────────── */}
      <Section id="contact" label="08 / Contact" heading="Get in Touch">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <Reveal stagger={0.08} y={30}>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="mailto:kushagravarshney12a@gmail.com"
                  className="inline-flex items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-primary"
                >
                  <Mail className="size-4 text-primary" /> kushagravarshney12a@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919058808818"
                  className="inline-flex items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-primary"
                >
                  <Phone className="size-4 text-primary" /> +91-9058808818
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/hacksprob"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-primary"
                >
                  <Linkedin className="size-4 text-primary" /> linkedin.com/in/hacksprob
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/kushagravarshney101"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-primary"
                >
                  <Github className="size-4 text-primary" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://kushagra.social"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-primary"
                >
                  <Globe className="size-4 text-primary" /> kushagra.social
                </a>
              </li>
            </ul>
          </Reveal>
          <Reveal scrub={false} y={30}>
            <MagneticLink
              href="mailto:kushagravarshney12a@gmail.com"
              className="inline-flex items-center gap-3 rounded-md border border-primary/60 bg-panel px-7 py-4 text-sm text-primary transition-all duration-500 hover:bg-primary/10 hover:shadow-[var(--glow-strong)]"
            >
              $ send --mail
            </MagneticLink>
          </Reveal>
        </div>
      </Section>

      <footer className="relative border-t border-border/60 py-10">
        <DiagonalTexture opacity={0.3} />
        <div className="relative mx-auto flex w-full max-w-[1100px] flex-col gap-2 px-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Kushagra Varshney — Security Engineer</p>
          <p>© 2026 · built with too much coffee</p>
        </div>
      </footer>
    </div>
  );
}
