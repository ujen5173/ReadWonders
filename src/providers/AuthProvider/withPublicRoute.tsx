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

    return <WrappedComponent {...props} />;
  };

  return ComponentwithPublicRoute;
};
