import { type TCard } from "~/types";

export const featuredStories: TCard[] = [
  {
    id: "1",
    title: "The Crimson Shard",
    slug: "the-crimson-shard",
    description:
      "A young sorcerer must uncover the secrets of a mysterious crimson shard to save her kingdom from an ancient evil.",
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
    tags: ["fantasy", "adventure", "magic"],
    isPremium: false,

    isMature: false,
    category: "Fiction",
    reads: 12345,
    author: {
      name: "Jihyo",
    },
  },
  {
    id: "2",
    title: "Cyber Syndicate",
    slug: "cyber-syndicate",
    description:
      "In a world ruled by megacorporations, a group of hackers fight for freedom and justice against the oppressive system.",
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
    tags: ["cyberpunk", "thriller", "hacking"],
    isPremium: true,

    isMature: true,
    category: "Science Fiction",
    reads: 8976,
    author: {
      name: "Jihyo",
    },
  },
  {
    id: "ash45hdc",
    title: "The Enchanting Isle",
    slug: "the-enchanting-isle",
    description:
      "A captivating tale of adventure and magic on a mystical island.",
    tags: ["fantasy", "adventure", "magic"],
    category: "Young Adult",
    reads: 123,
    isPremium: true,

    isMature: true,
    author: {
      name: "Jihyo",
    },
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
  },
];

export const latestStories: TCard[] = [
  {
    id: "Asdcq3rhewrj4g",
    title: "The Painted Veil",
    slug: "the-painted-veil",
    description:
      "A historical romance set against the backdrop of a forbidden love affair.",
    tags: ["historical fiction", "romance", "drama"],
    category: "Adult",
    reads: 423,
    isPremium: true,

    isMature: true,
    author: {
      name: "Jihyo",
    },
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
  },
  {
    id: "Asdcqfgn3r4g",

    title: "Culinary Capers",
    slug: "culinary-capers",
    description:
      "A cozy mystery with a dash of humor, following a chef who solves culinary crimes.",
    tags: ["mystery", "comedy", "foodie"],
    category: "Adult",
    reads: 878,
    isPremium: true,

    isMature: true,
    author: {
      name: "Jihyo",
    },
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
  },
];

export const topPicks: TCard[] = [
  {
    id: "Asdc3452yhq3r4g",

    title: "Starlight Sonata",
    slug: "starlight-sonata",
    description:
      "A heartwarming story of music, love, and following your dreams.",
    tags: ["romance", "music", "drama"],
    category: "Contemporary",
    reads: 456,
    isPremium: true,

    isMature: true,
    author: {
      name: "Jihyo",
    },
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
  },
  {
    id: "Asdcq3wegr4g",
    title: "Codex of Shadows",
    slug: "codex-of-shadows",
    description:
      "A thrilling urban fantasy about a hidden world of magic and mystery.",
    tags: ["urban fantasy", "mystery", "magic"],
    category: "Adult",
    isPremium: true,

    isMature: true,
    reads: 789,
    author: {
      name: "Jihyo",
    },
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
  },
  {
    id: "Asdcq3sdhfr4g",
    title: "Tales from the Wildwood",
    slug: "tales-from-the-wildwood",
    description:
      "A collection of enchanting folktales passed down through generations.",
    tags: ["fantasy", "folklore", "short stories"],
    category: "All Ages",
    reads: 101,
    isPremium: true,

    isMature: true,
    author: {
      name: "Jihyo",
    },
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
  },
  {
    id: "Asdcq3r4g",
    title: "The Cybernetic Heart",
    slug: "the-cybernetic-heart",
    description:
      "A dystopian sci-fi novel exploring love, loss, and humanity in a technological age.",
    tags: ["science fiction", "dystopia", "romance"],
    category: "Young Adult",
    reads: 345,
    isPremium: true,

    isMature: true,
    author: {
      name: "Jihyo",
    },
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
  },
  {
    id: "Asdcqacw43r4g",
    title: "Whispers of the Bayou",
    slug: "whispers-of-the-bayou",
    description: "A chilling mystery set in the depths of the Louisiana swamp.",
    tags: ["mystery", "gothic", "supernatural"],
    category: "Adult",
    reads: 258,
    isPremium: true,

    isMature: true,
    author: {
      name: "Jihyo",
    },
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
  },
  {
    id: "Asdcq314trr4g",
    title: "Astral Academy",
    slug: "astral-academy",
    description:
      "Welcome to Astral Academy, where students train to master their psychic abilities.",
    tags: ["fantasy", "paranormal", "young adult"],
    category: "Young Adult",
    reads: 678,
    isPremium: true,

    isMature: true,
    author: {
      name: "Jihyo",
    },
    thumbnail: "https://img.wattpad.com/cover/289021793-512-k747088.jpg",
  },
];

export const allBooks: TCard[] = Array(12)
  .fill(0)
  .map((_, i) => {
    const folderName = [
      {
        name: "hero-stories",
        files: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"],
      },
      {
        name: "featured-stories",
        files: ["1.jpg", "2.jpg", "3.jpg"],
      },
      { name: "latest-stories", files: ["1.jpg", "2.jpg", "3.jpg"] },
      {
        name: "top-picks",
        files: [
          "adventure.jpg",
          "humor.jpg",
          "mystery.jpg",
          "science-fiction.jpg",
          "teen-fiction.jpg",
        ],
      },
    ][Math.floor(Math.random() * 3 + 1)];

    const fileName =
      folderName!.files[Math.floor(Math.random() * folderName!.files.length)];

    return {
      id: i.toString(),
      thumbnail: `/${folderName!.name}/${fileName}`,
      isMature: false,
      slug: "collab-to-love448100-624960269890-3873890691210-7371520",
      title: "The Last of the Dragons-Set 1",
      tags: ["fantasy", "adventure", "magic"],
      isPremium: false,

      category: "Fiction",
      reads: 12345,
      description:
        "A young sorcerer must uncover the secrets of a mysterious crimson shard to save her kingdom from an ancient evil.",
      author: {
        name: "By Dragonfly🇨🇦",
      },
    };
  });

export const genres = [
  { name: "All" },
  { name: "Action" },
  { name: "Adventure" },
  { name: "Comedy" },
  { name: "Drama" },
  { name: "Fantasy" },
  { name: "Horror" },
  { name: "Mystery" },
  { name: "Romance" },
  { name: "Science Fiction" },
  { name: "Teen Fiction" },
  { name: "New Adult" },
];
