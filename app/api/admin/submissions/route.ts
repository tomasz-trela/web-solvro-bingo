import { getBingoSubmissions } from "@/db/queries";
import { requireAdmin, unauthorizedResponse, forbiddenResponse, serverErrorResponse, successResponse } from "@/lib/api-utils";

export async function GET() {
    try {
        const { authorized, isAdmin } = await requireAdmin();

        if (!authorized) {
            return isAdmin === false ? forbiddenResponse() : unauthorizedResponse();
        }

        const submissions = await getBingoSubmissions();

        return successResponse(submissions);
    } catch (error) {
        console.error("Error fetching bingo submissions:", error);
        return serverErrorResponse("Failed to fetch submissions");
    }
}


