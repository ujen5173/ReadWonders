export const featuredStories = [
  {
    id: "1",
    title: "The Last of the Dragons-Set 1",
    author: "By Dragonfly🇨🇦",
    image: "/featured-stories/1.jpg",
  },
  {
    id: "2",
    title: "Delta: A Spy Novel",
    author: "By Monica",
    image: "/featured-stories/2.jpg",
  },
  {
    id: "3",
    title: "Miss General",
    author: "By Scarlet Rose",
    image: "/featured-stories/3.jpg",
  },
];

export const latestStories = [
  {
    id: "1",
    title: "The Last of the Dragons-Set 1",
    author: "By Dragonfly🇨🇦",
    image: "/latest-stories/1.jpg",
  },
  {
    id: "2",
    title: "Delta: A Spy Novel",
    author: "By Monica",
    image: "/latest-stories/2.jpg",
  },
  {
    id: "3",
    title: "Miss General",
    author: "By Scarlet Rose",
    image: "/latest-stories/3.jpg",
  },
];

export const topPicks = [
  {
    id: "1",
    title: "Delta: A Spy Novel",
    author: "By Monica",
    category: "Adventure",
    image: "/top-picks/adventure.jpg",
  },
  {
    id: "2",
    title: "Knowing Xavier Hunt ✓",
    author: "By Daisy",
    category: "Mystery",
    image: "/top-picks/mystery.jpg",
  },
  {
    id: "3",
    title: "Miss General",
    author: "By Scarlet Rose",
    category: "Humor",
    image: "/top-picks/humor.jpg",
  },
  {
    id: "4",
    title: "The Secret Garden",
    author: "By Frances Hodgson Burnett",
    category: "New Adult",
    image: "/top-picks/new-adult.jpg",
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "By Jane Austen",
    category: "Teen Fiction",
    image: "/top-picks/teen-fiction.jpg",
  },
  {
    id: "6",
    title: "The Last of the Dragons-Set 1",
    author: "By Jane Austen",
    category: "Science Fiction",
    image: "/top-picks/science-fiction.jpg",
  },
];

export const allBooks = Array(12)
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
      image: `/${folderName!.name}/${fileName}`,
      title: "The Last of the Dragons-Set 1",
      author: "By Dragonfly🇨🇦",
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
