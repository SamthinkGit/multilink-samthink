/*
  Candidate treatments for the "samthink" headline. Variant 1 is the one
  shipped on "/"; "/variantes" renders all of them side by side to choose.
*/

export const wordmarkVariants = [
  {
    id: 1,
    label: "Alliance Light · minúsculas + cursor",
    note: "La fuente de tus webs, fina y con el cursor de terminal",
  },
  {
    id: 2,
    label: "Alliance Regular · versalitas espaciadas",
    note: "Mayúsculas finas con mucho aire, más editorial",
  },
  {
    id: 3,
    label: "Alliance Light · etiqueta <samthink />",
    note: "Nombre en Alliance, sintaxis JSX en mono gris",
  },
  {
    id: 4,
    label: "Alliance Light · ruta ~/samthink",
    note: "Prefijo de shell en mono, nombre en Alliance",
  },
  {
    id: 5,
    label: "Geist Mono ExtraLight · minúsculas",
    note: "Todo mono, muy fino: 100% programador",
  },
  {
    id: 6,
    label: "JetBrains Mono Thin · mayúsculas espaciadas",
    note: "Mono fina en mayúsculas, estilo instrumento",
  },
] as const;

export type WordmarkVariant = (typeof wordmarkVariants)[number]["id"];

const caret = <span className="text-accent animate-caret">_</span>;
// [regular, compact] sizes: lowercase marks, then the wide-tracked caps.
const sizes = {
  lower: ["text-[clamp(2.4rem,11vw,3.25rem)]", "text-[2.1rem]"],
  alliance: ["text-[clamp(1.6rem,7.5vw,2.25rem)]", "text-[1.45rem]"],
  mono: ["text-[clamp(1.7rem,8vw,2.4rem)]", "text-[1.5rem]"],
} as const;

export function Wordmark({
  variant = 1,
  compact = false,
}: {
  variant?: WordmarkVariant;
  /** Fixed, smaller size for the side-by-side chooser. */
  compact?: boolean;
}) {
  const k = compact ? 1 : 0;
  const size = `${sizes.lower[k]} leading-none`;
  switch (variant) {
    case 1:
      return (
        <h1 className={`${size} font-sans font-light tracking-[-0.03em]`}>
          samthink{caret}
        </h1>
      );
    case 2:
      return (
        <h1
          className={`${sizes.alliance[k]} pl-[0.32em] leading-none font-sans font-normal tracking-[0.32em] uppercase`}
        >
          Samthink
        </h1>
      );
    case 3:
      return (
        <h1 className={`${size} font-sans font-light tracking-[-0.03em]`}>
          <span className="text-muted-foreground/70 font-mono text-[0.55em] font-extralight tracking-normal">
            &lt;
          </span>
          samthink
          <span className="text-muted-foreground/70 font-mono text-[0.55em] font-extralight tracking-normal">
            {" "}
            /<span className="text-accent">&gt;</span>
          </span>
        </h1>
      );
    case 4:
      return (
        <h1 className={`${size} font-sans font-light tracking-[-0.03em]`}>
          <span className="text-muted-foreground mr-[0.12em] font-mono text-[0.62em] font-extralight tracking-normal">
            ~/
          </span>
          samthink
        </h1>
      );
    case 5:
      return (
        <h1
          className={`${size} font-geist-mono font-extralight tracking-[-0.04em]`}
        >
          samthink{caret}
        </h1>
      );
    case 6:
      return (
        <h1
          className={`${sizes.mono[k]} pl-[0.22em] leading-none font-mono font-thin tracking-[0.22em] uppercase`}
        >
          Samthink
        </h1>
      );
  }
}
