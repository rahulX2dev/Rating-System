const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { storeOwnerAuth } = require('../middleware/auth');

router.get('/dashboard', storeOwnerAuth, async (req, res) => {
    try {
        const ownerId = req.user.id;

        const store = await prisma.store.findFirst({
            where: { owner_id: ownerId },
            include: {
                ratings: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }
            }
        });

        if (!store) {
            return res.status(404).json({ message: 'You do not own a store.' });
        }

        const averageRating = store.ratings.length > 0
            ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
            : 0;

        const ratings = store.ratings.map(r => ({
            id: r.user.id,
            name: r.user.name,
            email: r.user.email,
            rating: r.rating,
            updated_at: r.updated_at
        }));

        const sort = req.query.sort || 'updated_at';
        const order = req.query.order === 'asc' ? 'asc' : 'desc';
        const sortableColumns = ['name', 'rating', 'updated_at'];

        if (sortableColumns.includes(sort)) {
            ratings.sort((a, b) => {
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
        } else {
            ratings.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        }

        res.json({
            storeId: store.id,
            averageRating,
            ratings,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
