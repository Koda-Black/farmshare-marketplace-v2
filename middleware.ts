import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const userCookie = req.cookies.get("farmshare-auth")?.value;
  const adminCookie = req.cookies.get("farmshare-admin-auth")?.value;

  // --- PUBLIC ROUTES ---
  const publicRoutes = [
    /^\/$/,
    /^\/login/,
    /^\/signup/,
    /^\/auth/,
    /^\/marketplace/,
    /^\/pools/,
    /^\/vendor\/(?!dashboard|settings|orders|analytics).*/, // public vendor pages
    /^\/admin\/login/, // Admin login is public
  ];

  // Allow all public routes
  if (publicRoutes.some((r) => r.test(pathname))) {
    return NextResponse.next();
  }

  // --- ADMIN ROUTES ---
  if (pathname.startsWith("/admin")) {
    if (!adminCookie) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    // Parse admin cookie to verify admin role
    try {
      const parsedAdmin = JSON.parse(adminCookie);
      if (!parsedAdmin?.isAdminAuthenticated || parsedAdmin?.admin?.role !== 'admin') {
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    } catch {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- NO USER COOKIE → Redirect to login ---
  if (!userCookie) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // --- PARSE COOKIE SAFELY ---
  let role: string | null = null;
  try {
    const parsed = JSON.parse(userCookie);
    role = parsed?.state?.user?.role ?? parsed?.user?.role ?? null;
  } catch {
    console.warn("Invalid user cookie — resetting auth");
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Normalize role to lowercase
  const normalizedRole = role?.toLowerCase();

  // --- ROLE-BASED ROUTE RESTRICTION ---
  if (pathname.startsWith("/admin") && normalizedRole !== "admin") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/vendor") && normalizedRole !== "vendor") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/buyer") && normalizedRole !== "buyer") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/buyer/:path*",
    "/marketplace/:path*",
    "/pools/:path*",
  ],
};
