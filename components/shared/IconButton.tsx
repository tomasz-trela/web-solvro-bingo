interface IconButtonProps {
    onClick: () => void;
    icon: string;
    title: string;
}

export function IconButton({ onClick, icon, title }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-lg backdrop-blur-sm transition text-xl flex items-center justify-center"
            title={title}
        >
            {icon}
        </button>
    );
}
