import numeral from "numeral";

export const formatNumber = (num: number) => {
  return numeral(num).format("0.[0]a");
};

export const formatReadingTime = (min: number) => {
  // should return <5min, 1hr, 30min, etc
  if (min < 60) {
    return `<${min}min`;
  }

  return `${Math.floor(min / 60)}hr`;
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const chunkIntoN = (
  arr: {
    slug: string | null;
    title: string | null;
    thumbnail: string;
  }[],
  n: number,
) => {
  const size = Math.ceil(arr.length / n);

  return Array.from({ length: n }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );
};
