import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Package from '@/lib/models/Package';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://silentpeaktrail.com';

    await dbConnect();
    const packages = await Package.find({ isActive: true })
        .select('_id updatedAt')
        .lean();

    const packageUrls = packages.map((pkg) => ({
        url: `${baseUrl}/packages/${pkg._id}`,
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
