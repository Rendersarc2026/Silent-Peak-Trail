"use client";
import {
    Wind,
    WifiOff,
    Stethoscope,
    FileText,
    ShieldAlert,
    Mountain,
    AlertTriangle,
    Info,
    Star, Droplets, Sun, Camera, Heart, Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
    Wind, WifiOff, FileText, Stethoscope, ShieldAlert, Mountain,
    Star, Droplets, Sun, Camera, Heart, Compass, Info, AlertTriangle
};

interface LehTip {
    id?: string;
    icon: string | React.ElementType;
    title: string;
    desc: string;
    color: string;
    border: string;
}

interface LehPrepProps {
    tips?: LehTip[];
    homepageData?: Record<string, string>;
}

export default function LehPrep({ tips, homepageData }: LehPrepProps) {
    if (!tips || tips.length === 0) return null;

    const amsTitle = homepageData?.amsWarningTitle || "Don't ignore the 48-hour rule";
    const amsDesc = homepageData?.amsWarningDesc || "Acute Mountain Sickness (AMS) can affect anyone, regardless of fitness level. Keep your first two days light, stay hydrated, and consult your doctor about Diamox.";

    return (
        <section className="py-24 px-5 lg:px-[60px] bg-white">
            <div className="container mx-auto">
                <div className="mb-10 sm:mb-20">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700">
                        <Info size={12} />
                        Important Guide
                    </div>
                    <h2
                        className="text-[32px] leading-[1.1] font-medium tracking-tighter text-[var(--navy)] sm:text-5xl lg:text-6xl"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        What to Know <span className="text-[var(--blue)]">Before Arrival</span>
                    </h2>
                    <p className="mt-4 max-w-2xl text-[14px] text-slate-500 font-normal leading-normal sm:mt-8 sm:text-lg sm:leading-relaxed lg:max-w-2xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Preparation is key to a safe and enjoyable journey in the high Himalayas.
                        Keep these essentials in mind while planning your trip.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tips.map((tip: LehTip, i: number) => {
                        const IconComp = (typeof tip.icon === 'string' && tip.icon) ? (ICON_MAP[tip.icon] || Info) : (tip.icon || Info);
                        return (
                            <div
                                key={'id' in tip && tip.id ? tip.id : tip.title}
                                className={cn(
                                    "group relative overflow-hidden rounded-[2rem] border p-6 sm:p-10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1",
                                    tip.border,
                                    tip.color
                                )}
                            >
                                <div className="mb-4 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                                    <IconComp size={20} className="sm:size-6" />
                                </div>
                                <h3 className="mb-1.5 text-lg sm:text-xl font-black tracking-tight text-[var(--navy)]">
                                    {tip.title}
                                </h3>
                                <p className="text-[12px] sm:text-sm font-bold leading-relaxed opacity-80">
                                    {tip.desc}
                                </p>

                                {/* Decorative side accent */}
                                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/40 blur-2xl group-hover:bg-white/60 transition-colors" />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 rounded-[2.5rem] bg-[var(--navy)] p-8 sm:p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur-sm ring-1 ring-white/20">
                                <AlertTriangle size={14} className="text-amber-400" />
                                Altitude Warning
                            </div>
                            <h3
                                className="text-2xl sm:text-3xl font-medium mb-3"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                {amsTitle}
                            </h3>
                            <p
                                className="text-blue-100/80 text-base sm:text-lg font-normal leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                {amsDesc}
                            </p>
                        </div>
                        <a
                            href="#contact"
                            className="shrink-0 bg-white text-[var(--navy)] px-6 py-3 sm:px-10 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-[var(--blue)] hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            Consult an Expert
                        </a>
                    </div>

                    {/* Abstract pattern bg */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
