interface SubmissionCardProps {
    image?: string | null;
    title: string;
    userName: string;
    userEmail: string;
    submittedAt: string;
    message?: string;
}

function formatDate(dateString: string): string {
    try {
        return new Date(dateString).toLocaleString();
    } catch {
        return dateString;
    }
}

export function SubmissionCard({
    image,
    title,
    userName,
    userEmail,
    submittedAt,
    message,
}: SubmissionCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {image && (
                <div className="relative w-full h-96">
                    <img
                        src={image}
                        alt="Submission"
                        className="w-full h-full object-contain bg-gray-100"
                    />
                </div>
            )}
            <div className="p-6">
                <h3 className="text-2xl font-bold text-[#2e4272] mb-3">
                    {title}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                        <strong>User:</strong> {userName || userEmail}
                    </p>
                    <p>
                        <strong>Submitted:</strong>{" "}
                        {formatDate(submittedAt)}
                    </p>
                    {message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-800">{message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
