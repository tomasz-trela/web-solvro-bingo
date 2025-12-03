interface BackgroundContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function BackgroundContainer({ children, className = "" }: BackgroundContainerProps) {
    return (
        <div
            className={`bg-cover bg-center bg-no-repeat ${className}`}
            style={{ backgroundImage: 'url(/bg.svg)' }}
        >
            {children}
        </div>
    );
}
