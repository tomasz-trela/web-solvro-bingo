import { NextResponse } from "next/server";
import { getBingoItemsByUserId } from "@/db/queries";
import { requireAuth, unauthorizedResponse, serverErrorResponse, successResponse } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, session } = await requireAuth();

        if (!authorized) {
            return unauthorizedResponse();
        }

        const tiles = await getBingoItemsByUserId(session.user.id!);

        return successResponse(tiles);
    } catch (error) {
        console.error("Error fetching bingo tiles:", error);
        return serverErrorResponse("Failed to fetch bingo tiles");
    }
}
