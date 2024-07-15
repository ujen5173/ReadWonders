import { Merienda, Merriweather, Source_Sans_3 } from "next/font/google";

export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

export const suezOne = Merienda({
  subsets: ["latin"],
  variable: "--font-suez-one",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const contentFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans-3",
});
