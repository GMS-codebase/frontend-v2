import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { Role } from "@/types/base.type";

const roles = [
  "ADMIN",
  "APPLICANT",
  "EMPLOYEE",
  "NORMAL_EMPLOYEE",
  "SDF_SECRETARIATE",
  "GRANT_COMMITTEE",
  "DYNAMIC",
];
const whitelist = ["/", "/redirect", "/public"];
function getRolePath(role: Role): string {
  switch (role.toLowerCase()) {
    case "dynamic":
      return "/dynamic";
    case "normal_employee":
    case "employee":
      return "/employee";
    case "grant_committee":
      return "/grant_committee";
    case "sdf_secretariate":
      return "/sdf/contracts";
    case "applicant":
      return "/applicant/contacts";
    case "admin":
      return "/admin";
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
  if (whitelist.includes(request.nextUrl.pathname) && !token?.value) {
    return NextResponse.next();
  }
  if (!token?.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  try {
    const decoded: any = jwtDecode(token.value);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired && !whitelist.includes(request.nextUrl.pathname)) {
      request.cookies.delete("token");
      return NextResponse.redirect(new URL("/", request.url));
    }
    const role = decoded?.role;
    const nextUrl = getRolePath(role ?? "");
    if (whitelist.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    if (request.nextUrl.pathname === "/") {
      return NextResponse.next();
    }
    const roleInRoute = request.nextUrl.pathname.split("/")[1].toUpperCase();
    if (
      (role === "NORMAL_EMPLOYEE" && roleInRoute === "EMPLOYEE") ||
      (role === "EMPLOYEE" && roleInRoute === "NORMAL_EMPLOYEE")
    ) {
      return NextResponse.next();
    }

    if (roles.includes(roleInRoute as Role) && role !== roleInRoute) {
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
    "/((?!api|_next/static|public|_next/image|favicon.ico|images|logo.svg|logo.png|favicon.svg|favicon.png).*)",
  ],
};
