import { z } from "zod";
import { safeText, safeOptionalText, optionalImageUrl } from "./primitives";

// Schema for individual features within the Why Us section
const featureSchema = z.object({
    icon: z.string(),
    title: safeText(2, 100),
    desc: safeText(2, 300),
    color: z.string().optional(),
    bg: z.string().optional()
});

export const homepageContentSchema = z.object({
    heroTitle: safeText(2, 80, "Required"),
    heroSubtitle: safeText(2, 300, "Required"),
    heroBadge: safeOptionalText(50),
    heroBgImage: optionalImageUrl,
    statsAltitude: safeOptionalText(50),
    statsPackages: safeOptionalText(50),
    statsTravellers: safeOptionalText(50),
    statsExperience: safeOptionalText(50),
    statsSatisfaction: safeOptionalText(50),
    // Why Us Section
    whyUsTitle: safeText(2, 100, "Required"),
    whyUsSubtitle: safeText(2, 500, "Required"),
    whyUsImage: optionalImageUrl,
    whyUsStatsValue: safeOptionalText(20),
    whyUsStatsLabel: safeOptionalText(50),
    whyUsFeatures: z.string().optional().default("[]").superRefine((val, ctx) => {
        try {
            const parsed = JSON.parse(val);
            if (!Array.isArray(parsed)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid format" });
                return;
            }
            parsed.forEach((item, i) => {
                const res = featureSchema.safeParse(item);
                if (!res.success) {
                    res.error.issues.forEach(issue => {
                        ctx.addIssue({
                            ...issue,
                            path: [i, ...issue.path]
                        });
                    });
                }
            });
        } catch {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON" });
        }
    }),
    // Stargazing overrides
    stargazingTitle: safeText(2, 100, "Required"),
    stargazingTagline: safeText(2, 500, "Required"),
});
