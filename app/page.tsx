"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useBingoTiles } from "@/hooks/useBingoTiles";
import { BingoGrid } from "@/components/dashboard/BingoGrid";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { TopBarActions } from "@/components/shared/TopBarActions";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { BackgroundContainer } from "@/components/shared/BackgroundContainer";
import { calculateBingoProgress } from "@/lib/bingo-utils";
import { MAX_COMPLETED_LINES } from "@/lib/constants";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { data: tiles = [], isLoading } = useBingoTiles();

    const { completedLines } = useMemo(() =>
        calculateBingoProgress(tiles),
        [tiles]
    );

    if (status === "loading" || isLoading) {
        return <LoadingScreen />;
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    return (
        <BackgroundContainer className="min-h-screen p-4 sm:p-8 relative flex items-center justify-center">
            <TopBarActions
                onLeaderboardClick={() => router.push("/leaderboard")}
                onSignOut={() => signOut({ callbackUrl: "/login" })}
            />

            <div className="max-w-md w-full">
                <DashboardHeader />

                <BingoGrid tiles={tiles} />

                <ProgressBar completedLines={completedLines} maxLines={MAX_COMPLETED_LINES} />
            </div>
        </BackgroundContainer>
    );
}