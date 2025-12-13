import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Check for session cookie (Edge-compatible - just check existence)
    const hasSession = request.cookies.has("authjs.session-token") 
        || request.cookies.has("next-auth.session-token")
        || request.cookies.has("__Secure-authjs.session-token")
        || request.cookies.has("__Secure-next-auth.session-token");
    
    const isProtectedRoute = pathname.startsWith("/dashboard");
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !hasSession) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes
    if (isAuthRoute && hasSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
