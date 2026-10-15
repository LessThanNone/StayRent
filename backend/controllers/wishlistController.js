import Wishlist from '../models/Wishlist.js';
import Property from '../models/Property.js';

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getUserWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'properties'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, properties: [] });
    }

    res.json({
      success: true,
      data: wishlist.properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property in wishlist (add / remove)
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'propertyId is required' });
    }

    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        properties: [propertyId],
      });
      return res.json({
        success: true,
        message: 'Ditambahkan ke wishlist',
        isSaved: true,
      });
    }

    const index = wishlist.properties.findIndex(
      (p) => p.toString() === propertyId.toString()
    );
    let isSaved = false;

    if (index > -1) {
      wishlist.properties.splice(index, 1);
      isSaved = false;
    } else {
      wishlist.properties.push(propertyId);
      isSaved = true;
    }

    await wishlist.save();

    res.json({
      success: true,
      message: isSaved ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist',
      isSaved,
    });
  } catch (error) {
    next(error);
  }
};
