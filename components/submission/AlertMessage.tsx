interface AlertMessageProps {
    type: "success" | "error";
    message: string;
}

export function AlertMessage({ type, message }: AlertMessageProps) {
    return (
        <div
            className={`p-4 rounded-lg mb-4 ${type === "success"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
        >
            {message}
        </div>
    );
}
