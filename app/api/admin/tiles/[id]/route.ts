import { adminUpdateBingoItem } from "@/db/queries";
import {
    requireAdmin,
    unauthorizedResponse,
    forbiddenResponse,
    badRequestResponse,
    notFoundResponse,
    serverErrorResponse,
    successResponse
} from "@/lib/api-utils";
import { BINGO_STATUSES } from "@/lib/constants";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { authorized, isAdmin } = await requireAdmin();

        if (!authorized) {
            return isAdmin === false ? forbiddenResponse("Admin access required") : unauthorizedResponse();
        }

        const body = await req.json();
        const { status, rejectionReason } = body;

        if (status) {
            if (!BINGO_STATUSES.includes(status as any)) {
                return badRequestResponse("Invalid status");
            }
        }

        const updateData: {
            status?: "unverified" | "pending" | "verified" | "rejected";
            rejectionReason?: string | null;
        } = {};

        if (status) updateData.status = status;
        if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason || null;

        if (Object.keys(updateData).length === 0) {
            return badRequestResponse("No fields to update");
        }

        const updatedTile = await adminUpdateBingoItem(id, updateData);

        if (!updatedTile) {
            return notFoundResponse("Tile not found");
        }

        return successResponse(updatedTile);
    } catch (error) {
        return serverErrorResponse("Failed to update bingo tile");
    }
}
