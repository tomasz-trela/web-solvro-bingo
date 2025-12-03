export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_NAME_LENGTH = 100;

export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const MAX_REQUESTS_PER_WINDOW = 5;

export const LEADERBOARD_LIMIT = 10;
export const BINGO_GRID_SIZE = 16;
export const MAX_COMPLETED_LINES = 10;

export const BINGO_STATUSES = ['unverified', 'pending', 'verified', 'rejected'] as const;
export type BingoStatus = typeof BINGO_STATUSES[number];
