import { LeaderboardEntry } from "./LeaderboardEntry";

interface LeaderboardListProps {
    leaderboard: Array<{
        userId: string;
        name: string | null;
        email: string;
        verifiedCount: number;
    }>;
    currentUserId?: string;
}

export function LeaderboardList({ leaderboard, currentUserId }: LeaderboardListProps) {
    if (leaderboard.length === 0) {
        return <p className="text-gray-600 text-center py-8">No data yet</p>;
    }

    return (
        <div className="space-y-3">
            {leaderboard.map((entry, index) => (
                <LeaderboardEntry
                    key={entry.userId}
                    entry={entry}
                    index={index}
                    isCurrentUser={currentUserId === entry.userId}
                />
            ))}
        </div>
    );
}
