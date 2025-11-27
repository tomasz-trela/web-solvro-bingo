import { IconButton } from "./IconButton";
import { TextButton } from "./TextButton";

interface TopBarActionsProps {
    onLeaderboardClick: () => void;
    onSignOut: () => void;
}

export function TopBarActions({ onLeaderboardClick, onSignOut }: TopBarActionsProps) {
    return (
        <div className="absolute top-4 right-4 flex gap-2">
            <IconButton
                onClick={onLeaderboardClick}
                icon="🏆"
                title="Leaderboard"
            />
            <TextButton
                onClick={onSignOut}
                text="Wyloguj"
                title="Wyloguj"
            />
        </div>
    );
}
