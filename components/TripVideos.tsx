"use client";
import { Film } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import CarouselArrow from "./ui/CarouselArrow";
import { useState, useRef, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";

interface PackageData {
    id: string;
    name: string;
    videos: string[];
}

export default function TripVideos({ packages }: { packages: PackageData[] }) {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

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
                        Ladakh In <span className="text-[var(--blue)]">Motion</span>
                    </h2>
                    <p className="text-[14px] font-normal leading-snug text-slate-500 sm:text-lg sm:leading-relaxed lg:max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        A glimpse of the breathtaking landscapes, vibrant culture, and unforgettable
                        moments waiting for you. Every video tells a story of adventure.
                    </p>
                </div>

                {/* Video Slider */}
                <div className="group relative px-4 sm:px-[60px]">
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

                    <div className="overflow-hidden !py-4">
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={16}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            onSwiper={setSwiper}
                            onSlideChange={() => {
                                // Pause any playing video when slide changes
                                setActiveVideo(null);
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 24 },
                                1024: { slidesPerView: 3, spaceBetween: 24 },
                            }}
                            className="bg-transparent"
                        >
                            {allVideos.map((video, idx) => (
                                <SwiperSlide key={idx} className="h-auto">
                                    <VideoSlide 
                                        url={video.url} 
                                        isPlayingGlobal={activeVideo === video.url}
                                        onPlay={() => {
                                            setActiveVideo(video.url);
                                            swiper?.autoplay.stop();
                                        }}
                                        onPause={() => {
                                            if (activeVideo === video.url) setActiveVideo(null);
                                            swiper?.autoplay.start();
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
}

function VideoSlide({ url, isPlayingGlobal, onPlay, onPause }: { url: string, isPlayingGlobal: boolean, onPlay: () => void, onPause: () => void }) {
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync local playing state with global state
    useEffect(() => {
        if (!isPlayingGlobal && playing && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isPlayingGlobal, playing]);

    // Intersection Observer to stop playing when scrolled past or swiped away
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting && playing && videoRef.current) {
                    videoRef.current.pause();
                }
            },
            { threshold: 0.1 }
        );

        if (videoRef.current) observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, [playing]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        
        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    };

    return (
        <div 
            className="relative aspect-video w-full rounded-[2rem] bg-black shadow-lg ring-1 ring-slate-200 transition-all duration-300 sm:hover:-translate-y-2 sm:hover:shadow-2xl overflow-hidden group"
        >
            <video
                ref={videoRef}
                src={url}
                controls={playing}
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
                onPlay={() => {
                    setPlaying(true);
                    onPlay();
                }}
                onPause={() => {
                    setPlaying(false);
                    onPause();
                }}
                onEnded={() => {
                    setPlaying(false);
                    onPause();
                }}
            />

            {!playing && (
                <div 
                    onClick={togglePlay}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 transition-opacity duration-300 group-hover:bg-black/40 cursor-pointer"
                    aria-hidden="true"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[var(--blue)] shadow-2xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <div className="ml-1 border-t-[10px] border-t-transparent border-l-[18px] border-l-current border-b-[10px] border-b-transparent" />
                    </div>
                </div>
            )}
        </div>
    );
}
