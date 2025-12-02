interface LeaderboardEntryProps {
    entry: {
        userId: string;
        name: string | null;
        email: string;
        verifiedCount: number;
    };
    index: number;
    isCurrentUser: boolean;
}

export function LeaderboardEntry({ entry, index, isCurrentUser }: LeaderboardEntryProps) {
    const getMedalColor = (position: number) => {
        if (position === 0) return "bg-yellow-400 text-yellow-900";
        if (position === 1) return "bg-gray-300 text-gray-700";
        if (position === 2) return "bg-orange-400 text-orange-900";
        return "bg-[#2e4272] text-white";
    };

    return (
        <div
            className={`flex items-center gap-4 p-4 rounded-lg transition ${isCurrentUser
                    ? "bg-[#6583c8]/10 border-2 border-[#6583c8]"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
        >
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getMedalColor(index)}`}>
                {index + 1}
            </div>

            <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#2e4272] truncate">
                    {entry.name || entry.email}
                    {isCurrentUser && (
                        <span className="ml-2 text-sm text-[#6583c8]">(You)</span>
                    )}
                </div>
                {entry.name && (
                    <div className="text-sm text-gray-500 truncate">{entry.email}</div>
                )}
            </div>

            <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-[#2e4272]">
                    {entry.verifiedCount}
                </div>
                <div className="text-xs text-gray-500">
                    completed
                </div>
            </div>
        </div>
    );
}
