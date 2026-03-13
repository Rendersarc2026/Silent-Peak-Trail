"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function InitialLoader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hide loader after a short delay OR when everything is ready
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            <div className="relative flex flex-col items-center">
                {/* Logo or Brand Name */}
                <h1
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="mb-8 sm:mb-10 text-xl sm:text-3xl tracking-tight uppercase animate-pulse"
                >
                    <span className="font-medium text-slate-500">Silent</span>
                    <span className="font-medium text-[var(--navy)] mx-1 sm:mx-2">Peak</span>
                    <span className="font-medium text-slate-500">Trail</span>
                </h1>

                {/* Aesthetic Spinner */}
                <div className="relative">
                    <div className="h-10 w-10 sm:h-16 sm:w-16 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute top-0 left-0 h-10 w-10 sm:h-16 sm:w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                </div>

                <p className="mt-6 text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] text-slate-400 animate-pulse text-center px-4">
                    Preparing your Himalayan Journey
                </p>
            </div>
        </div>
    );
}
