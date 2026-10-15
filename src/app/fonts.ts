import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

// Same face as materiacore.com.
const body = localFont({
  variable: "--font-body",
  src: [
    { path: "../fonts/AllianceNo1-Light.woff2", weight: "300" },
    { path: "../fonts/AllianceNo1-Regular.woff2", weight: "400" },
    { path: "../fonts/AllianceNo1-Medium.woff2", weight: "500" },
  ],
});

const label = JetBrains_Mono({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["200", "400", "500"],
});

export const fontVariables = `${body.variable} ${label.variable}`;
