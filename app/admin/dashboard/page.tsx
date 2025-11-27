"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAdminSubmissions, useUpdateTileStatus } from "@/hooks/useAdminSubmissions";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { data: submissions = [], isLoading } = useAdminSubmissions();
    const updateTileMutation = useUpdateTileStatus();
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentSubmission = submissions[currentIndex];

    useEffect(() => {
        if (currentIndex >= submissions.length && submissions.length > 0) {
            setCurrentIndex(submissions.length - 1);
        } else if (submissions.length === 0) {
            setCurrentIndex(0);
        }
    }, [submissions.length, currentIndex]);

    const handleAction = (
        itemId: string,
        action: "verified" | "rejected",
        rejectionReason?: string
    ) => {
        updateTileMutation.mutate({
            itemId,
            status: action,
            rejectionReason,
        });

    };

    const handleSkip = () => {
        if (currentIndex < submissions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (status === "loading" || isLoading) {
        return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    if (session.user?.role !== "admin") {
        router.push("/");
        return null;
    }

    return (
        <div className="min-h-screen p-4 sm:p-8 relative" style={{ backgroundImage: 'url(/bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                            Admin Panel
                        </h1>
                        <p className="text-sm text-white/80 truncate">{session.user?.email}</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition text-sm"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#2e4272]">
                            Review Submissions
                        </h2>
                        <div className="text-sm text-gray-600">
                            {submissions.length > 0 ? `${currentIndex + 1} / ${submissions.length}` : '0 / 0'}
                        </div>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">No pending submissions</p>
                        </div>
                    ) : currentSubmission ? (
                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    {currentSubmission.image && (
                                        <div className="relative">
                                            <img
                                                src={currentSubmission.image}
                                                alt="Submission"
                                                className="w-full h-96 object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-[#2e4272] mb-3">
                                            {currentSubmission.bingoItem.title}
                                        </h3>
                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <p><strong>User:</strong> {currentSubmission.user.name || currentSubmission.user.email}</p>
                                            <p><strong>Submitted:</strong> {new Date(currentSubmission.createdAt).toLocaleString()}</p>
                                            {currentSubmission.message && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-800">{currentSubmission.message}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6 justify-center items-center">
                                    <button
                                        onClick={() => {
                                            const reason = prompt("Rejection reason (optional):");
                                            if (reason !== null) {
                                                handleAction(currentSubmission.bingoItem.id, "rejected", reason || undefined);
                                            }
                                        }}
                                        disabled={updateTileMutation.isPending}
                                        className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-3xl"
                                        title="Reject"
                                    >
                                        ✗
                                    </button>

                                    {currentIndex > 0 && (
                                        <button
                                            onClick={handlePrevious}
                                            className="w-12 h-12 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full shadow transition flex items-center justify-center text-xl"
                                            title="Previous"
                                        >
                                            ←
                                        </button>
                                    )}

                                    {currentIndex < submissions.length - 1 && (
                                        <button
                                            onClick={handleSkip}
                                            className="w-12 h-12 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full shadow transition flex items-center justify-center text-xl"
                                            title="Skip"
                                        >
                                            →
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleAction(currentSubmission.bingoItem.id, "verified")}
                                        disabled={updateTileMutation.isPending}
                                        className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-3xl"
                                        title="Approve"
                                    >
                                        ✓
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
