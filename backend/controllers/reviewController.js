import Review from '../models/Review.js';
import Property from '../models/Property.js';
import Wishlist from '../models/Wishlist.js';

// @desc    Add review to a property
// @route   POST /api/reviews/:propertyId
// @access  Private (Tenant)
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const alreadyReviewed = await Review.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this property',
      });
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    // Update Property average rating and total reviews
    const reviews = await Review.find({ property: propertyId });
    property.numReviews = reviews.length;
    property.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await property.save();

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/:propertyId
// @access  Public
export const getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's wishlist
// @route   GET /api/reviews/wishlist
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
// @route   POST /api/reviews/wishlist/:propertyId
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        properties: [propertyId],
      });
      return res.json({
        success: true,
        message: 'Added to wishlist',
        isSaved: true,
      });
    }

    const index = wishlist.properties.indexOf(propertyId);
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
      message: isSaved ? 'Added to wishlist' : 'Removed from wishlist',
      isSaved,
    });
  } catch (error) {
    next(error);
  }
};
