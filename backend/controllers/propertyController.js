import Property from '../models/Property.js';

// @desc    Get all properties with search and filter options
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      city,
      propertyType,
      minPrice,
      maxPrice,
      availableOnly,
      amenities,
    } = req.query;

    const filter = {};

    // Search by title or description
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { 'address.city': { $regex: keyword, $options: 'i' } },
        { 'address.street': { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by city
    if (city) {
      filter['address.city'] = { $regex: city, $options: 'i' };
    }

    // Filter by property type
    if (propertyType && propertyType !== 'All' && propertyType !== 'Semua Tipe') {
      if (propertyType === 'House' || propertyType === 'Rumah') {
        filter.propertyType = { $in: ['House', 'Rumah'] };
      } else {
        filter.propertyType = propertyType;
      }
    }

    // Filter by availability
    if (availableOnly === 'true') {
      filter.isAvailable = true;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Amenities filter
    if (amenities) {
      const amenitiesList = amenities.split(',').map((item) => item.trim());
      filter.amenities = { $all: amenitiesList };
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone avatar')
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

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone avatar'
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Owner, Admin)
export const createProperty = async (req, res, next) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const propertyData = {
      ...req.body,
      images,
      owner: req.user._id,
      amenities: typeof req.body.amenities === 'string' ? JSON.parse(req.body.amenities) : req.body.amenities,
      rules: typeof req.body.rules === 'string' ? JSON.parse(req.body.rules) : req.body.rules,
      address: typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address,
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Owner who owns it, Admin)
export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership or admin
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property',
      });
    }

    // Handle new uploaded images if provided
    let updatedImages = property.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }

    const updatedData = { ...req.body };

    if (typeof updatedData.amenities === 'string') {
      try { updatedData.amenities = JSON.parse(updatedData.amenities); } catch (_) {}
    }
    if (typeof updatedData.rules === 'string') {
      try { updatedData.rules = JSON.parse(updatedData.rules); } catch (_) {}
    }
    if (typeof updatedData.address === 'string') {
      try { updatedData.address = JSON.parse(updatedData.address); } catch (_) {}
    }

    if (updatedImages.length > 0) updatedData.images = updatedImages;

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Owner who owns it, Admin)
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property',
      });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: 'Property removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties owned by the current logged-in owner
// @route   GET /api/properties/owner/my-listings
// @access  Private (Owner)
export const getOwnerProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};
