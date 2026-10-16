export const PROPERTY_TYPES = [
  'All Types',
  'Boarding House',
  'Rented House',
  'Apartment',
  'Villa',
  'House',
];

export const AMENITIES_LIST = [
  { id: 'wifi', name: 'Fast Wi-Fi', icon: 'Wifi' },
  { id: 'ac', name: 'Air Conditioning (AC)', icon: 'Wind' },
  { id: 'bathroom', name: 'Private Bathroom', icon: 'Bath' },
  { id: 'parking', name: 'Free Parking', icon: 'Car' },
  { id: 'kitchen', name: 'Fully Equipped Kitchen', icon: 'Utensils' },
  { id: 'tv', name: 'Smart TV', icon: 'Tv' },
  { id: 'pool', name: 'Swimming Pool', icon: 'Waves' },
  { id: 'security', name: '24-Hour Security', icon: 'ShieldCheck' },
  { id: 'water_heater', name: 'Water Heater', icon: 'Flame' },
  { id: 'workspace', name: 'Desk & Chair', icon: 'Laptop' },
];

export const RULES_LIST = [
  { id: 'no_smoking', name: 'No Smoking', icon: 'CigaretteOff', allowed: false },
  { id: 'no_pets', name: 'No Pets Allowed', icon: 'PawPrint', allowed: false },
  { id: 'pet_friendly', name: 'Pet Friendly', icon: 'PawPrint', allowed: true },
  { id: 'no_parties', name: 'No Parties / Noise', icon: 'PartyPopper', allowed: false },
  { id: 'access_24h', name: '24-Hour Access', icon: 'Clock', allowed: true },
  { id: 'max_guests', name: 'Limited Guests', icon: 'Users', allowed: false },
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
