export type Project = {
  name: string;
  href: string;
  /** One line, plain words: what it is. */
  summary: string;
  /** Mono tag: what kind of thing the link opens. */
  kind: string;
};

export type Social = {
  network: "GitHub" | "LinkedIn";
  href: string;
  handle: string;
};

export const projects: Project[] = [
  {
    name: "Moonlight",
    href: "https://materiacore.com/moonlight",
    summary: "Editor de imágenes con IA, online",
    kind: "Web app",
  },
  {
    name: "Nova",
    href: "https://materiacore.com/nova",
    summary: "Una IA para todo, en una sola app",
    kind: "Desktop",
  },
  {
    name: "B* Expansion",
    href: "https://onlinelibrary.wiley.com/doi/10.1111/exsy.70333",
    summary: "Paper sobre agentes LLM autónomos",
    kind: "Paper",
  },
  {
    name: "HyperFocus",
    href: "https://play.google.com/store/apps/details?id=com.materiacore.hyperfocus&hl=es",
    summary: "90 min sin pausas hasta el hiperfoco",
    kind: "Android",
  },
  {
    name: "GU Systems",
    href: "https://github.com/SamthinkGit/GU-systems",
    summary: "IA agéntica temprana: control del PC",
    kind: "GitHub",
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
