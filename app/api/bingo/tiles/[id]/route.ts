import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateBingoItemStatus } from "@/db/queries";
import { BINGO_STATUSES } from "@/lib/constants";
import { unauthorizedResponse, badRequestResponse, notFoundResponse, serverErrorResponse, successResponse } from "@/lib/api-utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const { status } = await req.json();

    if (!BINGO_STATUSES.includes(status as any)) {
      return badRequestResponse("Invalid status");
    }

    const updatedTile = await updateBingoItemStatus(
      (
        await params
      ).id,
      session.user.id,
      status
    );

    if (!updatedTile) {
      return notFoundResponse("Tile not found");
    }

    return successResponse(updatedTile);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error updating bingo tile:", error);
    }
    return serverErrorResponse("Failed to update bingo tile");
  }
}
