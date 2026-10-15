import { AsciiField } from "@/components/ascii-field";
import { Wordmark, wordmarkVariants } from "@/components/wordmark";

// Temporary chooser for the headline treatment. Delete once one is picked.
export default function Variantes() {
  return (
    <>
      <AsciiField />
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-12">
        <p className="text-muted-foreground mb-4 text-center font-mono text-[11px] tracking-[0.2em] uppercase">
          Variantes del título · toca una para verla a página completa
        </p>
        {wordmarkVariants.map((v) => (
          <a
            key={v.id}
            href={`/variantes/${v.id}`}
            className="group border-hairline-strong bg-card hover:border-accent flex flex-col items-center gap-4 rounded-[var(--radius)] border px-6 py-8 text-center transition-colors duration-200"
          >
            <span className="text-muted-foreground group-hover:text-accent font-mono text-[11px] tracking-[0.2em] uppercase transition-colors">
              {String(v.id).padStart(2, "0")} · {v.label}
            </span>
            <Wordmark variant={v.id} />
            <span className="text-muted-foreground font-mono text-[13px] tracking-[0.04em]">
              » AI + Software Engineer «
            </span>
            <span className="text-muted-foreground/60 text-xs">{v.note}</span>
          </a>
        ))}
      </main>
    </>
  );
}
