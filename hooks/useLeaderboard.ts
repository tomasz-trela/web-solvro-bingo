import { useQuery } from "@tanstack/react-query";

export interface LeaderboardEntry {
    userId: string;
    email: string;
    name: string | null;
    verifiedCount: number;
}

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await fetch("/api/leaderboard");
    if (!res.ok) {
        throw new Error("Failed to fetch leaderboard");
    }
    return res.json();
}

export function useLeaderboard() {
    return useQuery({
        queryKey: ["leaderboard"],
        queryFn: fetchLeaderboard,
    });
}
