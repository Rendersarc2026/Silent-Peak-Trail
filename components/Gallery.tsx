"use client";
import type { GalleryImage } from "@/lib/db";
import { Image as ImageIcon, Maximize2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Prevent scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  return (
    <section id="gallery" className="bg-[var(--bg-subtle)] py-16 sm:py-24 px-5 lg:px-[60px]">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center text-center sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 sm:mb-8">
            <ImageIcon size={12} className="fill-blue-600 text-blue-100" />
            Photo Gallery
          </div>
          <h2
            className="mb-6 text-[32px] font-medium leading-tight tracking-tighter text-[var(--navy)] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Ladakh Through <br className="sm:hidden" /><span className="text-[var(--blue)]" >Our Lens</span>
          </h2>
          <p className="text-[14px] font-normal leading-snug text-slate-500 sm:text-lg sm:leading-relaxed lg:max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            A glimpse of the breathtaking landscapes, vibrant culture, and unforgettable
            moments waiting for you. Every photo tells a story of adventure.
          </p>
        </div>

        {/* Gallery Masonry Grid */}
        <div className="grid grid-cols-2 grid-flow-dense gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8 auto-rows-[160px] md:auto-rows-[220px]">
          {images.map((img, i) => {
            // The image with isHero gets the 2x2 hero slot.
            // Fallback: if no image has isHero, index 0 becomes hero.
            const hasHero = images.some(im => im.isHero);
            const isHeroSlot = img.isHero || (!hasHero && i === 0);
            return (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-slate-100 animate-fade-in-up transition-all duration-500 hover:z-10 hover:shadow-[var(--shadow-2xl)] font-serif",
                  isHeroSlot ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--navy)]/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md ring-1 ring-white/30 transition-all duration-300 group-hover:scale-100 scale-50 shadow-lg">
                    <Maximize2 size={24} />
                  </div>

                  {/* Image Alt Caption */}
                  <div className="absolute bottom-8 left-8 right-8 translate-y-4 text-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-white leading-tight">
                      {img.alt}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Minimal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 sm:p-24 backdrop-blur-[2px] animate-in fade-in duration-500"
          onClick={() => setSelectedImage(null)}
        >
          {/* Subtle Close Prompt */}
          <div className="absolute top-12 left-10 text-white/40 text-[10px] hidden sm:block font-medium tracking-[0.2em] uppercase">
            Click anywhere to close
          </div>

          {/* Close Button - Final Polish */}
          <button
            className="absolute top-12 right-10 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md shadow-2xl transition-all hover:scale-110 hover:rotate-90 sm:top-20 sm:right-20"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          {/* Image Container with Responsive Gaps */}
          <div
            className="group relative flex items-center justify-center max-h-[80vh] sm:max-h-[50vh] max-w-[95vw] sm:max-w-[85vw] transition-all animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The Image Itself */}
            <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="h-auto max-h-[80vh] sm:max-h-[50vh] w-auto max-w-full object-contain"
              />

              {/* Minimalist Floating Caption */}
              <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 text-center px-6 sm:px-10">
                <h3 className="text-lg font-bold tracking-widest text-white font-serif sm:text-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                  {selectedImage.alt}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
