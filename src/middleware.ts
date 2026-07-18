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
  "TRAINEE",
];

const whitelist = ["/", "/redirect", "/public", "/trainee"];

function getRolePath(role: Role): string {
  switch (role.toLowerCase()) {
    case "dynamic":
      return "/dynamic";
    case "normal_employee":
      return "/employee";
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
    case "trainee":
      return "/trainee";
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
  console.log("Middleware: Checking path:", request.nextUrl.pathname);

  if (request.nextUrl.pathname.startsWith('/trainee')) {
    console.log("Middleware: Allowing trainee access");
    return NextResponse.next();
  }

  if (whitelist.includes(request.nextUrl.pathname) && !token?.value) {
    console.log("Middleware: Whitelisted path without token");
    return NextResponse.next();
  }

  if (!token?.value) {
    console.log("Middleware: No token, redirecting to home");
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded: any = jwtDecode(token.value);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired && !whitelist.includes(request.nextUrl.pathname)) {
      console.log("Middleware: Token expired");
      return NextResponse.redirect(new URL("/", request.url));
    }

    const role = decoded?.role;
    const nextUrl = getRolePath(role ?? "");
    
    if (whitelist.includes(request.nextUrl.pathname) && request.nextUrl.pathname !== "/") {
      console.log("Middleware: Whitelisted path with token");
      return NextResponse.next();
    }

    if (request.nextUrl.pathname === "/") {
      console.log("Middleware: Redirecting to role path:", nextUrl);
      return NextResponse.redirect(new URL(nextUrl, request.url));
    }

    const roleInRoute = request.nextUrl.pathname.split("/")[1].toUpperCase();
    if (
      (role === "NORMAL_EMPLOYEE" && roleInRoute === "EMPLOYEE") ||
      (role === "EMPLOYEE" && roleInRoute === "NORMAL_EMPLOYEE")
    ) {
      return NextResponse.next();
    }

    if (roles.includes(roleInRoute as Role) && role !== roleInRoute) {
      console.log("Middleware: Role mismatch, redirecting to:", nextUrl);
      return NextResponse.redirect(new URL(nextUrl, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware: Error processing token:", error);
    request.cookies.delete("token");
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|public|files|_next/image|favicon.ico|images|logo.svg|logo.png|favicon.svg|favicon.png).*)",
  ],
};
