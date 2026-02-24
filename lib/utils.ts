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
    return DOMPurify.sanitize(input, { USE_PROFILES: { html: false } });
}

export function sanitize(str: string): string {
    return sanitizeInput(str);
}

export function isValidText(str: string): boolean {
    return true; // We are now relying strictly on Zod validation
}
