export type Locale = "es" | "en";

type Localized = Record<Locale, string>;

export type Project = {
  name: string;
  href: string;
  /** One line, plain words: what it is. */
  summary: Localized;
  /** Mono tag: what kind of thing the link opens. */
  kind: string;
};

export type Section = {
  title: Localized;
  items: Project[];
};

export type Social = {
  network: "GitHub" | "LinkedIn";
  href: string;
  handle: string;
};

const all: Project[] = [
  {
    name: "Moonlight",
    href: "https://materiacore.com/moonlight",
    summary: { es: "Editor de Imágenes AI-First", en: "AI-First Image Editor" },
    kind: "Web app",
  },
  {
    name: "Nova",
    href: "https://materiacore.com/nova",
    summary: { es: "Una IA para todo", en: "One AI for everything" },
    kind: "Desktop",
  },
  {
    name: "B* Expansion",
    href: "https://onlinelibrary.wiley.com/doi/10.1111/exsy.70333",
    summary: { es: "Algoritmos de Optimización de agentes IA", en: "Optimization Algorithms for AI Agents" },
    kind: "Paper",
  },
  {
    name: "HyperFocus",
    href: "https://play.google.com/store/apps/details?id=com.materiacore.hyperfocus&hl=es",
    summary: { es: "Estrategia de Concentración Intensiva", en: "Intensive Focus Strategy" },
    kind: "Android",
  },
  {
    name: "GU Systems",
    href: "https://github.com/SamthinkGit/GU-systems",
    summary: { es: "Investigación sobre Arquitecturas Agénticas", en: "Research on Agentic Architectures" },
    kind: "GitHub",
  },
];

const byName = (name: string) => all.find((p) => p.name === name)!;

export const sections: Section[] = [
  {
    title: { es: "Proyectos", en: "Projects" },
    items: ["Moonlight", "Nova", "HyperFocus"].map(byName),
  },
  {
    title: { es: "Research", en: "Research" },
    items: ["B* Expansion", "GU Systems"].map(byName),
  },
];

export const socials: Social[] = [
  {
    network: "GitHub",
    href: "https://github.com/SamthinkGit",
    handle: "SamthinkGit",
  },
  {
    network: "LinkedIn",
    href: "https://www.linkedin.com/in/samthink",
    handle: "in/samthink",
  },
];
