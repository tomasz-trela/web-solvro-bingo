import { NextResponse } from "next/server";
import withAuth from "next-auth/middleware";

const TARGET_DATE = new Date("2025-11-26T19:00:00");

export default withAuth(
    // function middleware(req) {
    //     const now = new Date();
    //     const path = req.nextUrl.pathname;
    //     const token = req.nextauth.token;

    //     // Jeśli nie minęła docelowa godzina i użytkownik nie jest na /countdown
    //     if (now < TARGET_DATE && path !== "/countdown") {
    //         return NextResponse.redirect(new URL("/countdown", req.url));
    //     }

    //     // Jeśli minęła docelowa godzina i użytkownik jest na /countdown
    //     if (now >= TARGET_DATE && path === "/countdown") {
    //         return NextResponse.redirect(new URL("/login", req.url));
    //     }

    //     return NextResponse.next();
    // },
    {
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (login page)
         * - register (register page)
         * - countdown (countdown page)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|login|register|countdown|bg.svg).*)",
    ],
};
