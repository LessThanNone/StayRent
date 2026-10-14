import express from 'express';
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('tenant'), createBooking);
router.get('/my-bookings', protect, authorizeRoles('tenant'), getMyBookings);
router.get('/owner-bookings', protect, authorizeRoles('owner', 'admin'), getOwnerBookings);
router.put('/:id/status', protect, updateBookingStatus);

export default router;
