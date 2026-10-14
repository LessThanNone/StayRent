import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Tenant)
export const createBooking = async (req, res, next) => {
  try {
    const { propertyId, startDate, endDate, totalPrice, notes } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (!property.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This property is currently not available for booking',
      });
    }

    // Prevent owner from booking their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own property',
      });
    }

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner,
      startDate,
      endDate,
      totalPrice,
      notes,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings (Tenant)
// @route   GET /api/bookings/my-bookings
// @access  Private (Tenant)
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate('property', 'title price images address propertyType')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for properties owned by logged in user (Owner)
// @route   GET /api/bookings/owner-bookings
// @access  Private (Owner)
export const getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title price images address')
      .populate('tenant', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Approve/Reject by Owner, Cancel by Tenant)
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isTenant = booking.tenant.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Permissions check
    if (status === 'cancelled') {
      if (!isTenant && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the tenant who made this booking or admin can cancel it',
        });
      }
    } else if (['approved', 'rejected', 'completed'].includes(status)) {
      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the property owner or admin can update this status',
        });
      }
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
