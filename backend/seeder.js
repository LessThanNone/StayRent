import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import Booking from './models/Booking.js';
import Review from './models/Review.js';
import Wishlist from './models/Wishlist.js';
import connectDB from './config/db.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear old data
    await User.deleteMany();
    await Property.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await Wishlist.deleteMany();

    console.log('Clearing old data...');

    // 1. Create 3 Distinct Role Users
    const adminUser = await User.create({
      name: 'Super Admin StayRent',
      email: 'admin@stayrent.com',
      password: 'admin123',
      role: 'admin',
      phone: '081122334455',
    });

    const ownerUser = await User.create({
      name: 'Hendra Saputra (Owner)',
      email: 'owner@stayrent.com',
      password: 'owner123',
      role: 'owner',
      phone: '081298765432',
    });

    const tenantUser = await User.create({
      name: 'Dimas Pratama (Tenant)',
      email: 'tenant@stayrent.com',
      password: 'tenant123',
      role: 'tenant',
      phone: '085612345678',
    });

    console.log('Users created for all 3 roles (Admin, Owner, Tenant)...');

    // 2. Create Sample Properties owned by Owner
    const propertiesData = [
      {
        title: 'Exclusive Boarding House Dago Asri Full AC Near ITB',
        description:
          'A modern and exclusive boarding house in a serene Dago Bandung neighborhood. The room is fully furnished with a queen-size spring bed, study desk, two-door wardrobe, and an en-suite bathroom with a water heater. Prime location just 5 minutes from ITB and Unpad Dipatiukur campus.',
        price: 2200000,
        pricePeriod: 'monthly',
        propertyType: 'Boarding House',
        address: {
          street: 'Jl. Dago Asri No. 18',
          city: 'Bandung',
          province: 'West Java',
          postalCode: '40135',
        },
        bedrooms: 1,
        bathrooms: 1,
        area: 24,
        amenities: [
          'Fast Wi-Fi',
          'Air Conditioning (AC)',
          'Private Bathroom',
          'Water Heater',
          'Car & Motorcycle Parking',
          '24-Hour Security',
        ],
        rules: [
          'No Smoking',
          'No Pets Allowed',
          '24-Hour Access',
        ],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        ],
        owner: ownerUser._id,
        isAvailable: true,
        rating: 4.8,
        numReviews: 12,
      },
      {
        title: 'Modern Studio Apartment Menteng Park Tower',
        description:
          'A studio apartment on the 18th floor with a stunning Jakarta city view. Equipped with a Smart TV, full kitchen set with induction stove, microwave, refrigerator, and complimentary access to the building\'s infinity pool and fitness center.',
        price: 5500000,
        pricePeriod: 'monthly',
        propertyType: 'Apartment',
        address: {
          street: 'Jl. Cikini Raya No. 79',
          city: 'Central Jakarta',
          province: 'DKI Jakarta',
          postalCode: '10330',
        },
        bedrooms: 1,
        bathrooms: 1,
        area: 38,
        amenities: [
          'Fast Wi-Fi',
          'Air Conditioning (AC)',
          'Private Bathroom',
          'Smart TV',
          'Fully Equipped Kitchen',
          'Swimming Pool',
          '24-Hour Security',
        ],
        rules: [
          'No Smoking',
          'No Parties / Noise',
          'Limited Guests',
        ],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        ],
        owner: ownerUser._id,
        isAvailable: true,
        rating: 4.9,
        numReviews: 8,
      },
      {
        title: 'Minimalist 2-Storey Rented House Move-in Ready',
        description:
          'A 2-storey rental house ideal for young families or professionals. Located in a peaceful residential area with a one-gate security system. Features a covered carport, spacious living room, clean kitchen, and a lush backyard garden.',
        price: 35000000,
        pricePeriod: 'yearly',
        propertyType: 'Rented House',
        address: {
          street: 'Komplek Griya Indah Blok C No. 5',
          city: 'Sleman',
          province: 'DI Yogyakarta',
          postalCode: '55281',
        },
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        amenities: [
          'Free Parking',
          'Fully Equipped Kitchen',
          '24-Hour Security',
          'Air Conditioning (AC)',
        ],
        rules: [
          'Pet Friendly',
          '24-Hour Access',
        ],
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        ],
        owner: ownerUser._id,
        isAvailable: true,
        rating: 4.7,
        numReviews: 5,
      },
      {
        title: 'Private Pool Villa with Mount Salak View',
        description:
          'An exclusive holiday villa with a private pool and a relaxing gazebo facing the panoramic view of Mount Salak. Perfect for a large family vacation or a weekend getaway with friends.',
        price: 1800000,
        pricePeriod: 'daily',
        propertyType: 'Villa',
        address: {
          street: 'Jl. Raya Puncak KM 77',
          city: 'Bogor',
          province: 'West Java',
          postalCode: '16750',
        },
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        amenities: [
          'Swimming Pool',
          'Fast Wi-Fi',
          'Smart TV',
          'Fully Equipped Kitchen',
          'Free Parking',
        ],
        rules: [
          'Limited Guests',
          'No Smoking',
        ],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        ],
        owner: ownerUser._id,
        isAvailable: false,
        rating: 5.0,
        numReviews: 15,
      },
      {
        title: 'Modern Pavilion House Close to City Center',
        description:
          'A modern pavilion residence with a lush front garden, spacious living room, private kitchen, and a wide driveway for two cars. Close to public facilities, hospitals, and dining areas.',
        price: 45000000,
        pricePeriod: 'yearly',
        propertyType: 'House',
        address: {
          street: 'Jl. Cemara Indah No. 24',
          city: 'Bandung',
          province: 'West Java',
          postalCode: '40161',
        },
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        amenities: [
          'Fast Wi-Fi',
          'Air Conditioning (AC)',
          'Car & Motorcycle Parking',
          'Fully Equipped Kitchen',
          '24-Hour Security',
        ],
        rules: [
          'No Smoking',
          '24-Hour Access',
        ],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        ],
        owner: ownerUser._id,
        isAvailable: true,
        rating: 4.9,
        numReviews: 10,
      },
    ];

    const createdProperties = await Property.insertMany(propertiesData);
    console.log('Sample properties inserted...');

    // 3. Create Sample Bookings for Tenant
    await Booking.create({
      property: createdProperties[0]._id,
      tenant: tenantUser._id,
      owner: ownerUser._id,
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-12-01'),
      totalPrice: createdProperties[0].price,
      status: 'pending',
      notes: 'Planning to move in at the start of the month, bringing 1 motorcycle.',
    });

    await Booking.create({
      property: createdProperties[1]._id,
      tenant: tenantUser._id,
      owner: ownerUser._id,
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-11-01'),
      totalPrice: createdProperties[1].price,
      status: 'approved',
      notes: 'Down payment has been confirmed.',
    });

    console.log('Sample bookings created...');

    // 4. Create Sample Wishlist for Tenant
    await Wishlist.create({
      user: tenantUser._id,
      properties: [createdProperties[0]._id, createdProperties[2]._id],
    });

    console.log('Sample wishlist created...');

    // 5. Create Sample Review
    await Review.create({
      property: createdProperties[0]._id,
      user: tenantUser._id,
      rating: 5,
      comment:
        'The place is very clean, water runs smoothly and warm, the owner is friendly and responds fast via WhatsApp. Highly recommended for students near Dago!',
    });

    console.log('Data Seeding Successfully Completed! 🎉');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
