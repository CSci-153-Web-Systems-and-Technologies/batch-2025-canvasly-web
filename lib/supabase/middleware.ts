import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "artists",
  "create",
  "edit",
  "following",
  "posts",
  "protected",
  "purchase",
  "request",
  "users",
];

export async function updateSession(request: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get the user claims from the cookie
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  // Only check protected paths
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith("/" + path)
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: PROTECTED_PATHS.map((path) => `/${path}/:path*`),
};
