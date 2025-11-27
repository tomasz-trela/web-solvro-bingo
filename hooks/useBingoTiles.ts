import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface BingoTile {
    id: string;
    userId: string;
    setTileId: string;
    index: number;
    title: string;
    status: "unverified" | "pending" | "verified" | "rejected";
    rejectionReason: string | null;
};

async function fetchTiles(): Promise<BingoTile[]> {
    const res = await fetch("/api/bingo/tiles");
    if (!res.ok) {
        throw new Error("Failed to fetch tiles");
    }
    return res.json();
}


export function useBingoTiles() {
    return useQuery({
        queryKey: ["bingoTiles"],
        queryFn: fetchTiles,
    });
}
