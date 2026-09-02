import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("accessToken")?.value;

  if (url.pathname === "/admin") {
    if (token) {
      const payload = jwt.decode(token);

      if (
        payload &&
        typeof payload !== "string" &&
        payload.role === "ADMIN"
      ) {
        console.log("navigated from proxy !")
        return NextResponse.redirect(
          new URL("/admin/dashboard", req.url)
        );
      }
    }

    return NextResponse.next();
  }

  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/admin", req.url)
      );
    }

    const payload = jwt.decode(token);

    if (
      !payload ||
      typeof payload === "string" ||
      payload.role !== "ADMIN"
    ) {
      return NextResponse.redirect(
        new URL("/admin", req.url)
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};