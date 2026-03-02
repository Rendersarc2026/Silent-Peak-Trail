import { z } from "zod";
import { nameText, safeText } from "./primitives";

export const reviewSchema = z.object({
    name: nameText,
    place: safeText(2, 100, "Place is required"),
    packageId: z.number().int().min(1, "Required"),
    rating: z.number().int().min(1).max(5).default(5),
    message: safeText(10, 1000),
});
