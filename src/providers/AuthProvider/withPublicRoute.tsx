"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { LoadingScreen } from "~/components/Loading";
import { useUser } from "./AuthProvider";

export const withPublicRoute = <T extends object>(
  WrappedComponent: React.FunctionComponent<T>,
) => {
  const ComponentwithPublicRoute = async (props: T) => {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const isUserDataLoaded = !isLoading;

    useEffect(() => {
      if (user && isUserDataLoaded) {
        router.push("/dashboard");
      }
    }, [user, isUserDataLoaded, router]);

    if (user ?? !isUserDataLoaded) return <LoadingScreen />;

    return <WrappedComponent {...props} />;
  };

  return ComponentwithPublicRoute;
};
