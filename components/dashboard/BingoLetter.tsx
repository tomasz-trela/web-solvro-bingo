interface BingoLetterProps {
    letter: string;
    isDark?: boolean;
}

export function BingoLetter({ letter, isDark = true }: BingoLetterProps) {
    return (
        <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl relative transition-transform duration-200 hover:-translate-y-2 cursor-pointer ${isDark
                ? 'bg-[#2e4272] text-white'
                : 'bg-white text-[#2e4272]'
                }`}
        >
            {letter}
        </div>
    );
}
