import {
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_MESSAGE_LENGTH,
    MAX_NAME_LENGTH,
    MAX_IMAGE_SIZE_BYTES
} from './constants';

export function validateEmail(email: string): { valid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !email.trim()) {
        return { valid: false, error: 'Email is required' };
    }

    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    if (email.length > 255) {
        return { valid: false, error: 'Email is too long' };
    }

    return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
    if (!password) {
        return { valid: false, error: 'Password is required' };
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
        return { valid: false, error: 'Password is too long' };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one number' };
    }

    return { valid: true };
}

export function validateName(name: string | null | undefined): { valid: boolean; error?: string } {
    if (!name) {
        return { valid: true };
    }

    if (name.length > MAX_NAME_LENGTH) {
        return { valid: false, error: 'Name is too long' };
    }

    return { valid: true };
}

export function validateMessage(message: string): { valid: boolean; error?: string } {
    if (!message || !message.trim()) {
        return { valid: false, error: 'Message is required' };
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        return { valid: false, error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` };
    }

    return { valid: true };
}

export function validateBase64Image(image: string | null | undefined): { valid: boolean; error?: string } {
    if (!image) {
        return { valid: true };
    }

    const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
    if (!base64Regex.test(image)) {
        return { valid: false, error: 'Invalid image format. Must be a base64 encoded image' };
    }

    const base64Length = image.split(',')[1]?.length || 0;
    const approximateBytes = (base64Length * 3) / 4;

    if (approximateBytes > MAX_IMAGE_SIZE_BYTES) {
        return { valid: false, error: `Image size exceeds ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB limit` };
    }

    return { valid: true };
}

export function sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
}
