import { RewardCheckpoint } from "./RewardCheckpoint";

interface ProgressBarProps {
    completedLines: number;
    maxLines: number;
}

export function ProgressBar({ completedLines, maxLines }: ProgressBarProps) {
    const progress = (completedLines / maxLines) * 100;

    return (
        <div className="w-full mt-6 relative">
            <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm font-semibold">
                    Postęp linii: {completedLines}/{maxLines}
                </span>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-visible">
                <div
                    className="absolute h-full bg-[#8cd49a] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>

                <RewardCheckpoint
                    requiredLines={3}
                    completedLines={completedLines}
                    position="30%"
                    icon="🎁"
                    message="Długopis SOLVRO!"
                />

                <RewardCheckpoint
                    requiredLines={10}
                    completedLines={completedLines}
                    position="100%"
                    icon="🎁"
                    message="Torba SOLVRO!"
                />
            </div>
        </div>
    );
}
