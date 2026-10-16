import React from 'react';
import {
  Wifi,
  Wind,
  Waves,
  Car,
  Utensils,
  Tv,
  ShieldCheck,
  Bath,
  Flame,
  Laptop,
  CigaretteOff,
  PawPrint,
  PartyPopper,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

const iconDictionary = {
  // Amenities
  'Fast Wi-Fi': Wifi,
  WiFi: Wifi,
  'Air Conditioning (AC)': Wind,
  AC: Wind,
  'Private Bathroom': Bath,
  'Free Parking': Car,
  'Car & Motorcycle Parking': Car,
  Parking: Car,
  'Fully Equipped Kitchen': Utensils,
  Kitchen: Utensils,
  'Smart TV': Tv,
  TV: Tv,
  'Swimming Pool': Waves,
  '24-Hour Security': ShieldCheck,
  'Water Heater': Flame,
  'Desk & Chair': Laptop,

  // Rules
  'No Smoking': CigaretteOff,
  'No Pets Allowed': PawPrint,
  'No Pets': PawPrint,
  'Pet Friendly': PawPrint,
  'No Parties / Noise': PartyPopper,
  'No Parties': PartyPopper,
  '24-Hour Access': Clock,
  'Limited Guests': Users,
};

/**
 * PropertyBadges component supporting:
 * - 'pills': compact pill badges with Lucide icons (for cards & quick view)
 * - 'blocks': Rukita-style structured block cards with icons, titles, and allowed/prohibited states
 */
const PropertyBadges = ({ items = [], type = 'amenity', variant = 'pills' }) => {
  if (!items || items.length === 0) return null;

  const isAmenity = type === 'amenity';

  if (variant === 'blocks') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, index) => {
          const Icon = iconDictionary[item] || (isAmenity ? CheckCircle2 : HelpCircle);
          const isProhibited =
            item.toLowerCase().includes('dilarang') ||
            item.toLowerCase().includes('no ') ||
            item.toLowerCase().includes('tidak');

          return (
            <div
              key={index}
              className={`p-3.5 rounded-xl border flex items-center space-x-3 transition-colors ${
                isProhibited
                  ? 'bg-rose-50/50 border-rose-100 text-rose-950'
                  : 'bg-surface-warm border-gray-100 text-ink hover:border-gray-200'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isProhibited
                    ? 'bg-rose-100 text-rose-600'
                    : isAmenity
                    ? 'bg-brand-50 text-brand-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold block truncate leading-tight">
                  {item}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default: Sleek pill badges with Lucide icons (No Emojis)
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => {
        const Icon = iconDictionary[item] || (isAmenity ? CheckCircle2 : HelpCircle);
        const isProhibited =
          item.toLowerCase().includes('dilarang') ||
          item.toLowerCase().includes('no ');

        return (
          <span
            key={index}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              isProhibited
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : isAmenity
                ? 'bg-brand-50/70 text-brand-800 border-brand-200/60'
                : 'bg-gray-50 text-ink border-gray-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5 stroke-[2] flex-shrink-0" />
            <span>{item}</span>
          </span>
        );
      })}
    </div>
  );
};

export default PropertyBadges;
