import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getUserByEmail, createUser, createUserBingoItems } from "@/db/queries";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await createUser({
            email,
            password: hashedPassword,
            name: name || null,
        });

        await createUserBingoItems(newUser.id);

        return NextResponse.json(
            {
                message: "User created successfully",
                user: newUser
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "An error occurred during registration" },
            { status: 500 }
        );
    }
}
