import Image from "next/image";
import { BingoLetter } from "./BingoLetter";

export function DashboardHeader() {
    return (
        <div className="flex flex-col items-center mb-6">
            <Image
                src="/solvro.png"
                alt="Solvro Logo"
                width={100}
                height={60}
                className="mb-8"
                unoptimized
            />
            <div className="flex items-center justify-center -space-x-4 mb-4">
                <BingoLetter letter="B" isDark />
                <BingoLetter letter="I" isDark={false} />
                <BingoLetter letter="N" isDark />
                <BingoLetter letter="G" isDark={false} />
                <BingoLetter letter="O" isDark />
            </div>
        </div>
    );
}
