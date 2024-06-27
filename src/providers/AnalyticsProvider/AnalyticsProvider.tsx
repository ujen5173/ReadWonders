"use client";

import Script from "next/script";
import { env } from "~/env.mjs";
// import { posthog } from "posthog-js";

// if (typeof window !== "undefined") {
//   posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
//   });
// }

// export function CSPostHogProvider({ children }: { children: ReactNode }) {
//   return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
// }

export const UmamiAnalyticsProvider = () => {
  return env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? null : (
    <Script
      src="https://analytics.umami.is/script.js"
      data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      strategy="lazyOnload"
    />
  );
};
