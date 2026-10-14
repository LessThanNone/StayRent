import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getAllPropertiesAdmin,
  togglePropertyStatus,
  getAllBookingsAdmin,
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Restrict all routes in this router to admin role
router.use(protect, authorizeRoles('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/properties', getAllPropertiesAdmin);
router.put('/properties/:id/toggle-status', togglePropertyStatus);
router.get('/bookings', getAllBookingsAdmin);

export default router;
