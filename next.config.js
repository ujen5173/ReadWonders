import withMDX from "@next/mdx";
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  images: {
    remotePatterns: [
      {
        hostname: "ui-avatars.com",
      },
      {
        hostname: "deeplor.s3.us-west-2.amazonaws.com",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "i.redd.it",
      },
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
