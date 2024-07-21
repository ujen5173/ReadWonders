"use client";

import { useEffect } from "react";
import NotFound from "./not-found";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <NotFound title={error.message} />;
}
