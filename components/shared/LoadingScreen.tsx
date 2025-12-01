export function LoadingScreen() {
    return (
        <div
            className="flex h-screen items-center justify-center"
            style={{
                backgroundImage: 'url(/bg.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>

                    <div className="absolute inset-4 bg-white/10 rounded-full animate-pulse"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>

                <p className="text-white text-lg font-semibold animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}
