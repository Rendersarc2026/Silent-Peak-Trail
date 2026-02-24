import type { Settings } from "@/lib/db";
import { Mountain, Map as MapIcon, Users, History, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatsStrip({ homepageData }: { homepageData: Record<string, string> }) {
  const stats = [
    { num: homepageData.statsAltitude, lbl: "Max Altitude", icon: Mountain },
    { num: homepageData.statsPackages, lbl: "Tour Packages", icon: MapIcon },
    { num: homepageData.statsTravellers, lbl: "Happy Guests", icon: Users },
    { num: homepageData.statsExperience, lbl: "Years Exp.", icon: History },
    { num: homepageData.statsSatisfaction, lbl: "Satisfaction", icon: Heart },
  ];

  return (
    <section className="relative z-30 -mt-4 px-5 lg:px-[60px]">
      <div className="container mx-auto">
        <div className="bg-[var(--navy)] rounded-[2.5rem] p-10 lg:p-14 shadow-[var(--shadow-2xl)] border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 items-center">
            {stats.map((s, i) => (
              <div
                key={s.lbl}
                className="flex flex-col items-center text-center group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[var(--gold)] mb-2 tabular-nums transition-transform group-hover:scale-110">
                  {s.num}
                </div>
                <div className="text-xs lg:text-[14px] font-bold uppercase tracking-[0.3em] text-white/50">
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
