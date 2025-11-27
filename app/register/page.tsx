"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Hasła nie są identyczne");
            return;
        }

        if (password.length < 6) {
            setError("Hasło musi mieć minimum 6 znaków");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Wystąpił błąd podczas rejestracji");
                return;
            }

            // Przekieruj do logowania
            router.push("/login?registered=true");
        } catch (err) {
            setError("Wystąpił błąd podczas rejestracji");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundImage: 'url(/bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <form onSubmit={handleSubmit} className="p-8 sm:p-10 bg-white/95 backdrop-blur-sm border rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#2e4272]">Rejestracja</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-2 font-medium text-[#2e4272]">Imię</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:border-[#6583c8] focus:outline-none focus:ring-2 focus:ring-[#6583c8]/20"
                        placeholder="Jan Kowalski"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium text-[#2e4272]">Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:border-[#6583c8] focus:outline-none focus:ring-2 focus:ring-[#6583c8]/20"
                        placeholder="user@example.com"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium text-[#2e4272]">Hasło *</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:border-[#6583c8] focus:outline-none focus:ring-2 focus:ring-[#6583c8]/20"
                        placeholder="Minimum 6 znaków"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-[#2e4272]">Potwierdź hasło *</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:border-[#6583c8] focus:outline-none focus:ring-2 focus:ring-[#6583c8]/20"
                        placeholder="Powtórz hasło"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2e4272] text-white p-3 rounded-lg hover:bg-[#1b294c] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {loading ? "Rejestrowanie..." : "Zarejestruj się"}
                </button>

                <p className="mt-4 text-center text-gray-600">
                    Masz już konto?{" "}
                    <Link href="/login" className="text-[#6583c8] hover:underline font-medium">
                        Zaloguj się
                    </Link>
                </p>
            </form>
        </div>
    );
}
