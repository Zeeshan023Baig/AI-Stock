import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup");
        const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
        const isOnboarding = req.nextUrl.pathname.startsWith("/onboarding");
        const token = req.nextauth.token;

        if (isAuthPage) {
            if (token) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            return null;
        }

        if (!token) {
            // It's a protected route and no token
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Check onboarding status
        const hasCompletedOnboarding = token.hasCompletedOnboarding;

        if (isOnboarding && hasCompletedOnboarding) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (!hasCompletedOnboarding && !isOnboarding && req.nextUrl.pathname !== "/api/auth/signout") {
            // Must complete onboarding first
            return NextResponse.redirect(new URL("/onboarding", req.url));
        }

        return null;
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                // Run middleware for all routes configured in matcher
                return true;
            },
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/onboarding/:path*", "/login", "/signup"],
};
