import {
  Inter,
  Merriweather,
  Nunito,
  Space_Grotesk,
  Urbanist,
  Work_Sans,
} from "next/font/google";

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontUrbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const caveat = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const contentFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "300", "500", "600", "700"],
});
