import { useRef, useState, useEffect } from "react";

interface ImageUploaderProps {
    image: string;
    onImageSelect: (image: string) => void;
}

export function ImageUploader({ image, onImageSelect }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCamera, setHasCamera] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                    setHasCamera(videoDevices.length > 0);
                })
                .catch(() => {
                    setHasCamera(false);
                });
        }
    }, []);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageSelect(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    async function startCamera() {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            setShowCamera(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Nie można uzyskać dostępu do kamery');
        }
    }

    function capturePhoto() {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg');
                onImageSelect(imageData);
                closeCamera();
            }
        }
    }

    function closeCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    }

    return (
        <div className="mb-4">
            <label className="block mb-2 font-medium text-[#2e4272]">
                Zdjęcie (opcjonalne)
            </label>

            {showCamera ? (
                <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={capturePhoto}
                            className="bg-white text-[#2e4272] py-2 px-6 rounded-lg hover:bg-gray-100 transition font-medium"
                        >
                            📸 Zrób zdjęcie
                        </button>
                        <button
                            type="button"
                            onClick={closeCamera}
                            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition font-medium"
                        >
                            ✕ Anuluj
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className={`flex gap-2 mb-2 ${!hasCamera ? 'flex-col' : ''}`}>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`bg-[#2e4272] text-white py-3 px-4 rounded-lg hover:bg-[#1b294c] transition font-medium ${!hasCamera ? 'w-full' : 'flex-1'}`}
                        >
                            📁 Wybierz plik
                        </button>
                        {hasCamera && (
                            <button
                                type="button"
                                onClick={startCamera}
                                className="flex-1 bg-[#2e4272] text-white py-3 px-4 rounded-lg hover:bg-[#1b294c] transition font-medium"
                            >
                                📷 Zrób zdjęcie
                            </button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </>
            )}

            {image && (
                <div className="mt-2">
                    <img src={image} alt="Preview" className="max-w-full h-48 object-cover rounded-lg" />
                    <button
                        type="button"
                        onClick={() => onImageSelect("")}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                        Usuń zdjęcie
                    </button>
                </div>
            )}
        </div>
    );
}
