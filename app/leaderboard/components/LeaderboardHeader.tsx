interface LeaderboardHeaderProps {
    onBackClick: () => void;
}

export function LeaderboardHeader({ onBackClick }: LeaderboardHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-4 mb-6">

            <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Leaderboard
            </h1>
        </div>
    );
}
