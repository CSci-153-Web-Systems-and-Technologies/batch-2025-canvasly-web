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

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase server client for SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current user session
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Check if the current request path is protected
  const isProtected = PROTECTED_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith("/" + path)
  );

  // If user not logged in and path is protected, redirect to login
  if (!user && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return res;
}

// Apply middleware only to protected paths
export const config = {
  matcher: PROTECTED_PATHS.map((path) => `/${path}/:path*`),
};
