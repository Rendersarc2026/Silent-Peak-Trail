"use client";
import type { Testimonial } from "@/lib/db";
import { Star, Quote, MessageSquare, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import CarouselArrow from "./ui/CarouselArrow";

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [expandedReview, setExpandedReview] = useState<Testimonial | null>(null);
  const total = testimonials.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleItems(1);
      else if (window.innerWidth < 1024) setVisibleItems(2);
      else setVisibleItems(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = expandedReview ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [expandedReview]);

  const maxIndex = Math.max(0, total - visibleItems);
  const next = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prev = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) next();
    else if (distance < -minSwipeDistance) prev();
  };

  useEffect(() => {
    const interval = setInterval(next, 8000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  if (!total) return null;

  return (
    <section id="testimonials" className="bg-[var(--white)] py-16 sm:py-24 px-5 md:px-10 lg:px-[60px] overflow-hidden">
      <div className="container mx-auto">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--navy)]">
            <MessageSquare size={12} className="text-[var(--blue)]" />
            Traveller Stories
          </div>
          <h2
            className="text-3xl font-medium leading-tight tracking-tight text-[var(--navy)] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            What Our Guests <span className="text-[var(--blue)]">Say</span>
          </h2>
        </div>

        <div className="group relative px-[6px] lg:px-16">
          <CarouselArrow direction="left" onClick={prev} className="absolute left-2 lg:left-0 top-1/2 z-10 -translate-y-1/2 hidden sm:flex" disabled={currentIndex === 0} />
          <CarouselArrow direction="right" onClick={next} className="absolute right-2 lg:right-0 top-1/2 z-10 -translate-y-1/2 hidden sm:flex" disabled={currentIndex === maxIndex} />

          <div className="overflow-hidden py-10 px-4 -my-10 -mx-4 touch-pan-y" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <div className="flex transition-transform duration-500 ease-out gap-8" style={{ transform: `translateX(calc(-${currentIndex} * (100% + 32px) / ${visibleItems}))` }}>
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  style={{ width: `calc((100% - ${(visibleItems - 1) * 32}px) / ${visibleItems})` }}
                  className="relative flex-shrink-0 flex flex-col overflow-hidden rounded-[2.5rem] bg-[var(--white)] p-8 shadow-[var(--shadow-xl)] ring-1 ring-slate-100 transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-[var(--navy)] text-3xl font-black text-white shadow-xl overflow-hidden ring-4 ring-slate-50 transition-all duration-300">
                      {t.image ? (
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        t.initial
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-3 mt-1">
                      <Quote size={48} strokeWidth={3} className="text-slate-100 opacity-60" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} size={16} className={si < t.stars ? "fill-[var(--gold)] text-[var(--gold)]" : "fill-slate-100 text-slate-100"} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clamped review text */}
                  <p className="relative mb-3 text-l font-medium italic leading-relaxed text-[var(--navy)]/80 font-serif line-clamp-6 break-words">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Read more — bottom right, only for long text */}
                  {t.text.length > 250 && (
                    <div className="flex justify-end mb-5">
                      <button
                        onClick={() => setExpandedReview(t)}
                        className="text-sm font-semibold text-[var(--blue)] hover:underline"
                      >
                        Read more ↓
                      </button>
                    </div>
                  )}

                  {/* Spacer so author stays low */}
                  <div className="flex-1" />

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                    <div className="min-w-0">
                      <div className="truncate font-black tracking-tight text-[var(--navy)]">{t.name}</div>
                      <div className="truncate text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)]">
                        {t.place} <span className="mx-2 text-slate-200">|</span> {t.package}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-3 pb-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} className={cn("h-2 rounded-full transition-all duration-300", currentIndex === i ? "w-8 bg-[var(--blue)]" : "w-2 bg-slate-200 hover:bg-slate-300")} />
            ))}
          </div>
        </div>
      </div>

      {/* Full Review Modal */}
      {expandedReview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setExpandedReview(null)}
        >
          <div
            className="relative w-full max-w-[90%] sm:max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedReview(null)}
              className="absolute top-4 right-4 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={14} className="sm:hidden" />
              <X size={16} className="hidden sm:block" />
            </button>

            <div className="mb-4 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star
                  key={si}
                  className={cn(
                    "w-3 h-3 sm:w-4 sm:h-4",
                    si < expandedReview.stars ? "fill-[var(--gold)] text-[var(--gold)]" : "fill-slate-100 text-slate-100"
                  )}
                />
              ))}
            </div>

            <p className="mb-5 text-sm sm:text-base font-medium italic leading-relaxed text-[var(--navy)]/80 font-serif break-words">
              &ldquo;{expandedReview.text}&rdquo;
            </p>

            <div className="flex items-center gap-3 sm:gap-4 border-t pt-4 sm:pt-5 border-slate-100">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-[var(--navy)] text-xl sm:text-2xl font-black text-white shadow-md overflow-hidden ring-2 sm:ring-4 ring-slate-50">
                {expandedReview.image ? (
                  <img src={expandedReview.image} alt={expandedReview.name} className="w-full h-full object-cover" />
                ) : (
                  expandedReview.initial
                )}
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-black tracking-tight text-[var(--navy)] mb-0.5 truncate">{expandedReview.name}</div>
                <div className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-[var(--text-light)] truncate">
                  {expandedReview.place} <span className="mx-1 sm:mx-2 text-slate-200">|</span> {expandedReview.package}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
