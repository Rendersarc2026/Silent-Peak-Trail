"use client";
import { Sparkles, ArrowRight, Clock, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

interface StargazingProps {
    packageData?: {
        id: string;
        name: string;
        slug: string;
        tagline: string;
        duration: string;
        price: number;
        features: string[];
        img: string;
    };
    homepageData?: Record<string, string>;
}

const ICON_MAP: Record<string, React.ElementType> = {
    Sparkles, Clock, CheckCircle2, Zap
};

export default function Stargazing({ packageData, homepageData }: StargazingProps) {
    const displayTagline = homepageData?.stargazingTagline || "Experience the universe like never before. From the high-altitude observatories of Hanle to the pristine shores of Pangong, witness the celestial dance under the world's darkest skies.";
    const displayTitle = homepageData?.stargazingTitle || "Stargazing in the Dark Skies of Hanle";
    const bookText = homepageData?.bookButtonText || "Explore Package";

    let highlights: any[] = [];
    if (homepageData?.stargazingHighlights) {
        try {
            const parsed = JSON.parse(homepageData.stargazingHighlights);
            if (Array.isArray(parsed) && parsed.length > 0) highlights = parsed;
        } catch (e) {
            console.error("Failed to parse stargazing highlights", e);
        }
    }


    return (
        <section id="stargazing" className="relative min-h-[650px] md:min-h-[800px] lg:min-h-[800px] w-full overflow-hidden bg-black pt-12 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 flex items-start">
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover object-bottom opacity-100"
            >
                <source src="/videos/stargazing.mp4" type="video/mp4" />
            </video>

            {/* Content Container */}
            <div className="container relative z-10 mx-auto px-5 lg:px-[60px]">
                <div className="flex flex-col gap-12 lg:gap-20">

                    {/* Header Area */}
                    <div className="max-w-5xl animate-fade-in-up">
                        <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                            <div className="h-[2px] w-8 bg-[var(--gold)]" />
                            Premium Package
                        </div>
                        <h2
                            className="text-[32px] font-medium leading-[1.1] tracking-tighter text-white sm:text-5xl lg:text-6xl"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            {displayTitle.split(' ').map((word, i) => (
                                word.toLowerCase().includes('hanle') ?
                                    <span key={i} className="text-[var(--gold)]"> {word} </span> :
                                    ` ${word} `
                            ))}
                        </h2>
                        <p className="mt-6 text-[14px] font-normal leading-snug text-blue-100/70 sm:mt-8 sm:text-base sm:leading-relaxed max-w-2xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {displayTagline}
                        </p>

                        <div className="mt-10 sm:mt-12 flex flex-wrap gap-5">
                            <Link
                                href={packageData ? `/packages/${packageData.slug}` : "#contact"}
                                className="group flex items-center gap-2 rounded-xl bg-white px-5 py-3 sm:px-10 sm:py-5 text-[11px] sm:text-sm font-black uppercase tracking-widest text-[var(--navy)] transition-all hover:bg-[var(--gold)] hover:text-white shadow-2xl active:scale-[0.98]"
                            >
                                {bookText}
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>




                </div>
            </div>

            {/* Bottom Bottom Text */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[11] flex flex-col items-center gap-1 text-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-white/20">
                    India&apos;s Darkest Skies
                </span>
                <span className="text-[14px] font-black uppercase tracking-tighter text-white/40 italic font-serif">
                    Hanle · Ladakh · 4,500m
                </span>
            </div>
        </section>
    );
}
