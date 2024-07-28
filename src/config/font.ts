import {
  IBM_Plex_Serif,
  Merienda,
  Merriweather,
  Source_Sans_3,
} from "next/font/google";

// Logo
export const merienda = Merienda({
  subsets: ["latin"],
  variable: "--font-merienda-one",
  weight: ["400", "600", "700"],
});

// Global font
export const indexFont = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-serif",
});

// Normal font
export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

// Chapter content
export const contentFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans-3",
});
