interface ActionButtonsProps {
    onReject: () => void;
    onApprove: () => void;
    onPrevious?: () => void;
    onSkip?: () => void;
    isLoading?: boolean;
}

export function ActionButtons({
    onReject,
    onApprove,
    onPrevious,
    onSkip,
    isLoading = false,
}: ActionButtonsProps) {
    return (
        <div className="flex gap-4 mt-6 justify-center items-center">
            <button
                onClick={onReject}
                disabled={isLoading}
                className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-3xl"
                title="Reject"
                aria-label="Reject submission"
            >
                ✗
            </button>

            {onPrevious && (
                <button
                    onClick={onPrevious}
                    className="w-12 h-12 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full shadow transition flex items-center justify-center text-xl"
                    title="Previous"
                    aria-label="Previous submission"
                >
                    ←
                </button>
            )}

            {onSkip && (
                <button
                    onClick={onSkip}
                    className="w-12 h-12 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full shadow transition flex items-center justify-center text-xl"
                    title="Skip"
                    aria-label="Skip to next submission"
                >
                    →
                </button>
            )}

            <button
                onClick={onApprove}
                disabled={isLoading}
                className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-3xl"
                title="Approve"
                aria-label="Approve submission"
            >
                ✓
            </button>
        </div>
    );
}
