import { z } from "zod";
import { safeOptionalText } from "./primitives";

export const agencyProfileSchema = z.object({
    phone: safeOptionalText(50),
    email: z.string().email().optional().or(z.literal('')),
    address: safeOptionalText(200),
    season: safeOptionalText(100),
});
