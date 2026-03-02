import { z } from "zod";
import { safeText, safeOptionalText, imageUrl } from "./primitives";


export const packageSchema = z.object({
    name: safeText(2, 100),
    tagline: safeText(2, 200),
    duration: safeText(2, 50, "Duration is required"),
    price: z.number().nonnegative(),
    badge: safeOptionalText(30),
    badgeGold: z.boolean().optional().default(false),
    featured: z.boolean().optional().default(false),
    img: imageUrl,
    features: z.array(safeText(undefined, 100)).default([]),
    itinerary: z.array(z.object({
        day: safeText(),
        title: safeText(),
        activities: safeOptionalText()
    })).min(1, "Itinerary is required").default([]),
    inclusions: z.array(safeText()).optional().default([]),
    exclusions: z.array(safeText()).optional().default([]),
});

const dayPattern = /^Day\s+\d+$/i;

export function parseItinerary(text: string) {
    if (!text || typeof text !== "string") {
        throw new Error("Itinerary is required");
    }

    const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

    if (lines.length === 0) {
        throw new Error("Itinerary is required");
    }

    return lines.map((line, index) => {
        const parts = line.split("|").map(p => p.trim());

        if (parts.length < 2) {
            throw new Error(
                `Line ${index + 1}: Use format Day X | Title | Activities (optional)`
            );
        }

        if (!dayPattern.test(parts[0])) {
            throw new Error(
                `Line ${index + 1}: Day must be in format Day X`
            );
        }

        return {
            day: parts[0],
            title: parts[1],
            activities: parts.slice(2).join(" | "),
        };
    });
}
