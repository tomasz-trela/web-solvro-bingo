"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { type BingoTile } from "@/hooks/useBingoTiles";

interface BingoGridProps {
    tiles: BingoTile[];
}

function getCellStyle(status: BingoTile["status"]) {
    switch (status) {
        case "pending":
            return 'bg-[#fff4d4] text-[#4c3b1b]';
        case "verified":
            return 'bg-[#d4f4dd] text-[#1b4c2e]';
        case "rejected":
            return 'bg-[#ffd4d4] text-[#4c1b1b]';
        default:
            return 'bg-[#d9e8ff] text-[#1b294c]';
    }
};

export function BingoGrid({ tiles }: BingoGridProps) {
    const router = useRouter();
    const sortedTiles = useMemo(() =>
        [...tiles].sort((a, b) => a.index - b.index),
        [tiles]
    );

    function handleTileClick(tile: BingoTile): void {
        if (tile.status === "unverified" || tile.status === "rejected") {
            router.push(`/submission?id=${tile.id}`);
        }
    }

    return (
        <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
            {sortedTiles.map((tile) => (
                <button
                    key={tile.id}
                    onClick={() => handleTileClick(tile)}
                    className={`
                        aspect-square p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium
                        transition-all duration-200 active:scale-95 sm:hover:scale-105
                        flex items-center justify-center text-center shadow-lg
                        overflow-hidden
                        ${getCellStyle(tile.status)}
                    `}
                    title={tile.title}
                >
                    <span className="line-clamp-3 sm:line-clamp-4">
                        {tile.title}
                    </span>
                </button>
            ))}
        </div>
    );
}
