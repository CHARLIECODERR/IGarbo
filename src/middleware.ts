import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Add role-based protection logic here if needed
  // For now, we'll rely on client-side checks and layout protections
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/collector/:path*", "/admin/:path*"],
};
