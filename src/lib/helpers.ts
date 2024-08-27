import chalk from "chalk";
import numeral from "numeral";

export const formatNumber = (num: number) => {
  return numeral(num).format("0.[0]a");
};

export function formatReadingTime(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  minutes = minutes % 60;

  let readableTime = "";

  if (hours > 0) {
    readableTime += `${hours} hr${hours > 1 ? "s" : ""} `;
  }

  if (minutes > 0) {
    readableTime += `${minutes} min${minutes > 1 ? "s" : ""} `;
  }

  if (hours === 0 && minutes === 0) {
    readableTime = "< minute";
  }

  return readableTime.trim();
}

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

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];

  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}
