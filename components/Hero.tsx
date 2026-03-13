"use client";
import type { Settings } from "@/lib/db";
import { ArrowDown, Mountain, ChevronRight } from "lucide-react";
import { smoothScroll } from "@/lib/utils";

export default function Hero({ homepageData }: { homepageData: Record<string, string> }) {
  return (
    <section className="relative min-h-[700px] w-full overflow-hidden flex flex-col pt-28 lg:pt-32 xl:pt-36 pb-24 lg:pb-48">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/70 via-[var(--navy)]/40 to-[var(--navy)]/90 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/60 via-transparent to-transparent z-10" />
        <img
          src={homepageData.heroBgImage || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1900&q=85&fit=crop"}
          alt="Ladakh landscape"
          className="h-full w-full object-cover animate-image-zoom"
        />
      </div>

      <div className="container relative z-20 mx-auto px-5 lg:px-[60px]">
        <div className="max-w-3xl">
          {/* Animated Badge */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-md ring-1 ring-white/20 animate-fade-in-up sm:mb-8 sm:text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            {homepageData.heroBadge}
          </div>

          {/* Main Title */}
          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="mb-6 font-serif text-[clamp(38px,8vw,88px)] font-bold leading-[1.05] tracking-tight text-white animate-fade-in-up [animation-delay:200ms] sm:mb-8"
            dangerouslySetInnerHTML={{
              __html: homepageData.heroTitle?.replace(/Ladakh/g, `<span class="text-amber-500 italic">Ladakh</span>`) || ''
            }}
          />

          {/* Subtitle */}
          <p className="mb-8 max-w-xl text-[14px] leading-snug text-white/80 animate-fade-in-up [animation-delay:400ms] sm:mb-12 sm:text-lg sm:leading-relaxed">
            {homepageData.heroSubtitle}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up [animation-delay:600ms]">
            <a
              href="#packages"
              onClick={(e) => smoothScroll(e, "#packages")}
              className="group flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-[12px] font-black uppercase tracking-widest text-[var(--navy)] transition-all hover:bg-[var(--gold)] hover:text-white shadow-xl shadow-white/5 sm:px-8 sm:py-5 sm:text-sm"
            >
              Explore Packages
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#destinations"
              onClick={(e) => smoothScroll(e, "#destinations")}
              className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-white/20 px-6 py-4 text-[12px] font-black uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:px-8 sm:py-5 sm:text-sm"
            >
              Learn More
              <Mountain size={18} className="text-amber-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-3 text-white transition-opacity hover:opacity-50 animate-bounce group"
        onClick={(e) => {
          e.preventDefault();
          const p = document.querySelector("#packages");
          if (p) p.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Scroll Down</span>
        <ArrowDown size={20} strokeWidth={3} className="text-amber-500" />
      </div>

      {/* Aesthetic Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
