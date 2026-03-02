import { z } from "zod";
import { safeText, safeOptionalText } from "./primitives";

export const sendEmailSchema = z.object({
    to: z.string().email("Invalid email address"),
    subject: safeText(2, 200),
    message: safeText(5, 5000),
});
