import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (!(await isValidAdminToken(request.cookies.get(ADMIN_COOKIE)?.value))) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
