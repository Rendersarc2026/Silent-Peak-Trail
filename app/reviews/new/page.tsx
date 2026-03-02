"use client";

import { useEffect, useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import { hasError, getErrorMessage } from "@/lib/utils";

export default function NewReviewPage() {
    const [rating, setRating] = useState(5);
    const [name, setName] = useState("");
    const [place, setPlace] = useState("");
    const [packageId, setPackageId] = useState<number>(0);
    const [packages, setPackages] = useState<{ id: number, name: string }[]>([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        fetch("/api/packages")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPackages(data);
            })
            .catch(err => console.error("Failed to fetch packages", err));
    }, []);

    const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/^[A-Za-z\s]$/.test(e.key) && !["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setFieldErrors({});

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, place, packageId, rating, message }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsSubmitted(true);
            } else {
                if (data.details) {
                    setFieldErrors(data.details);
                    setError("Please fill all required fields.");
                } else {
                    setError(data.error || "Something went wrong. Please try again.");
                }
            }
        } catch (error) {
            console.error(error);
            setError("Error connecting to the server. Please check your internet.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-32 pb-24 bg-slate-50">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-md mx-auto bg-white p-12 rounded-[2.5rem] shadow-xl ring-1 ring-slate-100">
                            <div className="mb-6 flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={48} />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-[var(--navy)] mb-4">Thank You!</h1>
                            <p className="text-slate-600 mb-8">
                                Your review has been submitted successfully. It will be visible on our website once it&apos;s approved by our team.
                            </p>
                            <Link
                                href="/"
                                className="inline-block bg-[var(--navy)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--blue)] transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-32 pb-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold text-[var(--navy)] mb-4">Share Your Experience</h1>
                            <p className="text-slate-600">We&apos;d love to hear about your journey with us.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl ring-1 ring-slate-100">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-bold text-[var(--navy)] uppercase tracking-wider mb-4">
                                        Your Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    size={32}
                                                    className={star <= rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-slate-200"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-bold text-[var(--navy)] uppercase tracking-wider mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        maxLength={50}
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={handleNameKeyDown}
                                        className={`w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--blue)] transition-all outline-none ${hasError(fieldErrors, 'name') ? 'ring-red-300 bg-red-50/30' : ''}`}
                                        placeholder="John Doe"
                                    />
                                    {hasError(fieldErrors, 'name') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'name')}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Place */}
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--navy)] uppercase tracking-wider mb-2">
                                            Where are you from?
                                        </label>
                                        <input
                                            maxLength={50}
                                            type="text"
                                            value={place}
                                            onChange={(e) => setPlace(e.target.value)}
                                            className={`w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--blue)] transition-all outline-none ${hasError(fieldErrors, 'place') ? 'ring-red-300 bg-red-50/30' : ''}`}
                                            placeholder="e.g. Mumbai, India"
                                        />
                                        {hasError(fieldErrors, 'place') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'place')}</p>}
                                    </div>

                                    {/* Package */}
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--navy)] uppercase tracking-wider mb-2">
                                            Select Package
                                        </label>
                                        <select
                                            value={packageId}
                                            onChange={(e) => setPackageId(Number(e.target.value))}
                                            className={`w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--blue)] transition-all outline-none appearance-none ${hasError(fieldErrors, 'packageId') ? 'ring-red-300 bg-red-50/30' : ''}`}
                                        >
                                            <option value={0}>Select a package</option>
                                            {packages.map(pkg => (
                                                <option key={pkg.id} value={pkg.id}>
                                                    {pkg.name}
                                                </option>
                                            ))}
                                        </select>
                                        {hasError(fieldErrors, 'packageId') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'packageId')}</p>}
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
                                            Your Story
                                        </label>
                                        <span className={`text-[10px] font-bold ${message.length > 900 ? 'text-red-500' : 'text-slate-400'}`}>
                                            {message.length} / 1000
                                        </span>
                                    </div>
                                    <textarea
                                        maxLength={1000}
                                        rows={5}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className={`w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--blue)] transition-all outline-none resize-none ${hasError(fieldErrors, 'message') ? 'ring-red-300 bg-red-50/30' : ''}`}
                                        placeholder="Tell us about your trip..."
                                    />
                                    {hasError(fieldErrors, 'message') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'message')}</p>}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-[var(--navy)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--blue)] transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Submitting..." : (
                                        <>
                                            Submit Review <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
