import chalk from "chalk";
import numeral from "numeral";

export const formatNumber = (num: number) => {
  return numeral(num).format("0.[0]a");
};

export const formatReadingTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  return `${hours} hr ${remainingMinutes} min`.trim();
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

export const urlToFile = async (
  url: string,
  filename: string,
  mimeType: string,
): Promise<File> => {
  const response = await fetch(url);

  const buffer = await response.arrayBuffer();

  return new File([buffer], filename, { type: mimeType });
};

// chalk (console colors)
export const error = chalk.bold.red;
export const warning = chalk.hex("#FFA500");
export const info = chalk.hex("#00BFFF");
