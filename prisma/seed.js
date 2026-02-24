const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'ladakh2025';

    if (!process.env.ADMIN_PASSWORD) {
        console.warn('WARNING: Using default password for admin user. Set ADMIN_PASSWORD in .env for security.');
    }

    const hashedPassword = await bcrypt.hash(adminPass, 10);
    const admin = await prisma.admin.upsert({
        where: { username: adminUser },
        update: {},
        create: {
            username: adminUser,
            password: hashedPassword,
        },
    });
    console.log('Admin user created/verified:', admin.username);

    // 2. Migrate enquiries from db.json
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    if (fs.existsSync(dbPath)) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const enquiries = db.enquiries || [];

        const packages = await prisma.package.findMany();
        const packageMap = new Map(packages.map(p => [p.name.trim().toLowerCase(), p.id]));
        const fallbackPkg = packages.find(p => p.name === 'Custom / Other') || { id: 6 };

        console.log(`Found ${enquiries.length} enquiries to migrate.`);

        for (const enq of enquiries) {
            const pkgId = packageMap.get(enq.package?.trim().toLowerCase()) || fallbackPkg.id;
            await prisma.enquiry.create({
                data: {
                    firstName: enq.firstName,
                    lastName: enq.lastName,
                    email: enq.email,
                    phone: enq.phone,
                    packageId: pkgId,
                    travellers: String(enq.travellers),
                    month: enq.month || 'N/A',
                    budget: enq.budget || 'N/A',
                    message: enq.message || '',
                    status: enq.status || 'new',
                    createdAt: new Date(enq.createdAt),
                }
            });
        }

        const settings = db.settings || {};
        const settingKeys = Object.keys(settings);
        if (settingKeys.length > 0) {
            console.log(`Migrating ${settingKeys.length} settings to Homepage...`);
            for (const key of settingKeys) {
                await prisma.homepage.upsert({
                    where: { key: key },
                    update: {},
                    create: {
                        key: key,
                        value: String(settings[key]),
                    }
                });
            }
        }

        console.log('Migration complete.');
    } else {
        console.log('db.json not found, skipping enquiry migration.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
