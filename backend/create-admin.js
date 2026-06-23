const bcrypt = require('bcrypt');
const prisma = require('./config/database');

async function createAdmin() {
    const name = 'System Administrator';
    const email = 'admin@ratingplatform.com';
    const password = 'Admin@12345';
    const hash = await bcrypt.hash(password, 10);

    try {
        const adminUser = await prisma.user.upsert({
            where: { email },
            update: {
                name,
                password_hash: hash,
                role: 'admin',
                status: 'active'
            },
            create: {
                name,
                email,
                password_hash: hash,
                role: 'admin',
                status: 'active'
            }
        });

        console.log('='.repeat(60));
        console.log('ADMIN ACCOUNT SEEDED SUCCESSFULLY');
        console.log('='.repeat(60));
        console.log('Name:    ', adminUser.name);
        console.log('Email:   ', adminUser.email);
        console.log('Password:', password);
        console.log('Role:    ', adminUser.role);
        console.log('='.repeat(60));
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
