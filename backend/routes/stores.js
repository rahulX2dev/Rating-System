const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const { search, sort, order = 'ASC' } = req.query;
        const userId = req.user.id;

        const stores = await prisma.store.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { address: { contains: search, mode: 'insensitive' } }
                ]
            } : {},
            include: {
                ratings: true
            }
        });

        const formattedStores = stores.map(store => {
            const overall_rating = store.ratings.length > 0
                ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
                : 0;
            const myRatingObj = store.ratings.find(r => r.user_id === userId);
            const my_rating = myRatingObj ? myRatingObj.rating : null;
            return {
                id: store.id,
                name: store.name,
                address: store.address,
                email: store.email,
                overall_rating,
                my_rating
            };
        });

        if (sort) {
            const sortableColumns = ['name', 'address', 'overall_rating'];
            if (sortableColumns.includes(sort)) {
                formattedStores.sort((a, b) => {
                    let valA = a[sort];
                    let valB = b[sort];
                    if (typeof valA === 'string') {
                        valA = valA.toLowerCase();
                        valB = valB.toLowerCase();
                    }
                    if (valA < valB) return order.toUpperCase() === 'DESC' ? 1 : -1;
                    if (valA > valB) return order.toUpperCase() === 'DESC' ? -1 : 1;
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

router.post('/:storeId/rate', auth, async (req, res) => {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        const storeIdInt = parseInt(storeId, 10);
        const store = await prisma.store.findUnique({
            where: { id: storeIdInt }
        });
        if (!store) {
            return res.status(404).json({ message: 'Store not found.' });
        }

        await prisma.rating.upsert({
            where: {
                user_id_store_id: {
                    user_id: userId,
                    store_id: storeIdInt
                }
            },
            update: { rating },
            create: {
                user_id: userId,
                store_id: storeIdInt,
                rating
            }
        });

        res.status(200).json({ message: 'Rating submitted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.put('/:storeId/rate', auth, async (req, res) => {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        const storeIdInt = parseInt(storeId, 10);
        await prisma.rating.update({
            where: {
                user_id_store_id: {
                    user_id: userId,
                    store_id: storeIdInt
                }
            },
            data: { rating }
        });

        res.json({ message: 'Rating updated successfully.' });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'No existing rating found for this store to update.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});
module.exports = router;
