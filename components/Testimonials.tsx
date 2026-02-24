import type { Testimonial } from "@/lib/db";
import { Star, Quote, MessageSquare } from "lucide-react";

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="bg-[var(--white)] py-24 px-5 lg:px-[60px] overflow-hidden">
      <div className="container mx-auto">

        {/* Header Section */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--navy)]">
            <MessageSquare size={12} className="text-[var(--blue)]" />
            Traveller Stories
          </div>
          <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[var(--navy)] sm:text-5xl lg:text-6xl font-serif">
            What Our Guests <span className="text-[var(--blue)] italic font-playfair">Say</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="relative flex flex-col rounded-[2.5rem] bg-[var(--white)] p-10 shadow-[var(--shadow-xl)] ring-1 ring-slate-100 animate-fade-in-up hover:shadow-[var(--shadow-2xl)] transition-all duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Quote Icon Background */}
              <div className="absolute top-10 right-10 text-slate-50">
                <Quote size={64} strokeWidth={3} className="opacity-40" />
              </div>

              {/* Star Rating */}
              <div className="mb-6 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    size={16}
                    className={si < t.stars ? "fill-[var(--gold)] text-[var(--gold)]" : "fill-slate-100 text-slate-100"}
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="relative mb-10 text-lg leading-relaxed text-[var(--navy)]/80 font-medium italic font-serif">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author Info */}
              <div className="mt-auto flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)] text-xl font-black text-white shadow-lg">
                  {t.initial}
                </div>
                <div>
                  <div className="font-black tracking-tight text-[var(--navy)]">
                    {t.name}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)]">
                    {t.place} <span className="mx-2 text-slate-200">|</span> {t.package}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
