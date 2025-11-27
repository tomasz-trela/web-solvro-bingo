"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { TextButton } from "@/components/shared/TextButton";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";

export default function LeaderboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { data: leaderboard = [], isLoading } = useLeaderboard();

    if (status === "loading" || isLoading) {
        return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-screen p-4 sm:p-8 relative" style={{ backgroundImage: 'url(/bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="absolute top-4 right-4">
                <TextButton
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    text="Wyloguj"
                    title="Wyloguj"
                />
            </div>

            <div className="max-w-4xl mx-auto">
                <LeaderboardHeader onBackClick={() => router.push("/")} />

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-[#2e4272] mb-6">
                        Top 10
                    </h2>

                    <LeaderboardList
                        leaderboard={leaderboard}
                        currentUserId={session.user?.id}
                    />
                </div>
            </div>
        </div>
    );
}
