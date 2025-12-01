import { useState, useEffect } from "react";

export function useSubmissionNavigation(totalSubmissions: number) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex >= totalSubmissions && totalSubmissions > 0) {
            setCurrentIndex(totalSubmissions - 1);
        } else if (totalSubmissions === 0) {
            setCurrentIndex(0);
        }
    }, [totalSubmissions, currentIndex]);

    const goToNext = () => {
        if (currentIndex < totalSubmissions - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const canGoNext = currentIndex < totalSubmissions - 1;
    const canGoPrevious = currentIndex > 0;

    return {
        currentIndex,
        goToNext,
        goToPrevious,
        canGoNext,
        canGoPrevious,
    };
}
