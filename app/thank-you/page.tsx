"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function ThankYou() {
    return (
        <>
            <Navbar />
            <main className="bg-white pt-[72px]">
                {/* Hero Section */}
                <div className="relative pt-24 pb-0 w-full overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&fit=crop"
                        alt="Ladakh landscape"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/60 to-transparent" />

                    <div className="relative z-10 flex items-center justify-center px-5 text-center">
                        <div className="max-w-3xl space-y-6 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-300 backdrop-blur-md ring-1 ring-green-500/40">
                                <CheckCircle2 size={14} />
                                Booking Confirmed
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl font-serif">
                                See You in <span className="text-[var(--gold)] italic font-playfair">Ladakh!</span>
                            </h1>
                            <p className="mx-auto max-w-xl text-lg text-white/90 font-medium leading-relaxed">
                                Thank you for choosing Silent Peak Trail. We have received your enquiry and our team will get back to you shortly to finalize your dream journey.
                            </p>
                            <div className="pt-4">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[var(--gold)] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                                >
                                    Back to Home
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer className="pt-0" />
        </>
    );
}
