const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { adminAuth } = require('../middleware/auth');
const bcrypt = require('bcrypt');

router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalStores = await prisma.store.count();
        const totalRatings = await prisma.rating.count();

        res.json({
            totalUsers,
            totalStores,
            totalRatings,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/users', adminAuth, async (req, res) => {
    const { name, email, password, address, role } = req.body;

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,16}$/;
        return regex.test(password);
    };
    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password does not meet requirements.' });
    }
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: 'Name must be between 20 and 60 characters.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password_hash, address, role }
        });

        res.status(201).json({ message: 'User created successfully', userId: newUser.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.get('/users', adminAuth, async (req, res) => {
    try {
        const { name, email, address, role, sort, order } = req.query;

        const where = {};
        if (name) where.name = { contains: name, mode: 'insensitive' };
        if (email) where.email = { contains: email, mode: 'insensitive' };
        if (address) where.address = { contains: address, mode: 'insensitive' };
        if (role) where.role = role;

        const orderBy = {};
        if (sort) {
            const sortableColumns = ['name', 'email', 'address', 'role', 'created_at'];
            if (sortableColumns.includes(sort)) {
                orderBy[sort] = order === 'desc' ? 'desc' : 'asc';
            }
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                status: true,
                created_at: true
            },
            orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/stores', adminAuth, async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    try {
        if (owner_id) {
            const owner = await prisma.user.findUnique({
                where: { id: parseInt(owner_id, 10) }
            });
            if (!owner || owner.role !== 'store_owner') {
                return res.status(400).json({ message: 'Invalid owner ID or user is not a store owner.' });
            }
        }

        const newStore = await prisma.store.create({
            data: {
                name,
                email,
                address,
                owner_id: owner_id ? parseInt(owner_id, 10) : null
            }
        });

        res.status(201).json({ message: 'Store created successfully', storeId: newStore.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.get('/stores', adminAuth, async (req, res) => {
    try {
        const { name, email, address, sort, order } = req.query;

        const stores = await prisma.store.findMany({
            where: {
                AND: [
                    name ? { name: { contains: name, mode: 'insensitive' } } : {},
                    email ? { email: { contains: email, mode: 'insensitive' } } : {},
                    address ? { address: { contains: address, mode: 'insensitive' } } : {}
                ]
            },
            include: {
                owner: {
                    select: { name: true }
                },
                ratings: {
                    select: { rating: true }
                }
            }
        });

        const formattedStores = stores.map(store => {
            const rating = store.ratings.length > 0
                ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
                : 0;
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                owner_id: store.owner_id,
                created_at: store.created_at,
                owner_name: store.owner ? store.owner.name : null,
                rating
            };
        });

        if (sort) {
            const sortableColumns = ['name', 'email', 'address', 'rating', 'created_at'];
            if (sortableColumns.includes(sort)) {
                formattedStores.sort((a, b) => {
                    let valA = a[sort];
                    let valB = b[sort];
                    if (typeof valA === 'string') {
                        valA = valA.toLowerCase();
                        valB = valB.toLowerCase();
                    }
                    if (valA < valB) return order === 'desc' ? 1 : -1;
                    if (valA > valB) return order === 'desc' ? -1 : 1;
                    return 0;
                });
            }
        }

        res.json(formattedStores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.get('/users/:id', adminAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                status: true,
                created_at: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.role === 'store_owner') {
            const store = await prisma.store.findFirst({
                where: { owner_id: userId },
                include: {
                    ratings: {
                        select: { rating: true }
                    }
                }
            });
            if (store) {
                const rating = store.ratings.length > 0
                    ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
                    : 0;
                user.store = {
                    id: store.id,
                    name: store.name,
                    rating
                };
            }
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.put('/users/:id/block', adminAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot block admin users.' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { status: 'blocked' }
        });

        res.json({ message: 'User blocked successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.put('/users/:id/unblock', adminAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { status: 'active' }
        });

        res.json({ message: 'User unblocked successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users.' });
        }

        if (user.role === 'store_owner') {
            const store = await prisma.store.findFirst({
                where: { owner_id: userId },
                include: {
                    ratings: true
                }
            });

            if (store && store.ratings.length > 0) {
                return res.status(400).json({
                    message: 'Cannot delete store owner with active ratings. Block the user instead.'
                });
            }

            if (store) {
                await prisma.store.delete({
                    where: { id: store.id }
                });
            }
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
