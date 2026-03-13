"use client";
import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";

interface VideoUploadProps {
    value: string;         // current video URL
    onChange: (url: string) => void; // called with the new URL after upload
    onError?: (msg: string) => void; // optional: surface errors to the parent
}

export default function VideoUpload({
    value,
    onChange,
    onError,
}: VideoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [localError, setLocalError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    function emitError(msg: string) {
        setLocalError(msg);
        onError?.(msg);
    }

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset
        setLocalError("");
        onError?.("");

        // 0. Size check (up to 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            emitError(
                `Video size must be less than 50MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
            );
            e.target.value = "";
            return;
        }

        // 1. Upload
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed.");
            onChange(data.url);
        } catch (err: unknown) {
            emitError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Preview */}
            {value && (
                <div className="relative group aspect-video w-full overflow-hidden rounded-xl border bg-slate-100">
                    <video src={value} controls className="h-full w-full object-cover" />
                </div>
            )}

            {/* Local error */}
            {localError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {localError}
                </p>
            )}

            {/* Drop zone */}
            <label className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-slate-500 transition-all hover:border-blue-400 hover:bg-blue-50/50">
                <input
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    accept="video/*"
                    onChange={handleChange}
                    disabled={uploading}
                />
                {uploading ? (
                    <>
                        <Loader2 size={24} className="animate-spin text-blue-500" />
                        <span className="text-xs font-medium">Uploading video... (this may take a while)</span>
                    </>
                ) : (
                    <>
                        <div className="rounded-full bg-white p-2 shadow-sm ring-1 ring-slate-200">
                            <Upload size={20} className="text-blue-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-700">Click to upload video</p>
                            <p className="text-[10px] text-slate-400">
                                MP4, WEBM or MOV · Up to 50MB
                            </p>
                        </div>
                    </>
                )}
            </label>
        </div>
    );
}
