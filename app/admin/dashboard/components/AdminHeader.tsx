interface AdminHeaderProps {
    userEmail?: string | null;
    onLogout: () => void;
}

export function AdminHeader({ userEmail, onLogout }: AdminHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Admin Panel
                </h1>
                {userEmail && (
                    <p className="text-sm text-white/80 truncate">{userEmail}</p>
                )}
            </div>
            <button
                onClick={onLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition text-sm"
            >
                Logout
            </button>
        </div>
    );
}
