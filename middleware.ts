import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define which routes to protect
const protectedRoutes = ["/api/notes", "/api/user"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the current route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next(); // Allow public routes
  }

  // Get token from the Authorization header
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // Token is valid → allow access
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"], // apply middleware to all /api routes
};
