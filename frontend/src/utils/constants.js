export const PROPERTY_TYPES = ['All', 'House', 'Apartment', 'Kost', 'Villa'];

export const AMENITIES_LIST = [
  { id: 'wifi', name: 'WiFi', icon: 'Wifi' },
  { id: 'ac', name: 'Air Conditioning', icon: 'Wind' },
  { id: 'pool', name: 'Swimming Pool', icon: 'Waves' },
  { id: 'parking', name: 'Free Parking', icon: 'Car' },
  { id: 'kitchen', name: 'Kitchen', icon: 'Utensils' },
  { id: 'tv', name: 'Smart TV', icon: 'Tv' },
  { id: 'security', name: '24/7 Security', icon: 'ShieldCheck' },
];

export const RULES_LIST = [
  { id: 'no_smoking', name: 'Dilarang Merokok', icon: 'CigaretteOff' },
  { id: 'pet_friendly', name: 'Boleh Bawa Hewan', icon: 'PawPrint' },
  { id: 'no_parties', name: 'Dilarang Pesta', icon: 'PartyPopper' },
  { id: 'max_guests', name: 'Batas Tamu Tertentu', icon: 'Users' },
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
