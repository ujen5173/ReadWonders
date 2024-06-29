"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/trpc/react";

export const withPrivateRoute = <T extends object>(
  WrappedComponent: React.FunctionComponent<T>,
) => {
  const ComponentWithPrivateRoute = (props: T) => {
    const router = useRouter();

    // const { user, isLoading } = useUser();
    const { data: user, isLoading } = api.auth.getProfile.useQuery();

    useEffect(() => {
      if (!user && !isLoading) {
        router.push("/auth/login");
      }
    }, [user, router, isLoading]);

    if (!user) return null;

    return <WrappedComponent {...props} />;
  };

  return ComponentWithPrivateRoute;
};
