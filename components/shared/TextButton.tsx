interface TextButtonProps {
    onClick: () => void;
    text: string;
    title: string;
}

export function TextButton({ onClick, text, title }: TextButtonProps) {
    return (
        <button
            onClick={onClick}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition text-sm"
        >
            {text}
        </button>
    );
}
