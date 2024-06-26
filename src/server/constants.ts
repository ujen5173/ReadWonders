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

const genres: {
  id: number;
  name: string;
  slug: string;
  description: string;
  stories: number | null;
}[] = [
  {
    id: 1,
    name: "Fantasy",
    slug: "/genre/fantasy",
    description:
      "A genre of speculative fiction set in a fictional universe, often inspired by real-world myth and folklore.",
    stories: 256789,
  },
  {
    id: 2,
    name: "Science Fiction",
    slug: "/genre/science-fiction",
    description:
      "A genre of fiction that deals with the impact of imagined innovations in science or technology, often in a futuristic setting.",
    stories: 459821,
  },
  {
    id: 3,
    name: "Mystery",
    slug: "/genre/mystery",
    description:
      "A genre of fiction that deals with the solution of a crime or the unraveling of secrets.",
    stories: 128674,
  },
  {
    id: 4,
    name: "Romance",
    slug: "/genre/romance",
    description:
      "A genre centered on romantic relationships between characters.",
    stories: 698324,
  },
  {
    id: 5,
    name: "Horror",
    slug: "/genre/horror",
    description:
      "A genre of speculative fiction intended to frighten, scare, or disgust its readers.",
    stories: 321875,
  },
  {
    id: 6,
    name: "Thriller",
    slug: "/genre/thriller",
    description:
      "A genre characterized by excitement, suspense, and high levels of anticipation.",
    stories: 567983,
  },
  {
    id: 7,
    name: "Historical Fiction",
    slug: "/genre/historical-fiction",
    description:
      "A genre in which the story is set in the past, often featuring historical figures and events.",
    stories: 84731,
  },
  {
    id: 8,
    name: "Non-Fiction",
    slug: "/genre/non-fiction",
    description: "A genre of writing that is based on factual information.",
    stories: 159753,
  },
  {
    id: 9,
    name: "Young Adult",
    slug: "/genre/young-adult",
    description: "A genre of fiction written for readers aged 12 to 18.",
    stories: 987654,
  },
  {
    id: 10,
    name: "Adventure",
    slug: "/genre/adventure",
    description:
      "A genre of fiction that typically features stories of survival, exploration, and risk-taking.",
    stories: 432109,
  },
  {
    id: 11,
    name: "Dystopian",
    slug: "/genre/dystopian",
    description:
      "A genre of speculative fiction that depicts a society characterized by poverty, squalor, or oppression.",
    stories: 385621,
  },
];

export const getGenre = () => {
  const randomPlace = Math.floor(Math.random() * genres.length + 1);

  genres.splice(randomPlace, 0, {
    id: 654864,
    name: "Want to write a book?",
    slug: "/write",
    description:
      "Start writing your book today with our easy-to-use writing tools.",
    stories: null,
  });

  return genres;
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
