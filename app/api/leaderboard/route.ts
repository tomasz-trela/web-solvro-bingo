import { getLeaderboard } from "@/db/queries";
import { requireAuth, unauthorizedResponse, serverErrorResponse, successResponse } from "@/lib/api-utils";

export async function GET() {
    const { authorized } = await requireAuth();

    if (!authorized) {
        return unauthorizedResponse();
    }

    try {
        const leaderboard = await getLeaderboard();
        return successResponse(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return serverErrorResponse("Failed to fetch leaderboard");
    }
}
