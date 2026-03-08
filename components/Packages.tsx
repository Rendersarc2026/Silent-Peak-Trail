"use client";
import type { Package } from "@/lib/db";
import Link from "next/link";

import { Clock, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Packages({ packages }: { packages: Package[] }) {
  return (
    <section className="bg-[var(--bg-subtle)] py-24" id="packages">
      <div className="container mx-auto px-5 lg:px-[60px]">
        {/* ... Header Section ... */}
        <div className="mb-16 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--blue)]">
              <div className="h-[2px] w-8 bg-[var(--blue)]" />
              Our Tour Packages
            </div>
            <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--navy)] sm:text-5xl lg:text-6xl font-serif">
              Curated <span className="text-[var(--blue)] italic font-playfair">Journeys</span> <br className="hidden sm:block" /> Into the Himalayas
            </h2>
          </div>
          <p className="max-w-xs text-base leading-relaxed text-[var(--text-light)] lg:text-right lg:mb-2">
            Every itinerary is hand-crafted and can be fully personalised to match your pace, interests, and travel style.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
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
              <Link href={`/packages/${p.slug}`} className="relative h-72 overflow-hidden block">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {p.badge && (
                  <div className={cn(
                    "absolute top-6 left-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg",
                    p.badgeGold ? "bg-[var(--gold)] text-white" : "bg-[var(--navy)] text-white"
                  )}>
                    {p.badgeGold && <Zap size={10} className="fill-white" />}
                    {p.badge}
                  </div>
                )}

                <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/20">
                  <Clock size={14} className="text-[var(--gold)]" />
                  {p.duration}
                </div>
              </Link>

              {/* Body Section */}
              <div className="flex flex-1 flex-col p-8">
                <Link href={`/packages/${p.slug}`} className="mb-2 text-2xl font-black tracking-tight text-[var(--navy)] hover:text-[var(--blue)] transition-colors">
                  {p.name}
                </Link>
                <p className="mb-6 text-sm leading-relaxed text-[var(--text-mid)] line-clamp-2">
                  {p.tagline}
                </p>

                <ul className="mb-8 space-y-3">
                  {p.features.map((f: string, fi: number) => (
                    <li key={fi} className="flex items-start gap-3 text-xs font-medium text-[var(--text-mid)]">
                      <CheckCircle2 size={16} className="shrink-0 text-[var(--gold)]" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Footer Section */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)]">Starting at</div>
                    <div className="text-2xl font-black tracking-tighter text-[var(--blue)]">
                      {p.price ? `₹${Number(p.price).toLocaleString()}` : "Price on Request"}
                      <span className="ml-1 text-[10px] font-bold text-[var(--text-light)]">/ PP</span>
                    </div>
                  </div>
                  <Link
                    href={`/packages/${p.slug}`}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--navy)] text-white transition-all hover:bg-[var(--gold)] hover:scale-110 active:scale-95 shadow-lg"
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

