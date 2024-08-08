import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { Role } from "./types/base.type";

const roles = ["ADMIN", "APPLICANT", "EMPLOYEE"];
const whitelist = ["/redirect", "/public"];
function getRolePath(role: Role): string {
  switch (role) {
    case "APPLICANT":
      return "/applicant/contacts";
    case "ADMIN":
      return "/admin";
    case "EMPLOYEE":
      return "/employee";
    default:
      return "/";
  }
}

export const checkToken = (token: string) => {
  let decoded: any;
  try {
    decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    return !isExpired;
  } catch (error) {
    return false;
  }
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  if (whitelist.includes(request.nextUrl.pathname) && !token) {
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  try {
    const decoded: any = jwtDecode(token.value);
    console.log(decoded);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired && !whitelist.includes(request.nextUrl.pathname)) {
      request.cookies.delete("token");
      return NextResponse.redirect(new URL("/", request.url));
    }
    const role = decoded?.role;
    const nextUrl = getRolePath(role ?? "");
    console.log(nextUrl);
    if (whitelist.includes(request.nextUrl.pathname)) {
      console.log("Hello");
      return NextResponse.redirect(new URL(nextUrl, request.url));
    }
    // if (request.nextUrl.pathname === "/") {
    //   return NextResponse.redirect(new URL(nextUrl, request.url));
    // }
    const roleInRoute = request.nextUrl.pathname.split("/")[1].toUpperCase();
    console.log(roleInRoute);
    if (roles.includes(roleInRoute as Role) && role !== roleInRoute) {
        console.log(nextUrl)
      return NextResponse.redirect(new URL(nextUrl, request.url));
    }
    return NextResponse.next();
  } catch (error) {
    request.cookies.delete("token");
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|public|_next/image|favicon.ico|images|logo.svg|logo.png|rca.jpeg|favicon.svg|favicon.png).*)",
  ],
};
