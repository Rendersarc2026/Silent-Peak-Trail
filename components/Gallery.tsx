import type { GalleryImage } from "@/lib/db";
import { Image as ImageIcon, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  return (
    <section id="gallery" className="bg-[var(--bg-subtle)] py-24 px-5 lg:px-[60px]">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--navy)]">
            <ImageIcon size={12} className="text-[var(--blue)]" />
            Photo Gallery
          </div>
          <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[var(--navy)] sm:text-5xl lg:text-6xl font-serif">
            Ladakh Through <span className="text-[var(--blue)] italic font-playfair">Our Lens</span>
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-light)]">
            A glimpse of the breathtaking landscapes, vibrant culture, and unforgettable
            moments waiting for you. Every photo tells a story of adventure.
          </p>
        </div>

        {/* Gallery Masonry Grid */}
        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {images.map((img, i) => (
            <div
              key={img.id}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] bg-slate-100 animate-fade-in-up transition-all duration-500 hover:z-10 hover:shadow-[var(--shadow-2xl)]",
                img.wide ? "col-span-2" : "",
                img.tall ? "row-span-2" : ""
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--navy)]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-100 scale-50">
                  <Maximize2 size={24} />
                </div>

                {/* Image Alt Caption */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 text-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    {img.alt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
