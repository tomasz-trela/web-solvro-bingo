import { NextResponse } from "next/server";
import withAuth from "next-auth/middleware";

const TARGET_DATE = new Date("2025-11-26T19:00:00");

export default withAuth(
    {
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|login|register|countdown|bg.svg).*)",
    ],
};
