import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';

// @desc    Get Admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Calculate total revenue from approved or completed bookings
    const completedBookings = await Booking.find({
      status: { $in: ['approved', 'completed'] },
    });
    const totalRevenue = completedBookings.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    const tenantsCount = await User.countDocuments({ role: 'tenant' });
    const ownersCount = await User.countDocuments({ role: 'owner' });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProperties,
        totalBookings,
        totalRevenue,
        tenantsCount,
        ownersCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['tenant', 'owner', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role provided' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties for admin overview
// @route   GET /api/admin/properties
// @access  Private (Admin)
export const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property availability / status
// @route   PUT /api/admin/properties/:id/toggle-status
// @access  Private (Admin)
export const togglePropertyStatus = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.isAvailable = !property.isAvailable;
    await property.save();

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
// @access  Private (Admin)
export const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('tenant', 'name email')
      .populate('owner', 'name email')
      .populate('property', 'title price')
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
