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

export function sanitizeInput(input: string): string {
    if (!input) return "";
    // Remove all HTML tags using a robust regex
    // This avoids the heavy jsdom dependency that crashes on Vercel
    return input
        .replace(/<[^>]*>?/gm, '')
        .trim();
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
    return Object.keys(fieldErrors).some(key =>
        key === fieldName ||
        key.startsWith(`${fieldName}.`) ||
        key.startsWith(`${fieldName}[`)
    );
}

/**
 * Gets the first error message for a field or any of its nested children.
 */
export function getErrorMessage(fieldErrors: Record<string, string[]> | undefined, fieldName: string): string | undefined {
    if (!fieldErrors) return undefined;
    const key = Object.keys(fieldErrors).find(key =>
        key === fieldName ||
        key.startsWith(`${fieldName}.`) ||
        key.startsWith(`${fieldName}[`)
    );
    return key ? fieldErrors[key][0] : undefined;
}

import { ValidationError, Schema } from "yup";

export async function validateWithYup(schema: Schema, data: any) {
    try {
        const validatedData = await schema.validate(data, { abortEarly: false, stripUnknown: true });
        return { success: true, data: validatedData, error: null };
    } catch (err) {
        if (err instanceof ValidationError) {
            const fieldErrors: Record<string, string[]> = {};
            err.inner.forEach((error) => {
                if (error.path) {
                    if (!fieldErrors[error.path]) {
                        fieldErrors[error.path] = [];
                    }
                    fieldErrors[error.path].push(error.message);
                }
            });
            return { success: false, data: null, error: { fieldErrors } };
        }
        throw err;
    }
}

export function validateWithYupSync(schema: Schema, data: any) {
    try {
        const validatedData = schema.validateSync(data, { abortEarly: false, stripUnknown: true });
        return { success: true, data: validatedData, error: null };
    } catch (err) {
        if (err instanceof ValidationError) {
            const fieldErrors: Record<string, string[]> = {};
            err.inner.forEach((error) => {
                if (error.path) {
                    if (!fieldErrors[error.path]) {
                        fieldErrors[error.path] = [];
                    }
                    fieldErrors[error.path].push(error.message);
                }
            });
            return { success: false, data: null, error: { fieldErrors } };
        }
        throw err;
    }
}

export function makePartial(schema: any) {
    const fields = { ...schema.fields };
    for (const key in fields) {
        fields[key] = fields[key].notRequired();
    }
    return schema.clone().shape(fields);
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
