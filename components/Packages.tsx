"use client";
import type { Package } from "@/lib/db";
import Link from "next/link";

import { Clock, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Packages({ packages }: { packages: Package[] }) {
  return (
    <section className="bg-[var(--bg-subtle)] py-16 sm:py-24" id="packages">
      <div className="container mx-auto px-5 md:px-10 lg:px-[60px]">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--blue)] sm:mb-8">
              <div className="h-[2px] w-8 bg-[var(--blue)]" />
              Our Tour Packages
            </div>
            <h2
              className="text-[32px] font-medium leading-[1.1] tracking-tighter text-[var(--navy)] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Curated <span className="text-[var(--blue)] " >Journeys</span> <br className="hidden sm:block" /> Into the Himalayas
            </h2>
          </div>
          <p className="text-[14px] font-normal leading-relaxed text-slate-500 sm:text-lg lg:max-w-xs lg:text-right lg:mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Every itinerary is hand-crafted and can be fully personalised to match your pace, interests, and travel style.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:grid-rows-none xl:grid-cols-3">
          {packages.map((p, i) => (
            <div
              key={p.id}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-[var(--white)] shadow-[var(--shadow-lg)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-xl)] animate-fade-in-up",
                p.featured ? "ring-2 ring-[var(--gold)]" : "ring-1 ring-slate-100"
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Image Section */}
              <Link href={`/packages/${p.slug}`} className="relative h-56 sm:h-72 overflow-hidden block">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {p.badge && (
                  <div className={cn(
                    "absolute top-5 left-5 sm:top-6 sm:left-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg",
                    p.badgeGold ? "bg-[var(--gold)] text-white" : "bg-[var(--navy)] text-white"
                  )}>
                    {p.badgeGold && <Zap size={10} className="fill-white" />}
                    {p.badge}
                  </div>
                )}

                <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-[10px] sm:text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/20">
                  <Clock size={14} className="text-[var(--gold)]" />
                  {p.duration}
                </div>
              </Link>

              {/* Body Section */}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <Link href={`/packages/${p.slug}`} className="mb-2 text-xl sm:text-2xl font-black tracking-tight text-[var(--navy)] hover:text-[var(--blue)] transition-colors">
                  {p.name}
                </Link>
                <p className="mb-6 text-[13px] sm:text-sm leading-relaxed text-[var(--text-mid)] line-clamp-2">
                  {p.tagline}
                </p>
                <ul className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                  {Array.isArray(p.features) && p.features.map((f: string, fi: number) => (
                    <li key={fi} className="flex items-start gap-3 text-xs font-medium text-[var(--text-mid)]">
                      <CheckCircle2 size={16} className="shrink-0 text-[var(--gold)]" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Footer Section */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-5 sm:pt-6">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)]">Starting at</div>
                    <div className="text-xl sm:text-2xl font-black tracking-tighter text-[var(--blue)]">
                      {p.price ? `₹${Number(p.price).toLocaleString()}` : "Price on Request"}
                      <span className="ml-1 text-[10px] font-bold text-[var(--text-light)]">/ PP</span>
                    </div>
                  </div>
                  <Link
                    href={`/packages/${p.slug}`}
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--navy)] text-white transition-all hover:bg-[var(--gold)] hover:scale-110 active:scale-95 shadow-lg"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

