import { api } from "~/trpc/server";

export const withPrivateRoute = <T extends object>(
  WrappedComponent: React.FunctionComponent<T>,
) => {
  const ComponentWithPrivateRoute = async (props: T) => {
    // const router = useRouter();

    // const { user, isLoading } = useUser();
    const user = await api.auth.authInfo.query();

    // useEffect(() => {
    //   if (!user && !isLoading) {
    //     router.push("/auth/login");
    //   }
    // }, [user, router, isLoading]);

    if (!user) return null;

    return <WrappedComponent {...props} />;
  };

  return ComponentWithPrivateRoute;
};
