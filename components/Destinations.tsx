import type { Destination } from "@/lib/db";
import { Mountain, Compass, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Destinations({ destinations }: { destinations: Destination[] }) {
  return (
    <section className="bg-[var(--white)] py-24" id="destinations">
      <div className="container mx-auto px-5 lg:px-[60px]">
        {/* Header Section */}
        <div className="mb-16 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--blue)]">
              <div className="h-[2px] w-8 bg-[var(--blue)]" />
              Where We Go
            </div>
            <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--navy)] sm:text-5xl lg:text-6xl font-serif">
              Iconic <span className="text-[var(--blue)] italic font-playfair">Destinations</span> <br className="hidden sm:block" /> of Ladakh
            </h2>
          </div>
          <p className="max-w-xs text-base leading-relaxed text-[var(--text-light)] lg:text-right lg:mb-2">
            From sky-mirroring lakes to towering sand dunes, each corner of Ladakh tells a different story.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid auto-rows-[250px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {destinations.map((d, i) => (
            <div
              key={d.id}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] bg-[var(--bg-subtle)] shadow-[var(--shadow-lg)] ring-1 ring-slate-100 animate-fade-in-up",
                d.big ? "sm:row-span-2" : ""
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Background with Zoom Effect */}
              <img
                src={d.img}
                alt={d.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/90 via-[var(--navy)]/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

              {/* Floating Action Button */}
              <div className="absolute top-6 right-6 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white ring-1 ring-white/30">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="mb-2 inline-block w-fit rounded-lg bg-[var(--gold)] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                  {d.type}
                </div>
                <h3 className="mb-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {d.name}
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-100/70">
                  <Mountain size={14} className="text-[var(--gold)]" />
                  {d.altitude}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
