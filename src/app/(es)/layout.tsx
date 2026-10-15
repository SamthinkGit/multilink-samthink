import type { Metadata, Viewport } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "samthink",
  description:
    "AI + Software Engineer. Proyectos e investigación: Moonlight, Nova, HyperFocus y agentes de IA.",
  alternates: { languages: { es: "/", en: "/en" } },
  openGraph: {
    title: "samthink",
    description: "AI + Software Engineer. Proyectos e investigación: Moonlight, Nova, HyperFocus y agentes de IA.",
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fontVariables} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
