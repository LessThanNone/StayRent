import express from 'express';
import {
  createReview,
  getPropertyReviews,
  getUserWishlist,
  toggleWishlist,
} from '../controllers/reviewController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Wishlist routes
router.get('/wishlist', protect, getUserWishlist);
router.post('/wishlist/:propertyId', protect, toggleWishlist);

// Review routes
router.get('/:propertyId', getPropertyReviews);
router.post('/:propertyId', protect, authorizeRoles('tenant'), createReview);

export default router;
