"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Suspense } from "react";
import { useBingoTiles, type BingoTile } from "@/hooks/useBingoTiles";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUploader } from "@/components/submission/ImageUploader";
import { AlertMessage } from "@/components/submission/AlertMessage";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

function SubmissionForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tileId = searchParams.get("id");
  const queryClient = useQueryClient();

  const { data: tiles = [] } = useBingoTiles();
  const [tile, setTile] = useState<BingoTile | null>(null);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!tileId) {
      router.push("/");
      return;
    }

    const foundTile = tiles.find((t) => t.id === tileId);
    if (foundTile) {
      setTile(foundTile);
    }
  }, [session, status, router, tileId, tiles]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!message.trim()) {
      setError("Wiadomość jest wymagana");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bingo/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bingoItemId: tileId,
          image,
          message,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["bingoTiles"] });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        const data = await res.json();
        setError(data.error || "Nie udało się wysłać");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Wystąpił błąd");
      setIsSubmitting(false);
    }
  }

  if (status === "loading" || !tile) {
    return <LoadingScreen />;
  }

  if (!session) {
    return null;
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-8 relative"
      style={{
        backgroundImage: "url(/bg.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition text-sm"
          >
            Wyloguj
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-[#2e4272] mb-2">
            Wyślij Dowód
          </h1>
          <p className="text-gray-600 mb-6">{tile.title}</p>

          {success && (
            <AlertMessage
              type="success"
              message="Wysłano pomyślnie! Przekierowywanie..."
            />
          )}
          {error && <AlertMessage type="error" message={error} />}

          <form onSubmit={handleSubmit}>
            <ImageUploader image={image} onImageSelect={setImage} />

            <div className="mb-6">
              <label className="block mb-2 font-medium text-[#2e4272]">
                Wiadomość <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:border-[#6583c8] focus:outline-none focus:ring-2 focus:ring-[#6583c8]/20 min-h-[100px]"
                placeholder="Dodaj wiadomość..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2e4272] text-white p-3 rounded-lg hover:bg-[#1b294c] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Wysyłanie..." : "Wyślij"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SubmissionPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SubmissionForm />
    </Suspense>
  );
}
