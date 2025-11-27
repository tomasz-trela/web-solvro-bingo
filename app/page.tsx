"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useBingoTiles } from "@/hooks/useBingoTiles";
import { BingoGrid } from "@/components/dashboard/BingoGrid";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { TopBarActions } from "@/components/shared/TopBarActions";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { data: tiles = [], isLoading } = useBingoTiles();

    if (status === "loading" || isLoading) {
        return <div className="flex h-screen items-center justify-center text-white">Ładowanie...</div>;
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    function countCompletedLines() {
        const verifiedIndices = new Set(
            tiles.filter(t => t.status === "verified").map(t => t.index)
        );

        let count = 0;

        for (let row = 0; row < 4; row++) {
            if ([0, 1, 2, 3].every(col => verifiedIndices.has(row * 4 + col))) {
                count++;
            }
        }

        for (let col = 0; col < 4; col++) {
            if ([0, 1, 2, 3].every(row => verifiedIndices.has(row * 4 + col))) {
                count++;
            }
        }

        if ([0, 5, 10, 15].every(i => verifiedIndices.has(i))) count++;
        if ([3, 6, 9, 12].every(i => verifiedIndices.has(i))) count++;

        return count;
    }

    const completedLines = countCompletedLines();
    const maxLines = 10;

    return (
        <div className="min-h-screen p-4 sm:p-8 relative flex items-center justify-center" style={{ backgroundImage: 'url(/bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <TopBarActions
                onLeaderboardClick={() => router.push("/leaderboard")}
                onSignOut={() => signOut({ callbackUrl: "/login" })}
            />

            <div className="max-w-md w-full">
                <DashboardHeader />

                <BingoGrid tiles={tiles} />

                <ProgressBar completedLines={completedLines} maxLines={maxLines} />
            </div>
        </div>
    );
}