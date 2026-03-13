"use client";
import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploadProps {
    value: string;         // current image URL
    onChange: (url: string) => void; // called with the new URL after upload
    onError?: (msg: string) => void; // optional: surface errors to the parent
    minWidth?: number;
    minHeight?: number;
}

const DEFAULT_MIN_W = 800;
const DEFAULT_MIN_H = 600;

/** Returns { w, h } of an image File via a temporary object URL. */
function getImageDimensions(file: File): Promise<{ w: number; h: number }> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            resolve({ w: img.naturalWidth, h: img.naturalHeight });
            URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not read image dimensions."));
        };
        img.src = url;
    });
}

export default function ImageUpload({
    value,
    onChange,
    onError,
    minWidth = DEFAULT_MIN_W,
    minHeight = DEFAULT_MIN_H,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [localError, setLocalError] = useState("");

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

        // 0. Size check (1MB to 10MB)
        const minSize = 1024 * 1024; // 1MB
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size < minSize || file.size > maxSize) {
            emitError(
                `Image size must be between 1MB and 10MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
            );
            e.target.value = "";
            return;
        }

        // 1. Dimension check (client-side, no extra package needed)
        try {
            const { w, h } = await getImageDimensions(file);
            if (w < minWidth || h < minHeight) {
                emitError(
                    `Image is too small (${w}×${h}px). Minimum required size is ${minWidth}×${minHeight}px.`
                );
                e.target.value = ""; // reset file input
                return;
            }
        } catch {
            emitError("Could not verify image dimensions. Please try a different file.");
            e.target.value = "";
            return;
        }

        // 2. Upload
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                            type="button"
                            onClick={() => onChange("")}
                            className="hidden sm:block rounded-lg bg-red-600 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg"
                        >
                            Remove Photo
                        </button>
                    </div>
                    {/* Persistent remove for mobile */}
                    <div className="absolute inset-x-0 bottom-0 sm:hidden flex justify-center p-2 bg-black/20">
                        <button 
                            type="button"
                            onClick={() => onChange("")}
                            className="rounded-lg bg-red-600/90 px-3 py-1.5 text-[9px] font-bold text-white uppercase tracking-widest active:bg-red-700 shadow-lg backdrop-blur-sm"
                        >
                            Remove Photo
                        </button>
                    </div>
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
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={uploading}
                />
                {uploading ? (
                    <>
                        <Loader2 size={24} className="animate-spin text-blue-500" />
                        <span className="text-xs font-medium">Uploading image...</span>
                    </>
                ) : (
                    <>
                        <div className="rounded-full bg-white p-2 shadow-sm ring-1 ring-slate-200">
                            <Upload size={20} className="text-blue-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-700">Click to upload image</p>
                            <p className="text-[10px] text-slate-400">
                                JPG, PNG or WEBP · 1MB–10MB · Min. {minWidth}×{minHeight}px
                            </p>
                        </div>
                    </>
                )}
            </label>
        </div>
    );
}
