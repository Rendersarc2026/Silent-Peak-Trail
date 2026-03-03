import * as yup from "yup";
import { safeText, safeOptionalText, optionalImageUrl } from "./primitives";

// Schema for individual features within the Why Us section
const featureSchema = yup.object({
    icon: yup.string().required(),
    title: safeText(2, 100),
    desc: safeText(2, 300),
    color: yup.string().optional(),
    bg: yup.string().optional()
});

export const homepageContentSchema = yup.object({
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
    whyUsFeatures: yup.string().default("[]").test("is-json-array", "Invalid format", (val) => {
        if (!val) return true;
        try {
            const parsed = JSON.parse(val);
            if (!Array.isArray(parsed)) return false;
            // Quick check for item validity
            for (const item of parsed) {
                if (!featureSchema.isValidSync(item)) return false;
            }
            return true;
        } catch {
            return false;
        }
    }),
    // Stargazing overrides
    stargazingTitle: safeText(2, 100, "Required"),
    stargazingTagline: safeText(2, 500, "Required"),
});
