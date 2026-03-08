"use client";
import { Sparkles, ArrowRight, Clock, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const DEFAULT_HIGHLIGHTS = [
    {
        icon: "Sparkles",
        title: "Bortle 1 Skies",
        desc: "Experience the universe in absolute darkness. Hanle is India's only Dark Sky Reserve with zero light pollution."
    },
    {
        icon: "Clock",
        title: "High Altitude Advantage",
        desc: "At 4,500m, the atmosphere is thin and pristine, offering clarity that transforms stargazing into a spiritual event."
    },
    {
        icon: "CheckCircle2",
        title: "Expert Astro-Guides",
        desc: "Equipped with professional telescopes and celestial knowledge, our guides reveal the stories behind the stars."
    }
];

const ICON_MAP: Record<string, React.ElementType> = {
    Sparkles, Clock, CheckCircle2, Zap
};

export default function Stargazing({ packageData, homepageData }: StargazingProps) {
    const displayTagline = homepageData?.stargazingTagline || "Experience the universe like never before. From the high-altitude observatories of Hanle to the pristine shores of Pangong, witness the celestial dance under the world's darkest skies.";
    const displayTitle = homepageData?.stargazingTitle || "Stargazing in the Dark Skies of Hanle";
    const bookText = homepageData?.bookButtonText || "Explore Package";

    let highlights = DEFAULT_HIGHLIGHTS;
    if (homepageData?.stargazingHighlights) {
        try {
            const parsed = JSON.parse(homepageData.stargazingHighlights);
            if (Array.isArray(parsed) && parsed.length > 0) highlights = parsed;
        } catch (e) {
            console.error("Failed to parse stargazing highlights", e);
        }
    }


    return (
        <section id="stargazing" className="relative min-h-screen w-full overflow-hidden bg-black py-24 flex items-center">
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-60"
            >
                <source src="/videos/stargazing.mp4" type="video/mp4" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#05122b_0%,_#000000_100%)]" />
            </video>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black via-transparent to-black" />

            {/* Content Container */}
            <div className="container relative z-10 mx-auto px-5 lg:px-[60px]">
                <div className="flex flex-col gap-20">

                    {/* Header Area */}
                    <div className="max-w-5xl animate-fade-in-up">
                        <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                            <div className="h-[2px] w-8 bg-[var(--gold)]" />
                            Premium Package
                        </div>
                        <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl font-serif">
                            {displayTitle.split(' ').map((word, i) => (
                                word.toLowerCase().includes('hanle') ?
                                    <span key={i} className="text-[var(--gold)] italic font-playfair"> {word} </span> :
                                    ` ${word} `
                            ))}
                        </h2>
                        <p className="mt-8 text-base leading-relaxed text-blue-100/70 font-medium max-w-2xl">
                            {displayTagline}
                        </p>

                        <div className="mt-12 flex flex-wrap gap-5">
                            <Link
                                href={packageData ? `/packages/${packageData.slug}` : "#contact"}
                                className="group flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-[var(--navy)] transition-all hover:bg-[var(--gold)] hover:text-white shadow-2xl active:scale-[0.98]"
                            >
                                {bookText}
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Highlights Grid - Glassmorphism */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up [animation-delay:300ms]">
                        {highlights.map((item, i) => {
                            const IconComp = typeof item.icon === 'string' ? (ICON_MAP[item.icon] || Sparkles) : (item.icon || Sparkles);
                            return (
                                <div
                                    key={i}
                                    className="group relative overflow-hidden rounded-[2.5rem] bg-white/5 p-10 backdrop-blur-md ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
                                >
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 transition-transform group-hover:scale-110">
                                        <IconComp size={24} className="text-[var(--gold)]" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-medium leading-relaxed text-blue-100/60">
                                        {item.desc}
                                    </p>

                                    {/* Aesthetic Glow */}
                                    <div className="absolute -bottom-12 -right-12 h-24 w-24 bg-[var(--gold)] opacity-0 blur-[60px] transition-opacity group-hover:opacity-40" />
                                </div>
                            );
                        })}
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
