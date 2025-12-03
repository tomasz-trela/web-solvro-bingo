import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
    getBingoItemById,
    createBingoSubmission,
    updateBingoItemStatus,
    getBingoSubmissionsByUserId
} from "@/db/queries";
import { validateMessage, validateBase64Image, sanitizeInput } from "@/lib/validation";
import { unauthorizedResponse, badRequestResponse, notFoundResponse, serverErrorResponse, successResponse } from "@/lib/api-utils";

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

        if (!bingoItemId) {
            return badRequestResponse("bingoItemId is required");
        }

        const messageValidation = validateMessage(message);
        if (!messageValidation.valid) {
            return badRequestResponse(messageValidation.error || "Invalid message");
        }

        const imageValidation = validateBase64Image(image);
        if (!imageValidation.valid) {
            return badRequestResponse(imageValidation.error || "Invalid image");
        }

        const bingoItem = await getBingoItemById(bingoItemId, session.user.id);

        if (!bingoItem) {
            return notFoundResponse("Bingo item not found or does not belong to you");
        }

        const submission = await createBingoSubmission({
            bingoItemId,
            image: image || null,
            message: sanitizeInput(message),
        });

        await updateBingoItemStatus(bingoItemId, session.user.id, "pending");

        return successResponse(submission, 201);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Error creating bingo submission:", error);
        }
        return serverErrorResponse("Failed to create submission");
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return unauthorizedResponse();
        }

        const submissions = await getBingoSubmissionsByUserId(session.user.id);

        return successResponse(submissions);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Error fetching bingo submissions:", error);
        }
        return serverErrorResponse("Failed to fetch submissions");
    }
}
