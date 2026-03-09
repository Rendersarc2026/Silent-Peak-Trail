import * as yup from "yup";
import { isValidPhoneNumber } from 'libphonenumber-js';


// Comprehensive regex to block common XSS and SQL injection patterns
export const securityRegex = /^[^<>;]*$/;
export const sqlKeywordsRegex = /\b(DROP|DELETE|TRUNCATE|SELECT|INSERT|UPDATE|UNION|ALTER|CREATE|DATABASE|TABLE)\b/i;
export const sqlCommentsRegex = /--/;
export const noHtmlError = "Invalid input, Try again";

export const isSafe = (val: string | undefined) => {

    if (!val) return true;

    const alphanumeric = val.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (alphanumeric.length > 7) {
        const uniqueChars = new Set(alphanumeric.split(""));
        if (uniqueChars.size < 3) return false;
    }

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
    .min(3, "Name must be at least 3 characters")
    .max(50)
    .test("is-safe", noHtmlError, val => isSafe(val))
    .matches(/^[a-zA-Z\s]*$/, noHtmlError);

export const emailText = yup.string()
    .trim()
    .required("Email is required")
    .min(6, "Email is too short")
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid email format")
    .test("is-safe", "Invalid email patterns detected", val => isSafe(val));

export const phoneText = yup.string()
    .trim()
    .required("Phone number is required")
    .test("no-repeated-digits", "Invalid phone number pattern", (val) => {
        if (!val) return true;
        return !/(.)\1{9,}/.test(val);
    })
    .test("is-valid-phone", "Please enter a valid phone number", (val) => {
        if (!val) return false;

        // This checks if the number is mathematically valid globally
        // (It requires the user to input the '+' country code for international numbers)
        return isValidPhoneNumber(val);
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
