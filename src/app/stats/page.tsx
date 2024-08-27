import { env } from "~/env.js";

const Stat = () => {
  return (
    <main className="z-20 mx-auto w-full max-w-7xl">
      <iframe
        allowFullScreen
        className="h-[80vh] w-full max-w-7xl rounded-xl border bg-[#FFF6F7] p-8 pr-0"
        src={env.POSTHOG_ANALYTICS_KEY}
      ></iframe>
    </main>
  );
};

export default Stat;
