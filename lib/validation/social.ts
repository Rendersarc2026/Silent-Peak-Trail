
export type SocialPlatform = 'WhatsApp' | 'Instagram' | 'Facebook' | 'Twitter' | 'YouTube' | 'LinkedIn' | 'Custom';

const ALLOWED_DOMAINS: Record<string, string[]> = {
    Whatsapp: ['wa.me', 'api.whatsapp.com'],
    Instagram: ['instagram.com'],
    Facebook: ['facebook.com'],
    Twitter: ['twitter.com', 'x.com'],
    Youtube: ['youtube.com', 'youtu.be'],
    LinkedIn: ['linkedin.com']
};

/**
 * Validates a social media link based on requirements.
 * @param platform The social media platform selected
 * @param url The URL string to validate
 * @returns { isValid: boolean, error?: string }
 */
export function validateSocialLink(platform: SocialPlatform, url: string): { isValid: boolean, error?: string } {
    // Basic sanity and length check (Req: 255 chars)
    if (!url || typeof url !== 'string') {
        return { isValid: false, error: "Please enter a valid URL" };
    }

    if (url.length > 255) {
        return { isValid: false, error: "URL is too long (max 255 characters)" };
    }

    // Reject dangerous protocols (Req: javascript:, data:, vbscript:)
    const blockedProtocols = ['javascript:', 'data:', 'vbscript:'];
    const lowerUrl = url.toLowerCase();
    if (blockedProtocols.some(p => lowerUrl.startsWith(p))) {
        return { isValid: false, error: "Dangerous protocol detected" };
    }

    // Only allow https:// links (Req: Only allow https://)
    if (!url.startsWith('https://')) {
        return { isValid: false, error: "Only secure (https://) links are allowed" };
    }

    try {
        // Proper URL validation (Req: Proper URL input)
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.toLowerCase();

        // Domain matching (Req: Platform-specific domains)
        if (platform === 'Custom') return { isValid: true };

        const allowed = ALLOWED_DOMAINS[platform];
        if (!allowed) return { isValid: false, error: "Invalid platform" };

        // Check if hostname matches or is a subdomain of allowed domains
        const isValidDomain = allowed.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );

        if (!isValidDomain) {
            return { isValid: false, error: `Link must be from ${allowed.join(' or ')}` };
        }

        return { isValid: true };
    } catch (e) {
        // Invalid URL format
        return { isValid: false, error: "Invalid URL format" };
    }
}

/**
 * Example Usage:
 * 
 * import { validateSocialLink } from '@/lib/validation/social';
 * 
 * const url1 = "https://instagram.com/ladakhtravel";
 * console.log(validateSocialLink('Instagram', url1)); // true
 * 
 * const url2 = "https://facebook.com/profile.php?id=123";
 * console.log(validateSocialLink('Facebook', url2)); // true
 * 
 * const url3 = "http://twitter.com/myaccount";
 * console.log(validateSocialLink('Twitter', url3)); // false (not https)
 * 
 * const url4 = "https://malicious.com/facebook.com";
 * console.log(validateSocialLink('Facebook', url4)); // false (incorrect domain)
 * 
 * const url5 = "javascript:alert('xss')";
 * console.log(validateSocialLink('WhatsApp', url5)); // false (dangerous protocol)
 */
