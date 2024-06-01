// "use client";

import React from "react";

import { redirect } from "next/navigation";
import { getServerUser } from "~/utils/auth";

export const withPublicRoute = <T extends object>(
  WrappedComponent: React.FunctionComponent<T>,
) => {
  const ComponentwithPublicRoute = async (props: T) => {
    const { user } = await getServerUser();

    if (user) {
      redirect("/dashboard");
    }

    // const router = useRouter();
    // const { user, isLoading } = useUser();
    // const isUserDataLoaded = !isLoading;

    // useEffect(() => {
    //   if (user && isUserDataLoaded) {
    //     router.push("/dashboard");
    //   }
    // }, [user, isUserDataLoaded, router]);

    // if (user ?? !isUserDataLoaded) return <LoadingScreen />;

    return <WrappedComponent {...props} />;
  };

  return ComponentwithPublicRoute;
};
