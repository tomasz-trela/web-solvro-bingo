"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CountdownPage() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState<{
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    const targetDate = new Date("2025-11-26T19:00:00");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                router.push("/login");
                return null;
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { hours, minutes, seconds };
        };

        // Oblicz natychmiast
        setTimeLeft(calculateTimeLeft());

        // Aktualizuj co sekundę
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            if (newTimeLeft === null) {
                clearInterval(timer);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    if (!timeLeft) {
        return (
            <div className="flex min-h-screen items-center justify-center" style={{ backgroundImage: 'url(/bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <div className="text-white text-2xl">Przekierowywanie...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundImage: 'url(/bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="text-center bg-white/95 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-2xl max-w-2xl w-full">
                <h1 className="text-3xl sm:text-5xl font-bold text-[#2e4272] mb-6">
                    🎯 Solvro Bingo
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 mb-8">
                    Odliczanie do startu
                </p>

                <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-[#2e4272] text-white rounded-xl p-4 sm:p-6">
                        <div className="text-4xl sm:text-6xl font-bold">
                            {String(timeLeft.hours).padStart(2, '0')}
                        </div>
                        <div className="text-sm sm:text-base mt-2 text-white/80">Godzin</div>
                    </div>
                    <div className="bg-[#6583c8] text-white rounded-xl p-4 sm:p-6">
                        <div className="text-4xl sm:text-6xl font-bold">
                            {String(timeLeft.minutes).padStart(2, '0')}
                        </div>
                        <div className="text-sm sm:text-base mt-2 text-white/80">Minut</div>
                    </div>
                    <div className="bg-[#2e4272] text-white rounded-xl p-4 sm:p-6">
                        <div className="text-4xl sm:text-6xl font-bold">
                            {String(timeLeft.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-sm sm:text-base mt-2 text-white/80">Sekund</div>
                    </div>
                </div>

                <p className="text-gray-600 text-sm sm:text-base">
                    Gra rozpocznie się {targetDate.toLocaleDateString('pl-PL', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
        </div>
    );
}
