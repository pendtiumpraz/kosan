import { auth } from "@/lib/auth";

// Use NextAuth's built-in middleware
export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // Protected routes
    const isProtectedRoute = pathname.startsWith("/dashboard");
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return Response.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes
    if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", req.url));
    }
});

export const config = {
    matcher: [
        // Only run on specific paths
        "/dashboard/:path*",
        "/login",
        "/register",
    ],
};
