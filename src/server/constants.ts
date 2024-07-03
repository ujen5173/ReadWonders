import { TReadingListCard } from "~/types";

export const limit = 10;

export const skip = 0;

export const slugy = {
  lower: true,
  strict: true,
  replacement: "-",
  trim: true,
  locale: "en",
};

export const cardWidth = 217.5;

export const cardHeight = 310;

export const getGenre = (
  data: {
    stories: number | null;
    id: string;
    description: string | null;
    name: string;
    slug: string;
  }[],
) => {
  const randomPlace = Math.floor(Math.random() * 8);

  data.splice(randomPlace, 0, {
    id: "654864",
    name: "Want to write a book?",
    slug: "/write",
    description:
      "Start writing your book today with our easy-to-use writing tools.",
    stories: null,
  });

  return data;
};

// reading list mini book size
export const bookWidth = cardWidth / 1.5;

export const bookHeight = cardHeight / 1.4;

export const defaultReadingList: TReadingListCard[] = [
  {
    stories: [],
    id: "001",
    title: "My Reading List",
    slug: "/",
    description: null,
  },
];
