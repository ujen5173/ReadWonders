import {
  Inter,
  Merienda,
  Merriweather,
  Nunito,
  Open_Sans,
  Rubik,
  Work_Sans,
} from "next/font/google";

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontUrbanist = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const caveat = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-caveat",
});

export const suezOne = Merienda({
  subsets: ["latin"],
  variable: "--font-suez-one",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const contentFont = Open_Sans({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});
