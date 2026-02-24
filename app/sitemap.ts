import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://silentpeaktrail.com';

    const packages = await prisma.package.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
    });

    const packageUrls = packages.map((pkg) => ({
        url: `${baseUrl}/packages/${pkg.id}`,
        lastModified: pkg.updatedAt,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...packageUrls,
    ];
}
