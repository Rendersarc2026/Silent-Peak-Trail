import { z } from "zod";
import { safeText, imageUrl } from "./primitives";

export const gallerySchema = z.object({
    src: imageUrl,
    alt: safeText(2, 100),
    wide: z.boolean().optional().default(false),
    tall: z.boolean().optional().default(false),
});
