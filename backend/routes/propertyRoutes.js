import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
} from '../controllers/propertyController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/owner/my-listings', protect, authorizeRoles('owner', 'admin'), getOwnerProperties);
router.get('/:id', getPropertyById);

// Protected routes (Owner and Admin)
router.post(
  '/',
  protect,
  authorizeRoles('owner', 'admin'),
  upload.array('images', 5),
  createProperty
);

router.put(
  '/:id',
  protect,
  authorizeRoles('owner', 'admin'),
  upload.array('images', 5),
  updateProperty
);

router.delete('/:id', protect, authorizeRoles('owner', 'admin'), deleteProperty);

export default router;
