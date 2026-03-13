"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import CarouselArrow from "./ui/CarouselArrow";
import { cn } from "@/lib/utils";

interface PackageGalleryProps {
    items: string[];
    type: "photo" | "video";
    title: string;
}

export default function PackageGallery({ items, type, title }: PackageGalleryProps) {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);

    if (!items || items.length === 0) return null;

    return (
        <section className="mt-8 bg-white rounded-3xl p-4 sm:p-8 ring-1 ring-slate-100 shadow-sm overflow-hidden">
            <h2 className="text-lg font-bold tracking-widest text-[var(--navy)] uppercase mb-6 drop-shadow-sm px-2">
                {title}
            </h2>

            <div className="group relative px-2 sm:px-4">
                <CarouselArrow
                    direction="left"
                    onClick={() => swiper?.slidePrev()}
                    className="absolute left-0 top-1/2 z-20 -translate-y-1/2 hidden sm:flex"
                />

                <CarouselArrow
                    direction="right"
                    onClick={() => swiper?.slideNext()}
                    className="absolute right-0 top-1/2 z-20 -translate-y-1/2 hidden sm:flex"
                />

                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={12}
                    slidesPerView={1}
                    loop={false}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 16 },
                        1024: { slidesPerView: 2, spaceBetween: 16 },
                    }}
                    onSwiper={setSwiper}
                    className="overflow-visible"
                    touchEventsTarget="container"
                >
                    {items.map((item, i) => (
                        <SwiperSlide key={i}>
                            <div
                                className={cn(
                                    "relative overflow-hidden rounded-2xl bg-black",
                                    "aspect-video"
                                )}
                            >
                                {type === "photo" ? (
                                    <img
                                        src={item}
                                        alt={`${title} item ${i + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <video
                                        src={item}
                                        controls
                                        playsInline
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
