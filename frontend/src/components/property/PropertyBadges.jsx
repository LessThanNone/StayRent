import React from 'react';
import {
  Wifi,
  Wind,
  Waves,
  Car,
  Utensils,
  Tv,
  ShieldCheck,
  CigaretteOff,
  PawPrint,
  PartyPopper,
  Users,
  CheckCircle,
} from 'lucide-react';

const iconMap = {
  WiFi: Wifi,
  'Air Conditioning': Wind,
  AC: Wind,
  'Swimming Pool': Waves,
  'Free Parking': Car,
  Parking: Car,
  Kitchen: Utensils,
  'Smart TV': Tv,
  TV: Tv,
  '24/7 Security': ShieldCheck,
  'Dilarang Merokok': CigaretteOff,
  'No Smoking': CigaretteOff,
  'Boleh Bawa Hewan': PawPrint,
  'Pet Friendly': PawPrint,
  'Dilarang Pesta': PartyPopper,
  'No Parties': PartyPopper,
  'Batas Tamu Tertentu': Users,
};

const PropertyBadges = ({ items = [], type = 'amenity', size = 'sm' }) => {
  if (!items || items.length === 0) return null;

  const isAmenity = type === 'amenity';

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => {
        const IconComponent = iconMap[item] || CheckCircle;

        return (
          <span
            key={index}
            className={`inline-flex items-center space-x-1.5 rounded-full font-medium ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'
            } ${
              isAmenity
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            <IconComponent className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            <span>{item}</span>
          </span>
        );
      })}
    </div>
  );
};

export default PropertyBadges;
