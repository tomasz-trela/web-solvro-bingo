"use client";

import { useState } from "react";
import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Nieprawidłowy email lub hasło");
    } else {
      // Pobierz sesję aby sprawdzić rolę
      const session = await fetch("/api/auth/session").then((r) => r.json());

      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundImage: "url(/bg.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-8 sm:p-10 bg-white/95 backdrop-blur-sm border rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#2e4272]">
          Logowanie
        </h1>

        {registered && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-medium text-[#2e4272]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:border-[#6583c8] focus:outline-none focus:ring-2 focus:ring-[#6583c8]/20"
            placeholder="user@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-[#2e4272]">Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:border-[#6583c8] focus:outline-none focus:ring-2 focus:ring-[#6583c8]/20"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#2e4272] text-white p-3 rounded-lg hover:bg-[#1b294c] transition font-medium"
        >
          Zaloguj się
        </button>

        <p className="mt-4 text-center text-gray-600">
          Nie masz konta?{" "}
          <Link
            href="/register"
            className="text-[#6583c8] hover:underline font-medium"
          >
            Zarejestruj się
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div>Ładowanie...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
