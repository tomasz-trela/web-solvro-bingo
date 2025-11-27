import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export function unauthorizedResponse() {
    return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
    );
}

export function forbiddenResponse(message = "Forbidden") {
    return NextResponse.json(
        { error: message },
        { status: 403 }
    );
}

export function badRequestResponse(message: string) {
    return NextResponse.json(
        { error: message },
        { status: 400 }
    );
}

export function notFoundResponse(message = "Not found") {
    return NextResponse.json(
        { error: message },
        { status: 404 }
    );
}

export function serverErrorResponse(message = "Internal server error") {
    return NextResponse.json(
        { error: message },
        { status: 500 }
    );
}

export function successResponse<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
}

export async function requireAuth() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { authorized: false as const, session: null };
    }

    return { authorized: true as const, session };
}

export async function requireAdmin() {
    const { authorized, session } = await requireAuth();

    if (!authorized) {
        return { authorized: false as const, session: null };
    }

    if (session.user.role !== "admin") {
        return { authorized: false as const, session, isAdmin: false as const };
    }

    return { authorized: true as const, session, isAdmin: true as const };
}
