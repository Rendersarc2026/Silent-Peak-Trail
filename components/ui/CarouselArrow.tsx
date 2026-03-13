"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselArrowProps {
    direction: "left" | "right";
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export default function CarouselArrow({
    direction,
    onClick,
    className,
    disabled
}: CarouselArrowProps) {
    const Icon = direction === "left" ? ChevronLeft : ChevronRight;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "carousel-arrow",
                "opacity-0 group-hover:opacity-100", // Ghost effect
                "flex items-center justify-center transition-all duration-500",
                "text-[var(--navy)] hover:text-[var(--blue)] hover:scale-125 active:scale-90",
                disabled && "opacity-0 pointer-events-none",
                className
            )}
            aria-label={direction === "left" ? "Previous slide" : "Next slide"}
        >
            <Icon size={40} strokeWidth={2} />
        </button>
    );
}
