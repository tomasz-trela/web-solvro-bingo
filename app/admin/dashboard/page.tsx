"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAdminSubmissions, useUpdateTileStatus } from "@/hooks/useAdminSubmissions";
import { useSubmissionNavigation } from "@/hooks/useSubmissionNavigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { data: submissions = [], isLoading } = useAdminSubmissions();
    const updateTileMutation = useUpdateTileStatus();

    const {
        currentIndex,
        goToNext,
        goToPrevious,
        canGoNext,
        canGoPrevious,
    } = useSubmissionNavigation(submissions.length);

    const currentSubmission = submissions[currentIndex];

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

    const handleReject = () => {
        if (!currentSubmission) return;

        const reason = prompt("Rejection reason (optional):");
        if (reason !== null) {
            handleAction(currentSubmission.bingoItem.id, "rejected", reason || undefined);
        }
    };

    const handleApprove = () => {
        if (!currentSubmission) return;
        handleAction(currentSubmission.bingoItem.id, "verified");
    };

    if (status === "loading" || isLoading) {
        return <LoadingScreen />;
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
                <AdminHeader
                    userEmail={session.user?.email}
                    onLogout={() => signOut({ callbackUrl: "/login" })}
                />

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
                            <SubmissionCard
                                image={currentSubmission.image}
                                title={currentSubmission.bingoItem.title}
                                userName={currentSubmission.user.name || ""}
                                userEmail={currentSubmission.user.email}
                                submittedAt={currentSubmission.createdAt.toString()}
                                message={currentSubmission.message || undefined}
                            />

                            <ActionButtons
                                onReject={handleReject}
                                onApprove={handleApprove}
                                onPrevious={canGoPrevious ? goToPrevious : undefined}
                                onSkip={canGoNext ? goToNext : undefined}
                                isLoading={updateTileMutation.isPending}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
