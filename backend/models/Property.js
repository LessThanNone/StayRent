import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide property title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide property description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide rental price'],
    },
    pricePeriod: {
      type: String,
      enum: ['daily', 'monthly', 'yearly'],
      default: 'monthly',
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String },
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['House', 'Apartment', 'Kost', 'Villa'],
      default: 'House',
    },
    bedrooms: {
      type: Number,
      required: true,
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      default: 1,
    },
    area: {
      type: Number, // in square meters (m2)
    },
    amenities: [
      {
        type: String, // e.g., 'WiFi', 'AC', 'Swimming Pool', 'Kitchen', 'Parking'
      },
    ],
    rules: [
      {
        type: String, // e.g., 'No Smoking', 'Pet Friendly', 'No Parties'
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);
export default Property;
