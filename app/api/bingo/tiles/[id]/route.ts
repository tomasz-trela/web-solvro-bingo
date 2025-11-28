import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateBingoItemStatus } from "@/db/queries";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    // Walidacja statusu
    const validStatuses = ["unverified", "pending", "verified", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Aktualizuj tylko jeśli kafelek należy do użytkownika
    const updatedTile = await updateBingoItemStatus(
      (
        await params
      ).id,
      session.user.id,
      status
    );

    if (!updatedTile) {
      return NextResponse.json({ error: "Tile not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTile);
  } catch (error) {
    console.error("Error updating bingo tile:", error);
    return NextResponse.json(
      { error: "Failed to update bingo tile" },
      { status: 500 }
    );
  }
}
