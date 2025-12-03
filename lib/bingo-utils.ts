import { MAX_COMPLETED_LINES } from './constants';

export interface BingoCalculation {
    verifiedIndices: Set<number>;
    completedLines: number;
}

const GRID_SIZE = 4;
const DIAGONAL_1 = [0, 5, 10, 15];
const DIAGONAL_2 = [3, 6, 9, 12];

export function calculateBingoProgress(tiles: Array<{ status: string; index: number }>): BingoCalculation {
    const verifiedIndices = new Set(
        tiles.filter(t => t.status === "verified").map(t => t.index)
    );

    let count = 0;

    for (let row = 0; row < GRID_SIZE; row++) {
        const rowIndices = Array.from({ length: GRID_SIZE }, (_, col) => row * GRID_SIZE + col);
        if (rowIndices.every(i => verifiedIndices.has(i))) {
            count++;
        }
    }

    for (let col = 0; col < GRID_SIZE; col++) {
        const colIndices = Array.from({ length: GRID_SIZE }, (_, row) => row * GRID_SIZE + col);
        if (colIndices.every(i => verifiedIndices.has(i))) {
            count++;
        }
    }

    if (DIAGONAL_1.every(i => verifiedIndices.has(i))) count++;
    if (DIAGONAL_2.every(i => verifiedIndices.has(i))) count++;

    return {
        verifiedIndices,
        completedLines: count
    };
}
