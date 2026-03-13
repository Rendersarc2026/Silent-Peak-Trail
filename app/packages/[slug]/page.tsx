import dbConnect from "@/lib/db";
import Package from "@/lib/models/Package";
import Homepage from "@/lib/models/Homepage";
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
    Zap,
    Image as ImageIcon,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import PackageGallery from "@/components/PackageGallery";

const ICON_MAP: Record<string, React.ElementType> = {
    Sparkles, Clock, CheckCircle2, Zap
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    await dbConnect();
    const { slug } = await params;
    const pkg = await Package.findOne({ slug, isActive: true }).lean();

    if (!pkg) return { title: "Package Not Found" };

    return {
        title: `${pkg.name} Expedition`,
        description: pkg.tagline || `Experience the magic of ${pkg.name} with Silent Peak Trail. Authentic Ladakh travel specialists.`,
        openGraph: {
            images: [pkg.img],
        },
    };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    await dbConnect();

    const [pkg, settingsRecords, allPackages] = await Promise.all([
        Package.findOne({ slug, isActive: true }).lean(),
        Homepage.find().lean(),
        Package.find({ isActive: true }).select('_id name').lean(),
    ]);

    if (!pkg) notFound();

    const homepageData: Record<string, string> = {};
    settingsRecords.forEach((s: { key: string; value: string }) => { homepageData[s.key] = s.value; });
    const packageList = allPackages.map((p: any) => ({ id: String(p._id), name: p.name }));

    const itinerary = Array.isArray(pkg.itinerary) ? (pkg.itinerary as { day: string; title: string; activities?: string }[]) : [];
    const inclusions = Array.isArray(pkg.inclusions) ? (pkg.inclusions as string[]) : [];
    const exclusions = Array.isArray(pkg.exclusions) ? (pkg.exclusions as string[]) : [];
    const photos = Array.isArray(pkg.photos) ? (pkg.photos as string[]) : [];

    let highlights: any[] = [];
    if (slug === 'stargazing-expedition' && homepageData?.stargazingHighlights) {
        try {
            const parsed = JSON.parse(homepageData.stargazingHighlights);
            if (Array.isArray(parsed) && parsed.length > 0) highlights = parsed;
        } catch (e) {
            console.error("Failed to parse stargazing highlights", e);
        }
    }

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
                <div className="relative h-[60vh] min-h-[520px] lg:h-[50vh] lg:min-h-[480px] w-full overflow-hidden">
                    {slug === 'stargazing-expedition' ? (
                        <div className="absolute inset-0 bg-black">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="h-full w-full object-cover opacity-60"
                            >
                                <source src="/videos/stargazing.mp4" type="video/mp4" />
                            </video>
                        </div>
                    ) : (
                        <img
                            src={pkg.img}
                            alt={pkg.name}
                            className="h-full w-full object-cover"
                        />
                    )}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t via-transparent to-transparent",
                        slug === 'stargazing-expedition'
                            ? "from-black via-black/40"
                            : "from-[var(--navy)] via-[var(--navy)]/40"
                    )} />

                    <div className="container mx-auto absolute inset-0 px-5 pt-8 pb-10 lg:px-[60px] flex flex-col justify-between pointer-events-none">
                        <div className="pointer-events-auto">
                            <Link
                                href="/#packages"
                                className="group inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-black uppercase tracking-widest text-white backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/20 hover:ring-white/40 active:scale-95 shadow-xl"
                            >
                                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 lg:w-[18px]" />
                                <span className="sr-only">Back to Packages</span>
                                <span className="lg:inline hidden">Back</span>
                            </Link>
                        </div>

                        <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row lg:items-end lg:justify-between pointer-events-auto mt-auto">
                            <div className="max-w-3xl">
                                {pkg.badge && (
                                    <div className={cn(
                                        "mb-3 lg:mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 lg:px-4 lg:py-1.5 text-[9px] lg:text-[10px] font-black uppercase tracking-widest shadow-lg",
                                        pkg.badgeGold ? "bg-[var(--gold)] text-white" : "bg-[var(--blue)] text-white"
                                    )}>
                                        {pkg.badgeGold && <Zap size={10} className="fill-white" />}
                                        {pkg.badge}
                                    </div>
                                )}
                                <h1 className="text-3xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl font-serif">
                                    {pkg.name}
                                </h1>
                                <p className="mt-3 lg:mt-4 text-base lg:text-lg text-white/90 max-w-2xl font-medium italic">
                                    &ldquo;{pkg.tagline}&rdquo;
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 lg:gap-4 mt-2">
                                <div className="flex items-center gap-3 lg:gap-4 rounded-2xl bg-white/10 p-3 lg:p-4 backdrop-blur-md ring-1 ring-white/20">
                                    <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-[var(--gold)] text-white">
                                        <Clock size={16} className="lg:w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-white/60 leading-none">Duration</div>
                                        <div className="font-bold text-white text-sm lg:text-base">{pkg.duration}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 lg:gap-4 rounded-2xl bg-white/10 p-3 lg:p-4 backdrop-blur-md ring-1 ring-white/20">
                                    <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-[var(--blue)] text-white">
                                        <span className="text-base lg:text-lg font-black italic">₹</span>
                                    </div>
                                    <div>
                                        <div className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-white/60 leading-none">Starting At</div>
                                        <div className="font-bold text-white text-lg lg:text-xl leading-tight">₹{pkg.price.toLocaleString()} <span className="text-[10px] lg:text-xs opacity-60">/ PP</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto mt-16 px-5 lg:px-[60px] pb-8 lg:pb-24">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-16">
                        {/* Left Column - Itinerary & Terms */}
                        <div className="lg:col-span-2 space-y-16">

                            {/* Stargazing Highlights - Re-implemented with glassmorphism */}
                            {slug === 'stargazing-expedition' && highlights.length > 0 && (
                                <section className="animate-fade-in-up">
                                    <div className="mb-10 flex items-center gap-4">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--gold)] text-white">
                                            <Sparkles size={20} />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight text-[var(--navy)]">Expedition Highlights</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {highlights.map((item, i) => {
                                            const IconComp = typeof item.icon === 'string' ? (ICON_MAP[item.icon] || Sparkles) : (item.icon || Sparkles);
                                            return (
                                                <div
                                                    key={i}
                                                    className="group relative overflow-hidden rounded-[2.5rem] bg-[var(--navy)] p-6 sm:p-10 shadow-2xl transition-all hover:-translate-y-1"
                                                >
                                                    {/* Background Image with Zoom */}
                                                    <div className="absolute inset-0 z-0">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&q=80"
                                                            alt="Stargazing"
                                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-[var(--navy)]/80 transition-opacity group-hover:opacity-60" />
                                                        <div className="absolute inset-0 ring-1 ring-white/10 transition-all duration-500 group-hover:ring-white/20" />
                                                    </div>

                                                    <div className="relative z-10">
                                                        <div className="mb-4 sm:mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 transition-transform group-hover:scale-110">
                                                            <IconComp size={22} className="text-[var(--gold)]" />
                                                        </div>
                                                        <h3 className="mb-2 text-xl font-bold text-white tracking-tight">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm font-medium leading-relaxed text-white/70">
                                                            {item.desc}
                                                        </p>
                                                    </div>

                                                    <div className="absolute -bottom-12 -right-12 h-24 w-24 bg-cyan-500 opacity-0 blur-[60px] transition-opacity group-hover:opacity-40" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

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

                            {/* Trip Photos Library */}
                            <PackageGallery
                                items={photos}
                                type="photo"
                                title="PHOTO GALLERY"
                            />

                            {/* Trip Videos Library */}
                            <PackageGallery
                                items={pkg.videos as string[]}
                                type="video"
                                title="VIDEO GALLERY"
                            />
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
                                        {Array.isArray(pkg.features) && (pkg.features as string[]).map((f: string, i: number) => (
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
