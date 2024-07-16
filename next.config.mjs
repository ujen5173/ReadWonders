import withMDX from "@next/mdx";
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * `i18n` config is causing issue with the interception routes. so, we need to comment it out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
  images: {
    remotePatterns: [
      {
        hostname: "i.pinimg.com",
      },
      {
        hostname: "pbs.twimg.com",
      },
      {
        hostname: "yt3.ggpht.com",
      },
      {
        hostname: "bookcoverzone.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "images.pexels.com",
      },
      {
        hostname: "www.kpop.ae",
      },
      {
        hostname: "lh3.google.com",
      },
      {
        hostname: "covers.bookcoverzone.com",
      },
      {
        hostname: "cdn.i-scmp.com",
      },
      {
        hostname: "pbs.twimg.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "img.wattpad.com",
      },
      {
        hostname: "kavesquare.com",
      },
      {
        hostname: "utfs.io",
      },
    ],
  },
};

export default withMDX()(config);
