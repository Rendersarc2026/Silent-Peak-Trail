import { z } from "zod";
import { safeText } from "./primitives";

export const lehTipSchema = z.object({
    icon: z.string().min(1).max(50).regex(/^[a-zA-Z0-9]+$/, "Icon must be a valid icon name"),
    title: safeText(4, 100),
    desc: safeText(5, 5000),
    color: z.string().min(2).max(100),
    border: z.string().min(2).max(100),
    order: z.number().int().min(0).optional().default(0),
});
