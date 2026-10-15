import { AsciiField } from "@/components/ascii-field";
import { Wordmark, wordmarkVariants } from "@/components/wordmark";

// Temporary chooser for the headline treatment. Delete once one is picked.
export default function Variantes() {
  return (
    <>
      <AsciiField />
      <main className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-3 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
        <p className="text-muted-foreground col-span-full mb-2 text-center font-mono text-[11px] tracking-[0.2em] uppercase">
          Variantes del título · toca una para verla a página completa
        </p>
        {wordmarkVariants.map((v) => (
          <a
            key={v.id}
            href={`/variantes/${v.id}`}
            className="group border-hairline-strong bg-card hover:border-accent flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] border px-4 py-6 text-center transition-colors duration-200"
          >
            <span className="text-muted-foreground group-hover:text-accent font-mono text-[11px] tracking-[0.2em] uppercase transition-colors">
              {String(v.id).padStart(2, "0")} · {v.label}
            </span>
            <Wordmark variant={v.id} compact />
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
