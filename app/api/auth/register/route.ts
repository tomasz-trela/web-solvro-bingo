import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getUserByEmail, createUser, createUserBingoItems } from "@/db/queries";
import { validateEmail, validatePassword, validateName, sanitizeInput } from "@/lib/validation";
import { badRequestResponse, conflictResponse, serverErrorResponse, successResponse } from "@/lib/api-utils";

export async function POST(req: Request) {
    try {

        const { email, password, name } = await req.json();

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return badRequestResponse(emailValidation.error || "Invalid email");
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return badRequestResponse(passwordValidation.error || "Invalid password");
        }

        const nameValidation = validateName(name);
        if (!nameValidation.valid) {
            return badRequestResponse(nameValidation.error || "Invalid name");
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return conflictResponse("User with this email already exists");
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await createUser({
            email: sanitizeInput(email.toLowerCase()),
            password: hashedPassword,
            name: name ? sanitizeInput(name) : null,
        });

        await createUserBingoItems(newUser.id);

        return successResponse(
            {
                message: "User created successfully",
                user: newUser
            },
            201
        );
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Registration error:", error);
        }
        return serverErrorResponse("An error occurred during registration");
    }
}
