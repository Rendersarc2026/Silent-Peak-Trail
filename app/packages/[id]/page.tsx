import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Booking from "@/components/Booking";
import StructuredData from "@/components/StructuredData";
import {
    Clock,
    MapPin,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Calendar,
    Mountain,
    Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const pkg = await prisma.package.findUnique({ where: { id: parseInt(id) || 0 } });

    if (!pkg) return { title: "Package Not Found" };

    return {
        title: `${pkg.name} Expedition`,
        description: pkg.tagline || `Experience the magic of ${pkg.name} with Silent Peak Trail. Authentic Ladakh travel specialists.`,
        openGraph: {
            images: [pkg.img],
        },
    };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [pkg, settingsRecords, allPackages] = await Promise.all([
        prisma.package.findUnique({ where: { id: parseInt(id) || 0 } }),
        prisma.homepage.findMany(),
        prisma.package.findMany({ select: { id: true, name: true } }),
    ]);

    if (!pkg) notFound();

    const homepageData: Record<string, string> = {};
    settingsRecords.forEach((s: { key: string; value: string }) => { homepageData[s.key] = s.value; });
    const packageList = allPackages.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name }));

    const itinerary = (pkg.itinerary as { day: string; title: string; activities?: string }[]) || [];
    const inclusions = (pkg.inclusions as string[]) || [];
    const exclusions = (pkg.exclusions as string[]) || [];

    return (
        <>
            <StructuredData
                type="TouristTrip"
                data={{
                    name: pkg.name,
                    description: pkg.tagline,
                    image: pkg.img,
                    price: String(pkg.price),
                }}
            />
            <Navbar />
            <main className="min-h-screen bg-[var(--white)] pt-[72px]">
                {/* Header Hero Section */}
                <div className="relative h-[50vh] min-h-[480px] w-full overflow-hidden">
                    <img
                        src={pkg.img}
                        alt={pkg.name}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/40 to-transparent" />

                    <div className="container mx-auto absolute top-0 left-0 right-0 px-5 pt-12 lg:px-[60px]">
                        <Link
                            href="/#packages"
                            className="group inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/20 hover:ring-white/40 active:scale-95 shadow-xl"
                        >
                            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                            <span className="sr-only">Back to Packages</span>
                        </Link>
                    </div>

                    <div className="container mx-auto absolute bottom-0 left-0 right-0 px-5 pb-16 lg:px-[60px]">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl">
                                {pkg.badge && (
                                    <div className={cn(
                                        "mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg",
                                        pkg.badgeGold ? "bg-[var(--gold)] text-white" : "bg-[var(--blue)] text-white"
                                    )}>
                                        {pkg.badgeGold && <Zap size={10} className="fill-white" />}
                                        {pkg.badge}
                                    </div>
                                )}
                                <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl font-serif">
                                    {pkg.name}
                                </h1>
                                <p className="mt-4 text-lg text-white/90 max-w-2xl font-medium italic">
                                    &ldquo;{pkg.tagline}&rdquo;
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/20">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)] text-white">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Duration</div>
                                        <div className="font-bold text-white">{pkg.duration}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/20">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--blue)] text-white">
                                        <span className="text-lg font-black italic">₹</span>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Starting At</div>
                                        <div className="font-bold text-white text-xl">₹{pkg.price.toLocaleString()} <span className="text-xs opacity-60">/ PP</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto mt-16 px-5 lg:px-[60px] pb-24">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
                        {/* Left Column - Itinerary & Terms */}
                        <div className="lg:col-span-2 space-y-16">

                            {/* Itinerary */}
                            {itinerary.length > 0 && (
                                <section>
                                    <div className="mb-10 flex items-center gap-4">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--blue)] text-white">
                                            <Calendar size={20} />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight text-[var(--navy)]">Package Itinerary</h2>
                                    </div>

                                    <div className="relative space-y-8 before:absolute before:left-[19px] before:top-4 before:h-[calc(100%-32px)] before:w-[2px] before:bg-slate-100">
                                        {itinerary.map((item: { day: string; title: string; activities?: string }, idx: number) => (
                                            <div key={idx} className="relative pl-14">
                                                <div className="absolute left-0 top-1 h-10 w-10 flex items-center justify-center rounded-full bg-white ring-2 ring-[var(--blue)] text-[var(--blue)] font-black text-xs z-10 shadow-sm">
                                                    {idx + 1}
                                                </div>
                                                <div className="rounded-3xl bg-[var(--bg-subtle)] p-6 transition-all hover:shadow-md ring-1 ring-slate-100">
                                                    <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--blue)]">{item.day}</div>
                                                    <h3 className="text-xl font-bold text-[var(--navy)]">{item.title}</h3>
                                                    {item.activities && (
                                                        <p className="mt-3 text-sm leading-relaxed text-[var(--text-mid)]">
                                                            {item.activities}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Terms and Conditions (Inclusions/Exclusions) */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Inclusions */}
                                <div className="rounded-[2.5rem] bg-green-50/30 p-8 ring-1 ring-green-100">
                                    <div className="mb-6 flex items-center gap-3 text-green-700">
                                        <CheckCircle2 size={24} />
                                        <h3 className="text-xl font-black tracking-tight">Inclusions</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {inclusions.map((inc: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                                                {inc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Exclusions */}
                                <div className="rounded-[2.5rem] bg-red-50/30 p-8 ring-1 ring-red-100">
                                    <div className="mb-6 flex items-center gap-3 text-red-700">
                                        <XCircle size={24} />
                                        <h3 className="text-xl font-black tracking-tight">Exclusions</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {exclusions.map((exc: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                                                {exc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Highlight & Booking Shortcut */}
                        <div className="space-y-8">
                            <div className="sticky top-28 space-y-8">
                                {/* Key Features Card */}
                                <div className="rounded-[2.5rem] bg-[var(--navy)] p-8 text-white shadow-2xl overflow-hidden relative">
                                    <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
                                    <h3 className="mb-6 text-xl font-black tracking-tight flex items-center gap-3">
                                        <Mountain size={20} className="text-[var(--gold)]" />
                                        Trip Highlights
                                    </h3>
                                    <ul className="space-y-4">
                                        {(pkg.features as string[]).map((f: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/80">
                                                <CheckCircle2 size={18} className="shrink-0 text-[var(--gold)]" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href="#contact"
                                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--gold)] py-4 text-center text-sm font-black uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                                    >
                                        Personalize & Book
                                    </a>
                                </div>

                                {/* Info Card */}
                                <div className="rounded-[2.5rem] bg-[var(--bg-subtle)] p-8 ring-1 ring-slate-100">
                                    <h4 className="mb-3 text-sm font-black uppercase tracking-widest text-[var(--navy)]">Important Note</h4>
                                    <p className="text-xs leading-relaxed text-[var(--text-mid)] font-medium">
                                        This itinerary is a recommended route. At Silent Peak Trail, we pride ourselves on customisation. Feel free to adjust the pace or add locations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Re-use Booking Form at bottom */}
                <div className="border-t border-slate-100">
                    <Booking
                        homepageData={homepageData}
                        packages={packageList}
                        selectedPackage={pkg.name}
                        variant="package"
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}
