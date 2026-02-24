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

const TIPS = [
    {
        icon: Wind,
        title: "Mandatory Acclimatization",
        desc: "Flyers MUST rest for at least 48 hours in Leh (3,500m) before heading higher. This prevents high altitude sickness.",
        color: "bg-blue-50 text-blue-600",
        border: "border-blue-100"
    },
    {
        icon: WifiOff,
        title: "Connectivity Check",
        desc: "Only POSTPAID SIM cards from outside Ladakh work here. BSNL and Airtel offer the best connectivity in the region.",
        color: "bg-amber-50 text-amber-600",
        border: "border-amber-100"
    },
    {
        icon: FileText,
        title: "Permits Required",
        desc: "Inner Line Permits (ILP) are required for visiting sensitive areas like Pangong Lake, Nubra Valley, and Tso Moriri.",
        color: "bg-red-50  text-red-600",
        border: "border-green-100"
    },
    {
        icon: Stethoscope,
        title: "Health & Essentials Matter",
        desc: "Pack a basic medical kit with Diamox, hydration salts, and personal meds. Access to specialized medical care is limited outside Leh.",
        color: "bg-indigo-50 text-indigo-700",
        border: "border-indigo-100"
    },
    {
        icon: ShieldAlert,
        title: "Eco-Travel Rules",
        desc: "Ladakh is a plastic-free zone. Carry reusable water bottles and avoid littering to protect this fragile ecosystem.",
        color: "bg-green-50 text-green-600",
        border: "border-red-100"
    },
    {
        icon: Mountain,
        title: "Layered Clothing",
        desc: "Temperature fluctuates wildly. Even in summer, nights can be freezing. Pack layers, sunblock, and UV sunglasses.",
        color: "bg-slate-50 text-slate-600",
        border: "border-slate-100"
    }
];

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
}

export default function LehPrep({ tips }: LehPrepProps) {
    const displayTips = tips && tips.length > 0 ? tips : TIPS;
    return (
        <section className="py-24 px-5 lg:px-[60px] bg-white">
            <div className="container mx-auto">
                <div className="mb-16">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700">
                        <Info size={12} />
                        Important Guide
                    </div>
                    <h2 className="text-4xl font-black leading-tight tracking-tighter text-[var(--navy)] sm:text-5xl lg:text-6xl">
                        What to Know <span className="text-[var(--blue)] italic font-serif">Before Arrival</span>
                    </h2>
                    <p className="mt-6 max-w-2xl text-lg text-slate-500 font-medium">
                        Preparation is key to a safe and enjoyable journey in the high Himalayas.
                        Keep these essentials in mind while planning your trip.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayTips.map((tip, i) => {
                        const IconComp = typeof tip.icon === 'string' ? (ICON_MAP[tip.icon] || Info) : tip.icon;
                        return (
                            <div
                                key={'id' in tip && tip.id ? tip.id : tip.title}
                                className={cn(
                                    "group relative overflow-hidden rounded-[2.5rem] border p-10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1",
                                    tip.border,
                                    tip.color
                                )}
                            >
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                                    <IconComp size={24} />
                                </div>
                                <h3 className="mb-3 text-xl font-black tracking-tight text-[var(--navy)]">
                                    {tip.title}
                                </h3>
                                <p className="text-sm font-bold leading-relaxed opacity-80">
                                    {tip.desc}
                                </p>

                                {/* Decorative side accent */}
                                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/40 blur-2xl group-hover:bg-white/60 transition-colors" />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 rounded-[3rem] bg-[var(--navy)] p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur-sm ring-1 ring-white/20">
                                <AlertTriangle size={14} className="text-amber-400" />
                                Altitude Warning
                            </div>
                            <h3 className="text-3xl font-black mb-4">Don&apos;t ignore the 48-hour rule</h3>
                            <p className="text-blue-100/80 font-bold leading-relaxed">
                                Acute Mountain Sickness (AMS) can affect anyone, regardless of fitness level.
                                Keep your first two days light, stay hydrated, and consult your doctor about Diamox.
                            </p>
                        </div>
                        <a
                            href="#contact"
                            className="shrink-0 bg-white text-[var(--navy)] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[var(--blue)] hover:text-white transition-all shadow-lg active:scale-95"
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
