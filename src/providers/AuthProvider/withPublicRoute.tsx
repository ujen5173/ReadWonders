// "use client";

import React from "react";

import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export const withPublicRoute = <T extends object>(
  WrappedComponent: React.FunctionComponent<T>,
) => {
  const ComponentwithPublicRoute = async (props: T) => {
    const user = await api.auth.authInfo.query();

    if (user) redirect("/dashboard");

    // const router = useRouter();
    // const { user, isLoading } = useUser();
    // const isUserDataLoaded = !isLoading;

    // useEffect(() => {
    //   if (user && isUserDataLoaded) {
    //     router.push("/dashboard");
    //   }
    // }, [user, isUserDataLoaded, router]);

    // if (isLoading) return <LoadingScreen />;

    return <WrappedComponent {...props} />;
  };

  return ComponentwithPublicRoute;
};
