const bcrypt = require('bcrypt');
const prisma = require('./config/database');

async function seed() {
    const password = 'Admin@123';
    const hash = await bcrypt.hash(password, 10);

    console.log('Clearing existing data...');
    await prisma.rating.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Seeding admin accounts...');
    const admins = [
        { name: 'System Administrator One', email: 'admin@system.com', password_hash: hash, role: 'admin', address: 'Main HQ Office' },
        { name: 'System Administrator Two', email: 'admin2@system.com', password_hash: hash, role: 'admin', address: 'Secondary Office' },
        { name: 'System Administrator Main', email: 'admin@ratingplatform.com', password_hash: await bcrypt.hash('Admin@12345', 10), role: 'admin', address: 'System Root HQ' }
    ];

    for (const admin of admins) {
        await prisma.user.create({ data: admin });
    }

    console.log('Seeding normal user accounts...');
    const normalUsers = [
        { name: 'John Anderson Customer Account', email: 'john.anderson@email.com', password_hash: hash, role: 'user', address: '123 Main St, New York' },
        { name: 'Sarah Thompson Customer Account', email: 'sarah.thompson@email.com', password_hash: hash, role: 'user', address: '456 Oak Ave, California' },
        { name: 'Michael Johnson Customer Account', email: 'michael.johnson@email.com', password_hash: hash, role: 'user', address: '789 Pine Rd, Texas' },
        { name: 'Emily Williams Customer Account', email: 'emily.williams@email.com', password_hash: hash, role: 'user', address: '321 Elm St, Chicago' },
        { name: 'David Brown Customer Account', email: 'david.brown@email.com', password_hash: hash, role: 'user', address: '654 Maple Dr, Miami' },
        { name: 'Jennifer Davis Customer Account', email: 'jennifer.davis@email.com', password_hash: hash, role: 'user', address: '987 Cedar Ln, Seattle' },
        { name: 'Robert Martinez Customer Account', email: 'robert.martinez@email.com', password_hash: hash, role: 'user', address: '147 Birch Hwy, Boston' },
        { name: 'Lisa Garcia Customer Account', email: 'lisa.garcia@email.com', password_hash: hash, role: 'user', address: '258 Spruce Pl, Denver' }
    ];

    for (const user of normalUsers) {
        await prisma.user.create({ data: user });
    }

    console.log('Seeding store owners and stores...');
    const storeOwnersAndStores = [
        {
            owner: { name: 'Electronics Store Owner Account', email: 'electronics@store.com', password_hash: hash, role: 'store_owner', address: 'Tech Plaza Building' },
            store: { name: 'Premium Electronics Superstore', email: 'electronics@store.com', address: '101 Silicon Valley Blvd' }
        },
        {
            owner: { name: 'Gourmet Food Market Owner Account', email: 'foodmarket@store.com', password_hash: hash, role: 'store_owner', address: 'Fresh Food Plaza' },
            store: { name: 'Gourmet Food Market Place', email: 'foodmarket@store.com', address: '202 Organic Market Way' }
        },
        {
            owner: { name: 'Fashion Boutique Owner Account', email: 'fashion@store.com', password_hash: hash, role: 'store_owner', address: 'High Street Fashion Center' },
            store: { name: 'Fashion Boutique Collections', email: 'fashion@store.com', address: '303 Vogue Ave' }
        },
        {
            owner: { name: 'Furniture Gallery Owner Account', email: 'furniture@store.com', password_hash: hash, role: 'store_owner', address: 'Home Design District' },
            store: { name: 'Home Furniture Gallery Showroom', email: 'furniture@store.com', address: '404 Comfort Lane' }
        },
        {
            owner: { name: 'Sports Pro Shop Owner Account', email: 'sports@store.com', password_hash: hash, role: 'store_owner', address: 'Athletic Arena Plaza' },
            store: { name: 'Sports Equipment Pro Shop', email: 'sports@store.com', address: '505 Championship Blvd' }
        },
        {
            owner: { name: 'Books And More Owner Account', email: 'bookstore@store.com', password_hash: hash, role: 'store_owner', address: 'Cultural Center Library Row' },
            store: { name: 'Books And More Bookstore', email: 'bookstore@store.com', address: '606 Knowledge street' }
        }
    ];

    for (const pair of storeOwnersAndStores) {
        const owner = await prisma.user.create({ data: pair.owner });
        await prisma.store.create({
            data: {
                ...pair.store,
                owner_id: owner.id
            }
        });
    }

    console.log('='.repeat(60));
    console.log('DATABASE SEEDED SUCCESSFULLY WITH ALL CREDENTIALS FROM CREDENTIALS.md');
    console.log('='.repeat(60));
}

seed()
    .catch(e => console.error('Seeding error:', e))
    .finally(async () => {
        await prisma.$disconnect();
    });
