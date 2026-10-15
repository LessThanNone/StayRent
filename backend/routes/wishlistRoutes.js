import express from 'express';
import { getUserWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/wishlist        — Get current user's wishlist
router.get('/', protect, getUserWishlist);

// POST /api/wishlist/toggle — Add / Remove property from wishlist
router.post('/toggle', protect, toggleWishlist);

export default router;
