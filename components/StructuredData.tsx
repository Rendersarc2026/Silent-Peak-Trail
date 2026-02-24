import React from 'react';

interface StructuredDataProps {
    type: 'TravelAgency' | 'TouristTrip';
    data: Record<string, string>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
    let schema: Record<string, unknown> = {};

    if (type === 'TravelAgency') {
        schema = {
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            name: 'Silent Peak Trail',
            description: data.description,
            url: 'https://silentpeaktrail.com',
            telephone: data.phone,
            address: {
                '@type': 'PostalAddress',
                streetAddress: data.address,
                addressLocality: 'Leh',
                addressRegion: 'Ladakh',
                postalCode: '194101',
                addressCountry: 'IN',
            },
            image: data.image,
            priceRange: '₹₹₹',
        };
    } else if (type === 'TouristTrip') {
        schema = {
            '@context': 'https://schema.org',
            '@type': 'TouristTrip',
            name: data.name,
            description: data.description,
            image: data.image,
            offers: {
                '@type': 'Offer',
                price: data.price,
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
            },
            provider: {
                '@type': 'TravelAgency',
                name: 'Silent Peak Trail',
                url: 'https://silentpeaktrail.com',
            },
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
