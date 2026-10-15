import { AsciiField } from "@/components/ascii-field";
import { ArrowIcon, GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { Wordmark, type WordmarkVariant } from "@/components/wordmark";
import { sections, socials, type Locale } from "@/lib/links";

const socialIcons = { GitHub: GitHubIcon, LinkedIn: LinkedInIcon };

const locales: { locale: Locale; href: string }[] = [
  { locale: "es", href: "/" },
  { locale: "en", href: "/en" },
];

// Running item number and entry stagger across both sections.
const STAGGER = 60;
const layout = sections.map((section, i) => {
  const before = sections
    .slice(0, i)
    .reduce((sum, s) => sum + s.items.length, 0);
  return { section, first: before, delay: 180 + (before + i) * STAGGER };
});
const socialsDelay =
  180 + (sections.reduce((sum, s) => sum + s.items.length, 0) + sections.length) * STAGGER;

const copy = {
  es: { socials: "Redes", language: "Idioma" },
  en: { socials: "Social", language: "Language" },
};

export function Profile({
  variant,
  locale = "es",
}: {
  variant?: WordmarkVariant;
  locale?: Locale;
}) {
  return (
    <>
      <AsciiField />

      {/* Vignette keeps the column legible while the field stays loud at the edges. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_42rem_38rem_at_50%_50%,rgb(5_5_5/78%)_0%,rgb(5_5_5/40%)_55%,transparent_100%)]"
      />

      <nav
        aria-label={copy[locale].language}
        className="animate-rise-in fixed top-4 right-4 z-20 flex items-center gap-1 font-mono text-[11px] tracking-[0.2em] uppercase sm:top-6 sm:right-6"
      >
        {locales.map((l, i) => (
          <span key={l.locale} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden className="text-muted-foreground/40">
                /
              </span>
            )}
            <a
              href={l.href}
              hrefLang={l.locale}
              lang={l.locale}
              aria-current={l.locale === locale ? "page" : undefined}
              className={
                l.locale === locale
                  ? "text-foreground px-1 py-1"
                  : "text-muted-foreground hover:text-accent focus-visible:text-accent px-1 py-1 transition-colors duration-200 focus-visible:outline-none"
              }
            >
              {l.locale}
            </a>
          </span>
        ))}
      </nav>

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:py-16">
        <div className="flex w-full max-w-md flex-col">
          <header className="animate-rise-in flex flex-col items-center text-center">
            <Wordmark variant={variant} />
            <p className="text-muted-foreground mt-5 font-mono text-[13px] tracking-[0.04em]">
              » AI + Software Engineer «
            </p>
          </header>

          {layout.map(({ section, first, delay }) => {
            return (
              <section
                key={section.title.en}
                aria-label={section.title[locale]}
                className="mt-7 sm:mt-9"
              >
                <h2
                  className="text-muted-foreground animate-rise-in flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {section.title[locale]}
                  <span aria-hidden className="bg-hairline h-px flex-1" />
                  <span aria-hidden>
                    {String(section.items.length).padStart(2, "0")}
                  </span>
                </h2>

                <ul className="mt-3 flex flex-col gap-2 sm:gap-2.5">
                  {section.items.map((project, j) => {
                    const n = first + j + 1;
                    return (
                      <li
                        key={project.href}
                        className="animate-rise-in"
                        style={{
                          animationDelay: `${delay + (j + 1) * STAGGER}ms`,
                        }}
                      >
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group border-hairline-strong bg-card focus-visible:ring-accent/40 hover:border-accent focus-visible:border-accent flex items-center gap-4 rounded-[var(--radius)] border px-4 py-3 transition-[border-color,transform] duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] sm:px-5 sm:py-3.5"
                        >
                          <span className="text-muted-foreground/70 group-hover:text-accent group-focus-visible:text-accent font-mono text-[11px] tabular-nums transition-colors duration-200">
                            {String(n).padStart(2, "0")}
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="flex items-baseline justify-between gap-3">
                              <span className="text-[15px] font-medium">
                                {project.name}
                              </span>
                              <span className="text-muted-foreground group-hover:text-accent group-focus-visible:text-accent shrink-0 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-200">
                                {project.kind}
                              </span>
                            </span>
                            <span className="text-muted-foreground mt-0.5 text-[13px] leading-snug">
                              {project.summary[locale]}
                            </span>
                          </span>
                          <ArrowIcon className="text-foreground/40 group-hover:text-accent group-focus-visible:text-accent size-4 shrink-0 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          <nav
            aria-label={copy[locale].socials}
            className="animate-rise-in mt-6 grid grid-cols-2 gap-2.5 sm:mt-8"
            style={{ animationDelay: `${socialsDelay}ms` }}
          >
            {socials.map((social) => {
              const Icon = socialIcons[social.network];
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.network}: ${social.handle}`}
                  className="group border-hairline-strong bg-card focus-visible:ring-accent/40 hover:border-accent focus-visible:border-accent flex items-center justify-center gap-2.5 rounded-[var(--radius)] border px-4 py-3 transition-[border-color,transform] duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]"
                >
                  <Icon className="text-foreground/80 group-hover:text-accent group-focus-visible:text-accent size-4 shrink-0 transition-colors duration-200" />
                  <span className="text-sm font-medium">{social.network}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </main>
    </>
  );
}
