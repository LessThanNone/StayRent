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
      name: 'Hendra Saputra (Tuan Rumah)',
      email: 'owner@stayrent.com',
      password: 'owner123',
      role: 'owner',
      phone: '081298765432',
    });

    const tenantUser = await User.create({
      name: 'Dimas Pratama (Penyewa)',
      email: 'tenant@stayrent.com',
      password: 'tenant123',
      role: 'tenant',
      phone: '085612345678',
    });

    console.log('Users created for all 3 roles (Admin, Owner, Tenant)...');

    // 2. Create Sample Properties owned by Owner
    const propertiesData = [
      {
        title: 'Kost Eksklusif Dago Asri Full AC Dekat ITB',
        description:
          'Kost eksklusif modern bernuansa asri dan tenang di kawasan Dago Bandung. Kamar sudah full-furnished dengan kasur springbed ukuran queen, meja belajar, lemari baju 2 pintu, dan kamar mandi dalam lengkap dengan water heater. Lokasi strategis hanya 5 menit ke kampus ITB dan Unpad Dipatiukur.',
        price: 2200000,
        pricePeriod: 'monthly',
        propertyType: 'Kost',
        address: {
          street: 'Jl. Dago Asri No. 18',
          city: 'Bandung',
          province: 'Jawa Barat',
          postalCode: '40135',
        },
        bedrooms: 1,
        bathrooms: 1,
        area: 24,
        amenities: [
          'Wi-Fi Cepat',
          'Air Conditioning (AC)',
          'Kamar Mandi Dalam',
          'Water Heater',
          'Parkir Mobil & Motor',
          'Keamanan 24 Jam',
        ],
        rules: [
          'Dilarang Merokok',
          'Dilarang Bawa Hewan',
          'Akses 24 Jam Bebas',
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
        title: 'Apartemen Modern Studio Menteng Park Tower',
        description:
          'Unit apartemen tipe studio di lantai 18 dengan pemandangan kota Jakarta yang menawan. Dilengkapi smart TV, kitchen set lengkap dengan kompor induksi, microwave, kulkas, serta akses gratis ke kolam renang infinity dan fitness center gedung.',
        price: 5500000,
        pricePeriod: 'monthly',
        propertyType: 'Apartment',
        address: {
          street: 'Jl. Cikini Raya No. 79',
          city: 'Jakarta Pusat',
          province: 'DKI Jakarta',
          postalCode: '10330',
        },
        bedrooms: 1,
        bathrooms: 1,
        area: 38,
        amenities: [
          'Wi-Fi Cepat',
          'Air Conditioning (AC)',
          'Kamar Mandi Dalam',
          'Smart TV',
          'Dapur Lengkap',
          'Kolam Renang',
          'Keamanan 24 Jam',
        ],
        rules: [
          'Dilarang Merokok',
          'Dilarang Pesta / Bising',
          'Batas Tamu Tertentu',
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
        title: 'Kontrakan Rumah Minimalis 2 Lantai Siap Huni',
        description:
          'Rumah sewa 2 lantai cocok untuk keluarga muda atau profesional. Lingkungan perumahan asri dengan sistem keamanan satu pintu (one gate system). Memiliki carport berkanopi, ruang keluarga luas, dapur bersih, dan taman belakang yang hijau.',
        price: 35000000,
        pricePeriod: 'yearly',
        propertyType: 'Kontrakan',
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
          'Parkir Gratis',
          'Dapur Lengkap',
          'Keamanan 24 Jam',
          'Air Conditioning (AC)',
        ],
        rules: [
          'Boleh Bawa Hewan',
          'Akses 24 Jam Bebas',
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
        title: 'Villa Private Pool Pemandangan Gunung Salak',
        description:
          'Villa liburan eksklusif dengan kolam renang pribadi dan gazebo santai menghadap langsung ke panorama Gunung Salak. Sangat cocok untuk liburan keluarga besar atau kumpul akhir pekan.',
        price: 1800000,
        pricePeriod: 'daily',
        propertyType: 'Villa',
        address: {
          street: 'Jl. Raya Puncak KM 77',
          city: 'Bogor',
          province: 'Jawa Barat',
          postalCode: '16750',
        },
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        amenities: [
          'Kolam Renang',
          'Wi-Fi Cepat',
          'Smart TV',
          'Dapur Lengkap',
          'Parkir Gratis',
        ],
        rules: [
          'Batas Tamu Tertentu',
          'Dilarang Merokok',
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
        title: 'Rumah Paviliun Modern Asri Dekat Pusat Kota',
        description:
          'Rumah tinggal paviliun modern dengan halaman depan yang asri, ruang tamu luas, dapur pribadi, dan akses jalan lebar 2 mobil. Dekat fasilitas umum, rumah sakit, dan pusat kuliner.',
        price: 45000000,
        pricePeriod: 'yearly',
        propertyType: 'Rumah',
        address: {
          street: 'Jl. Cemara Indah No. 24',
          city: 'Bandung',
          province: 'Jawa Barat',
          postalCode: '40161',
        },
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        amenities: [
          'Wi-Fi Cepat',
          'Air Conditioning (AC)',
          'Parkir Mobil & Motor',
          'Dapur Lengkap',
          'Keamanan 24 Jam',
        ],
        rules: [
          'Dilarang Merokok',
          'Akses 24 Jam Bebas',
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
      notes: 'Rencana pindah awal bulan, membawa 1 motor.',
    });

    await Booking.create({
      property: createdProperties[1]._id,
      tenant: tenantUser._id,
      owner: ownerUser._id,
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-11-01'),
      totalPrice: createdProperties[1].price,
      status: 'approved',
      notes: 'Pembayaran DP telah dikonfirmasi.',
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
        'Tempatnya bersih banget, air lancar dan hangat, pemiliknya ramah dan fast response via WA. Rekomendasi buat mahasiswa Dago!',
    });

    console.log('Data Seeding Successfully Completed! 🎉');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
