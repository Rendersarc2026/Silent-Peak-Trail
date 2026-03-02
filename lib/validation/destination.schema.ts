import { z } from "zod";
import { safeText, imageUrl } from "./primitives";

export const destinationSchema = z.object({
    name: safeText(2, 100),
    type: safeText(2, 50),
    altitude: safeText(2, 50),
    img: imageUrl,
    big: z.boolean().optional().default(false),
});
