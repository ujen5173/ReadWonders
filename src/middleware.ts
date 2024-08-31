import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Your custom middleware logic can go here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
