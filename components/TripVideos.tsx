"use client";
import { Film } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import CarouselArrow from "./ui/CarouselArrow";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";

interface PackageData {
    id: string;
    name: string;
    videos: string[];
}

export default function TripVideos({ packages }: { packages: PackageData[] }) {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    // Extract all videos into a flat array, attach package name for context
    const allVideos = packages.flatMap((pkg) =>
        pkg.videos?.map((url) => ({ url, pkgName: pkg.name })) || []
    ).slice(0, 6);

    if (allVideos.length === 0) return null;

    return (
        <section id="videos" className="bg-[var(--off-white)] py-16 sm:py-24 px-5 lg:px-[60px]">
            <div className="container mx-auto">
                {/* Header Section */}
                <div className="mb-10 flex flex-col items-center text-center sm:mb-20">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-700 sm:mb-8">
                        <Film size={12} className="fill-amber-600 text-amber-100" />
                        Video Gallery
                    </div>
                    <h2 
                        className="mb-6 text-[32px] font-medium leading-tight tracking-tighter text-[var(--navy)] sm:text-5xl lg:text-6xl"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Ladakh In <span className="text-[var(--blue)] italic" style={{ fontFamily: "'Playfair Display', serif" }}>Motion</span>
                    </h2>
                    <p className="text-[14px] font-normal leading-snug text-slate-500 sm:text-lg sm:leading-relaxed lg:max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        A glimpse of the breathtaking landscapes, vibrant culture, and unforgettable
                        moments waiting for you. Every photo tells a story of adventure.
                    </p>
                </div>

                {/* Video Slider */}
                <div className="group relative px-2 sm:px-[60px]">
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

                    <div className="overflow-visible !py-4">
                        <Swiper
                            modules={[Autoplay, Navigation]}
                            spaceBetween={24}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            onSwiper={setSwiper}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            className="overflow-visible"
                        >
                            {allVideos.map((video, idx) => (
                                <SwiperSlide key={idx} className="h-auto">
                                    <div className="relative aspect-video w-full rounded-[2rem] bg-black shadow-lg ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden group">
                                        <video
                                            src={video.url}
                                            controls
                                            preload="metadata"
                                            className="h-full w-full object-cover"
                                        />
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
