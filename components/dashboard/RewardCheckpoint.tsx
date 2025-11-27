import { useState } from "react";

interface RewardCheckpointProps {
    requiredLines: number;
    completedLines: number;
    position: string;
    icon: string;
    message: string;
}

export function RewardCheckpoint({
    requiredLines,
    completedLines,
    position,
    icon,
    message
}: RewardCheckpointProps) {
    const isUnlocked = completedLines >= requiredLines;
    const [showPopup, setShowPopup] = useState(false);

    function handleClick() {
        if (isUnlocked) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        }
    }

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                disabled={!isUnlocked}
                className="absolute -top-2 transform -translate-x-1/2 transition-all cursor-pointer disabled:cursor-not-allowed hover:scale-125"
                style={{ left: position }}
            >
                <div className={`text-2xl ${isUnlocked ? 'filter-none' : 'grayscale opacity-90'}`}>
                    {icon}
                </div>
            </button>

            {showPopup && (
                <div
                    className="absolute -top-20 z-50"
                    style={{
                        left: position,
                        transform: position === '100%' ? 'translateX(-100%)' : 'translateX(-50%)'
                    }}
                >
                    <div className="relative bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 px-6 py-3 rounded-xl shadow-2xl">
                        <div className="flex items-center gap-2 font-extrabold text-xl whitespace-nowrap text-white drop-shadow-lg">
                            <p className="tracking-tight">{message}</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-yellow-500 rounded-xl blur-sm -z-10 opacity-70"></div>
                        <div
                            className="absolute -bottom-2 transform"
                            style={{
                                left: position === '100%' ? 'calc(100% - 20px)' : '50%',
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-amber-500"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
