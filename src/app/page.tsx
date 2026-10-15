import { AsciiField } from "@/components/ascii-field";
import { ArrowIcon, GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { projects, socials } from "@/lib/links";

const socialIcons = { GitHub: GitHubIcon, LinkedIn: LinkedInIcon };

export default function Home() {
  return (
    <>
      <AsciiField />

      {/* Vignette keeps the column legible while the field stays loud at the edges. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_42rem_38rem_at_50%_50%,rgb(5_5_5/78%)_0%,rgb(5_5_5/40%)_55%,transparent_100%)]"
      />

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:py-16">
        <div className="flex w-full max-w-md flex-col">
          <header className="animate-rise-in flex flex-col items-center text-center">
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
              ~/portfolio
            </p>
            <h1 className="font-heading mt-4 text-[clamp(2.1rem,9vw,2.75rem)] leading-none font-bold tracking-[0.02em] uppercase">
              samthink
              <span className="text-accent animate-caret">_</span>
            </h1>
            <p className="text-muted-foreground mt-5 font-mono text-[13px] leading-relaxed">
              Construyo productos de IA en MaterIA Core
              <br />e investigo agentes autónomos.
            </p>
          </header>

          <section aria-labelledby="proyectos" className="mt-8 sm:mt-11">
            <h2
              id="proyectos"
              className="text-muted-foreground animate-rise-in flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase [animation-delay:120ms]"
            >
              Proyectos
              <span aria-hidden className="bg-hairline h-px flex-1" />
              <span aria-hidden>{String(projects.length).padStart(2, "0")}</span>
            </h2>

            <ul className="mt-4 flex flex-col gap-2 sm:gap-2.5">
              {projects.map((project, i) => (
                <li
                  key={project.href}
                  className="animate-rise-in"
                  style={{ animationDelay: `${180 + i * 70}ms` }}
                >
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border-hairline-strong bg-card focus-visible:ring-accent/40 hover:border-accent focus-visible:border-accent flex items-center gap-4 rounded-[var(--radius)] border px-4 py-3 transition-[border-color,transform] duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] sm:px-5 sm:py-3.5"
                  >
                    <span className="text-muted-foreground/70 group-hover:text-accent group-focus-visible:text-accent font-mono text-[11px] tabular-nums transition-colors duration-200">
                      {String(i + 1).padStart(2, "0")}
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
                        {project.summary}
                      </span>
                    </span>
                    <ArrowIcon className="text-foreground/40 group-hover:text-accent group-focus-visible:text-accent size-4 shrink-0 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <nav
            aria-label="Redes"
            className="animate-rise-in mt-6 grid grid-cols-2 sm:mt-8 gap-2.5 [animation-delay:560ms]"
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

          <footer className="text-muted-foreground/60 animate-rise-in mt-8 text-center sm:mt-12 font-mono text-[10px] tracking-[0.2em] uppercase [animation-delay:640ms]">
            Toca el fondo
          </footer>
        </div>
      </main>
    </>
  );
}
