import { z } from "zod";

// Accepts both external https:// URLs and local /uploads/ paths
const imageUrlSchema = z.string().refine(
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

export const enquirySchema = z.object({
    firstName: z.string().min(2).max(50).regex(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
    lastName: z.string().min(1).max(50).regex(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
    email: z.string().email(),
    phone: z.string().min(7).max(15),
    packageId: z.number().int().positive("Please select a package"),
    travellers: z.string().min(1, "Please select number of travellers"),
    month: z.string().min(2, "Please select a travel month"),
    budget: z.string().min(2, "Please select a budget range"),
    message: z.string().max(1000).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
});

export const reviewSchema = z.object({
    name: z.string().min(2).max(50).regex(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
    place: z.string().min(2).max(50).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    packageId: z.number().int().positive("Please select a package"),
    rating: z.number().int().min(1).max(5).default(5),
    message: z.string().min(5).max(1000).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
});

export const packageSchema = z.object({
    name: z.string().min(2).max(100).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    tagline: z.string().min(2).max(200).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    duration: z.string().min(2).max(50).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    price: z.number().nonnegative(),
    badge: z.string().max(30).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    badgeGold: z.boolean().optional().default(false),
    featured: z.boolean().optional().default(false),
    img: imageUrlSchema,
    features: z.array(z.string().max(100)).optional().default([]),
    itinerary: z.array(z.object({
        day: z.string(),
        title: z.string(),
        activities: z.string().optional()
    })).optional().default([]),
    inclusions: z.array(z.string()).optional().default([]),
    exclusions: z.array(z.string()).optional().default([]),
});

export const destinationSchema = z.object({
    name: z.string().min(2).max(100).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    type: z.string().min(2).max(50).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    altitude: z.string().min(2).max(50).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    img: imageUrlSchema,
    big: z.boolean().optional().default(false),
});

export const gallerySchema = z.object({
    src: imageUrlSchema,
    alt: z.string().min(2).max(100).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    wide: z.boolean().optional().default(false),
    tall: z.boolean().optional().default(false),
});

export const homepageContentSchema = z.object({
    heroTitle: z.string().max(80).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    heroSubtitle: z.string().max(300).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    heroBadge: z.string().max(50).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    heroBgImage: imageUrlSchema.optional().or(z.literal('')),
    statsAltitude: z.string().max(50).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    statsPackages: z.string().max(50).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    statsTravellers: z.string().max(50).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    statsExperience: z.string().max(50).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    statsSatisfaction: z.string().max(50).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    // Why Us Section
    whyUsTitle: z.string().max(100).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    whyUsSubtitle: z.string().max(500).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    whyUsImage: imageUrlSchema.optional().or(z.literal('')),
    whyUsStatsValue: z.string().max(20).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    whyUsStatsLabel: z.string().max(50).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    whyUsFeatures: z.string().optional().default(""), // JSON string
    // Stargazing overrides
    stargazingTitle: z.string().max(100).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    stargazingTagline: z.string().max(500).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
});

export const agencyProfileSchema = z.object({
    phone: z.string().max(50).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().max(200).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
    season: z.string().max(100).optional().default("").refine(val => !/[<>{}]/.test(val), { message: "HTML tags or brackets are not allowed" }),
});

export const lehTipSchema = z.object({
    icon: z.string().min(1).max(50).regex(/^[a-zA-Z0-9]+$/, "Icon must be a valid Lucide icon name"),
    title: z.string().min(2).max(100).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    desc: z.string().min(5).max(500).regex(/^[^<>{}]*$/, "HTML tags or brackets are not allowed"),
    color: z.string().min(2).max(100),
    border: z.string().min(2).max(100),
    order: z.number().int().min(0).optional().default(0),
});
