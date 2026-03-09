export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/curate/:path*",
    "/resume/:path*",
    "/applications/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
  ],
};
