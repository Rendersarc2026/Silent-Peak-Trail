import { z } from "zod";

// Comprehensive regex to block common XSS and SQL injection patterns
export const securityRegex = /^[^<>;]*$/;
export const sqlKeywordsRegex = /\b(DROP|DELETE|TRUNCATE|SELECT|INSERT|UPDATE|UNION|ALTER|CREATE|DATABASE|TABLE)\b/i;
export const sqlCommentsRegex = /--/;
export const noHtmlError = "Invalid input, Try again";

const isSafe = (val: string) => {
    return securityRegex.test(val) && !sqlKeywordsRegex.test(val) && !sqlCommentsRegex.test(val);
};

export const safeText = (min?: number, max?: number, msg?: string) => {
    let schema = z.string();
    if (min !== undefined)
        schema = schema.min(min, msg || `Must be at least ${min} characters`);
    if (max !== undefined) schema = schema.max(max);
    return schema.refine(val => isSafe(val), { message: noHtmlError });
};

export const safeOptionalText = (max?: number) => {
    let schema = z.string();
    if (max !== undefined) schema = schema.max(max);
    return schema.optional().default("").refine(val => isSafe(val || ""), { message: noHtmlError });
};


export const nameText = z.string().min(2, "Name must be at least 2 characters").max(50).regex(/^[a-zA-Z\s]*$/, noHtmlError);


export const imageUrl = z.string().refine(
    (val) => {
        try {
            new URL(val); // valid absolute URL
            return true;
        } catch {
            return val.startsWith("/"); // local relative path like /uploads/...
        }
    },
    { message: "Must be a valid URL or a local image path (e.g. /uploads/...)" }
);


export const optionalImageUrl = imageUrl.optional().or(z.literal(''));
