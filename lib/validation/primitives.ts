import * as yup from "yup";

// Comprehensive regex to block common XSS and SQL injection patterns
export const securityRegex = /^[^<>;]*$/;
export const sqlKeywordsRegex = /\b(DROP|DELETE|TRUNCATE|SELECT|INSERT|UPDATE|UNION|ALTER|CREATE|DATABASE|TABLE)\b/i;
export const sqlCommentsRegex = /--/;
export const noHtmlError = "Invalid input, Try again";

const isSafe = (val: string | undefined) => {
    if (!val) return true;
    return securityRegex.test(val) && !sqlKeywordsRegex.test(val) && !sqlCommentsRegex.test(val);
};

export const safeText = (min?: number, max?: number, msg?: string) => {
    let schema = yup.string().trim().required(msg || "This field is required");
    if (min !== undefined) {
        schema = schema.min(min, msg || `Must be at least ${min} characters`);
    }
    if (max !== undefined) schema = schema.max(max);
    return schema.test("is-safe", noHtmlError, val => isSafe(val));
};

export const safeOptionalText = (max?: number) => {
    let schema = yup.string().trim();
    if (max !== undefined) schema = schema.max(max);
    return schema.ensure().test("is-safe", noHtmlError, val => isSafe(val));
};

export const nameText = yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50)
    .matches(/^[a-zA-Z\s]*$/, noHtmlError);

export const phoneText = yup.string()
    .trim()
    .required("Phone number is required")
    .test("is-valid-phone", "Please enter a valid phone number", (val) => {
        if (!val) return false;
        // Allow E.164 format (+countrycode + digits) or plain local numbers
        // Must have at least 7 digits, at most 20 characters
        const digits = val.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15 && /^[+\d][\d\s\-().+]*$/.test(val);
    });

export const imageUrl = yup.string()
    .trim()
    .required("Image is required")
    .test(
        "is-url-or-path",
        "Must be a valid URL or a local image path (e.g. /uploads/...)",
        (val) => {
            if (!val) return false;
            try {
                new URL(val); // valid absolute URL
                return true;
            } catch {
                return val.startsWith("/"); // local relative path like /uploads/...
            }
        }
    );

export const optionalImageUrl = yup.string().trim().test(
    "is-url-or-path-optional",
    "Must be a valid URL or a local image path (e.g. /uploads/...)",
    (val) => {
        if (!val) return true;
        try {
            new URL(val);
            return true;
        } catch {
            return val.startsWith("/");
        }
    }
);
