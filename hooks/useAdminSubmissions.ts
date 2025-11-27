import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type AdminSubmission = {
    id: string;
    bingoItemId: string;
    image: string;
    message: string | null;
    createdAt: Date;
    bingoItem: {
        id: string;
        title: string;
        status: "unverified" | "pending" | "verified" | "rejected";
        index: number;
        userId: string;
    };
    user: {
        id: string;
        email: string;
        name: string | null;
    };
};

async function fetchAdminSubmissions(): Promise<AdminSubmission[]> {
    const res = await fetch("/api/admin/submissions");
    if (!res.ok) {
        throw new Error("Failed to fetch submissions");
    }
    return res.json();
}

async function updateTileStatus({
    itemId,
    status,
    rejectionReason,
}: {
    itemId: string;
    status: "verified" | "rejected";
    rejectionReason?: string;
}) {
    const res = await fetch(`/api/admin/tiles/${itemId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status,
            rejectionReason: status === "rejected" ? rejectionReason : null,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to update tile");
    }

    return res.json();
};

export function useAdminSubmissions() {
    return useQuery({
        queryKey: ["adminSubmissions"],
        queryFn: fetchAdminSubmissions,
    });
}

export function useUpdateTileStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTileStatus,
        onMutate: async ({ itemId }) => {
            await queryClient.cancelQueries({ queryKey: ["adminSubmissions"] });

            const previousSubmissions = queryClient.getQueryData<AdminSubmission[]>(["adminSubmissions"]);

            queryClient.setQueryData<AdminSubmission[]>(["adminSubmissions"], (old) =>
                old?.filter((s) => s.bingoItem.id !== itemId)
            );

            return { previousSubmissions };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousSubmissions) {
                queryClient.setQueryData(["adminSubmissions"], context.previousSubmissions);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["adminSubmissions"] });
        },
    });
}
