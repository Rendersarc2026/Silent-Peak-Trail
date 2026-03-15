import { Compass, ShieldCheck, Leaf, Settings2, CheckCircle2, Users, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  ShieldCheck,
  Leaf,
  Settings2,
  Users
};

interface Feature {
  icon: string;
  title: string;
  color: string;
  bg: string;
  desc: string;
}

// Features are fetched from the database and passed as a prop.

interface WhyUsProps {
  homepageData?: Record<string, string>;
}

export default function WhyUs({ homepageData }: WhyUsProps) {
  const title = homepageData?.whyUsTitle || "Expertise That Transform Your Trip";
  const subtitle = homepageData?.whyUsSubtitle || "Since 2009, we've perfected every route and stay. Authentic experiences, uncompromising safety, and a deep respect for the Himalayas.";
  const image = homepageData?.whyUsImage || "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=900&q=80&fit=crop";
  const statsValue = homepageData?.whyUsStatsValue || "8,200+";
  const statsLabel = homepageData?.whyUsStatsLabel || "Happy Guests";

  let features: Feature[] = [];
  if (homepageData?.whyUsFeatures) {
    try {
      features = JSON.parse(homepageData.whyUsFeatures);
    } catch (e) {
      console.error("Failed to parse WhyUs features", e);
    }
  }

  return (
    <section className="bg-[var(--blue-deep)] py-16 sm:py-24 overflow-hidden" id="about">
      <div className="container mx-auto px-5 md:px-10 lg:px-[60px]">
        <div className="flex flex-col gap-14 md:gap-20 lg:flex-row lg:gap-16 lg:items-center">

          {/* Image Side */}
          <div className="relative lg:w-1/2">
            <div className="relative overflow-hidden rounded-[3rem] shadow-[var(--shadow-2xl)] animate-fade-in-left">
              <img
                src={image}
                alt="Ladakh mountain guide"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/40 to-transparent" />
            </div>

            {/* Floating Stats Badge */}
            <div className="absolute -bottom-7 right-0 sm:-bottom-12 sm:-right-2 rounded-[1.5rem] sm:rounded-[2rem] bg-white p-4 sm:p-7 shadow-[var(--shadow-2xl)] ring-1 ring-slate-100 animate-fade-in-up [animation-delay:400ms] border border-slate-50">

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--navy)] text-white shrink-0">
                  <Users size={16} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-black tracking-tighter text-[var(--navy)] leading-none">{statsValue}</div>
                  <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)] mt-1">{statsLabel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2">
            <div className="mb-5 sm:mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-700">
                <CheckCircle2 size={12} className="fill-amber-600 text-amber-100" />
                Why travel with us
              </div>
              <h2
                className="text-[32px] font-medium leading-tight tracking-tighter text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {title.split(' ').map((word, i) => (
                  word.toLowerCase() === 'transform' || word.toLowerCase() === 'transformed' ?
                    <span key={i} className="text-[var(--sky)] " > {word} </span> :
                    ` ${word} `
                ))}
              </h2>
            </div>

            <p className="mb-6 text-sm font-normal leading-snug text-blue-100/60 sm:mb-12 sm:text-lg sm:leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {subtitle}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {features.map((f, i) => {
                const Icon = ICON_MAP[f.icon] || Compass;
                return (
                  <div
                    key={f.title + i}
                    className="group flex flex-col items-start rounded-[1.8rem] bg-white p-6 shadow-[var(--shadow-sm)] ring-1 ring-slate-100 transition-all hover:shadow-[var(--shadow-lg)] hover:ring-[var(--blue)]/20 animate-fade-in-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-2 transition-transform group-hover:scale-110 group-hover:rotate-3 mb-4", f.bg, f.color)}>
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <h4 className="mb-1.5 text-lg font-bold text-[var(--navy)] group-hover:text-[var(--blue)] transition-colors">{f.title}</h4>
                    <p className="text-[12px] leading-relaxed text-[var(--text-light)]">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
