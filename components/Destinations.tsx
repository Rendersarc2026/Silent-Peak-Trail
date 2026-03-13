"use client";
import type { Destination } from "@/lib/db";
import { Mountain } from "lucide-react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import CarouselArrow from "./ui/CarouselArrow";

export default function Destinations({ destinations }: { destinations: Destination[] }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  if (!destinations || destinations.length === 0) return null;

  return (
    <section className="bg-[var(--white)] py-16 sm:py-24" id="destinations">
      <div className="container mx-auto px-5 lg:px-[60px]">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--blue)] sm:mb-8">
              <div className="h-[2px] w-8 bg-[var(--blue)]" />
              Where We Go
            </div>
            <h2
              className="text-[32px] font-medium leading-[1.1] tracking-tight text-[var(--navy)] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Iconic <span className="text-[var(--blue)]" >Destinations</span> <br className="hidden sm:block" /> of Ladakh
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end sm:gap-8">
            <p className="text-[14px] font-normal leading-snug text-slate-500 sm:text-lg sm:leading-relaxed lg:text-right lg:max-w-xs lg:mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              From sky-mirroring lakes to towering sand dunes, each corner of Ladakh tells a different story.
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="group relative px-[2px] lg:px-16">
          {/* Custom Navigation Arrows */}
          <CarouselArrow
            direction="left"
            onClick={() => swiper?.slidePrev()}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 hidden sm:flex"
          />

          <CarouselArrow
            direction="right"
            onClick={() => swiper?.slideNext()}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 hidden sm:flex"
          />

          <div className="overflow-visible !py-4">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              onSwiper={setSwiper}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 32
                },
              }}
              className="overflow-visible"
            >
              {destinations.map((d, i) => (
                <SwiperSlide key={`${d.id}-${i}`} className="h-auto">
                  <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--bg-subtle)] shadow-[var(--shadow-lg)] ring-1 ring-slate-100 group aspect-[16/10] w-full">
                    {/* Background with Zoom Effect */}
                    <img
                      src={d.img}
                      alt={d.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/90 via-[var(--navy)]/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

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
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
