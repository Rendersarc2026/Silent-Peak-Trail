import { z } from "zod";
import { nameText, safeText, safeOptionalText, noHtmlError } from "./primitives";

export const enquirySchema = z.object({
    firstName: nameText,
    lastName: z.string().min(1).max(50).regex(/^[a-zA-Z\s]*$/, noHtmlError),
    email: z.string().email("Invalid email address"),
    phone: safeText(7, 15),
    packageId: z.number().int().positive("Please select a package"),
    travellers: safeText(1),
    month: safeText(1, 1, "Please select a month"),
    budget: safeText(1, 1, "Please select a budget"),
    message: safeOptionalText(1000),
});
