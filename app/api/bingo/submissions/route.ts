import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
    getBingoItemById,
    createBingoSubmission,
    updateBingoItemStatus,
    getBingoSubmissionsByUserId
} from "@/db/queries";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { bingoItemId, image, message } = body;

        if (!bingoItemId || !message) {
            return NextResponse.json(
                { error: "Missing required fields: bingoItemId and message are required" },
                { status: 400 }
            );
        }

        const bingoItem = await getBingoItemById(bingoItemId, session.user.id);

        if (!bingoItem) {
            return NextResponse.json(
                { error: "Bingo item not found or does not belong to you" },
                { status: 404 }
            );
        }

        const submission = await createBingoSubmission({
            bingoItemId,
            image,
            message,
        });

        await updateBingoItemStatus(bingoItemId, session.user.id, "pending");

        return NextResponse.json(submission, { status: 201 });
    } catch (error) {
        console.error("Error creating bingo submission:", error);
        return NextResponse.json(
            { error: "Failed to create submission" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const submissions = await getBingoSubmissionsByUserId(session.user.id);

        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Error fetching bingo submissions:", error);
        return NextResponse.json(
            { error: "Failed to fetch submissions" },
            { status: 500 }
        );
    }
}
