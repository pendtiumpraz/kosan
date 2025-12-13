import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Get token from cookie (Edge-compatible)
    const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET 
    });
    
    const isLoggedIn = !!token;
    const isProtectedRoute = pathname.startsWith("/dashboard");
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes
    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
