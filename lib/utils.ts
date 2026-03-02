export function smoothScroll(e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>, href: string) {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
        el.scrollIntoView({ behavior: "smooth" });
    }
}

export function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

import DOMPurify from "isomorphic-dompurify";

export function sanitizeInput(input: string): string {
    if (!input) return "";
    // Strict mode: strip ALL HTML tags and attributes
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
}

export function sanitize(str: string): string {
    return sanitizeInput(str);
}

export function isValidText(str: string): boolean {
    return true; // We are now relying strictly on Zod validation
}

/**
 * Checks if a field or any of its nested children has an error in the fieldErrors object.
 * Useful for catching nested Zod errors like 'itinerary.0.day' when checking for 'itinerary'.
 */
export function hasError(fieldErrors: Record<string, string[]> | undefined, fieldName: string): boolean {
    if (!fieldErrors) return false;
    return Object.keys(fieldErrors).some(key => key === fieldName || key.startsWith(`${fieldName}.`));
}

/**
 * Gets the first error message for a field or any of its nested children.
 */
export function getErrorMessage(fieldErrors: Record<string, string[]> | undefined, fieldName: string): string | undefined {
    if (!fieldErrors) return undefined;
    const key = Object.keys(fieldErrors).find(key => key === fieldName || key.startsWith(`${fieldName}.`));
    return key ? fieldErrors[key][0] : undefined;
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")     // Replace spaces with -
        .replace(/[^\w-]+/g, "")    // Remove all non-word chars
        .replace(/--+/g, "-")       // Replace multiple - with single -
        .replace(/^-+/, "")         // Trim - from start of text
        .replace(/-+$/, "");        // Trim - from end of text
}
