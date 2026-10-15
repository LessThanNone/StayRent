export const PROPERTY_TYPES = [
  'Semua Tipe',
  'Kost',
  'Kontrakan',
  'Apartment',
  'Villa',
  'Rumah',
];

export const AMENITIES_LIST = [
  { id: 'wifi', name: 'Wi-Fi Cepat', icon: 'Wifi' },
  { id: 'ac', name: 'Air Conditioning (AC)', icon: 'Wind' },
  { id: 'bathroom', name: 'Kamar Mandi Dalam', icon: 'Bath' },
  { id: 'parking', name: 'Parkir Gratis', icon: 'Car' },
  { id: 'kitchen', name: 'Dapur Lengkap', icon: 'Utensils' },
  { id: 'tv', name: 'Smart TV', icon: 'Tv' },
  { id: 'pool', name: 'Kolam Renang', icon: 'Waves' },
  { id: 'security', name: 'Keamanan 24 Jam', icon: 'ShieldCheck' },
  { id: 'water_heater', name: 'Water Heater', icon: 'Flame' },
  { id: 'workspace', name: 'Meja Kerja & Kursi', icon: 'Laptop' },
];

export const RULES_LIST = [
  { id: 'no_smoking', name: 'Dilarang Merokok', icon: 'CigaretteOff', allowed: false },
  { id: 'no_pets', name: 'Dilarang Bawa Hewan', icon: 'PawPrint', allowed: false },
  { id: 'pet_friendly', name: 'Boleh Bawa Hewan', icon: 'PawPrint', allowed: true },
  { id: 'no_parties', name: 'Dilarang Pesta / Bising', icon: 'PartyPopper', allowed: false },
  { id: 'access_24h', name: 'Akses 24 Jam Bebas', icon: 'Clock', allowed: true },
  { id: 'max_guests', name: 'Batas Tamu Tertentu', icon: 'Users', allowed: false },
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const USER_ROLES = {
  TENANT: 'tenant',
  OWNER: 'owner',
  ADMIN: 'admin',
};
