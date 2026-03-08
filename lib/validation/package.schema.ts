import * as yup from "yup";
import { safeText, safeOptionalText, imageUrl } from "./primitives";

export const packageSchema = yup.object({
    name: safeText(2, 100),
    tagline: safeText(2, 200),
    duration: safeText(2, 50, "Duration is required"),
    price: yup.number().min(0).required("Price is required"),
    badge: safeOptionalText(30),
    badgeGold: yup.boolean().default(false),
    featured: yup.boolean().default(false),
    img: imageUrl,
    features: yup.array().of(safeText(2, 100)).min(1, "At least one feature is required").default([]),
    itinerary: yup.array().of(yup.object({
        day: safeText(2, 50),
        title: safeText(2, 200),
        activities: safeOptionalText(2000)
    })).min(1, "Itinerary is required").default([]),
    inclusions: yup.array().of(safeText(2, 200)).default([]),
    exclusions: yup.array().of(safeText(2, 200)).default([]),
});

