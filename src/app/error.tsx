"use client";

import NotFound from "./not-found";

export default function Error({ error }: { error: Error }) {
  return <NotFound title={error.message} />;
}
