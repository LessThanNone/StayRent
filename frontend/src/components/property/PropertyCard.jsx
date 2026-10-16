import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { useWishlist } from '../../hooks/useWishlist';

const PropertyCard = ({ property }) => {
  const { isFavorited, toggleWishlist } = useWishlist();
  const favorited = isFavorited(property._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(property._id);
  };

  const imageSrc =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80';

  const periodLabel =
    property.pricePeriod === 'monthly'
      ? 'month'
      : property.pricePeriod === 'yearly'
      ? 'year'
      : 'night';

  return (
    <div className="group flex flex-col bg-white rounded-[14px] overflow-hidden transition-all duration-300 shadow-airbnb hover:-translate-y-1 hover:shadow-airbnb-hover">
      {/* Photo plate — Airbnb: 4:3 ratio, rounded-[14px] top clip */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Link to={`/properties/${property._id}`} className="block h-full w-full">
          <img
            src={imageSrc}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Availability + type badges — top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
              property.isAvailable
                ? 'bg-white/90 text-emerald-700'
                : 'bg-white/90 text-rose-600'
            }`}
          >
            {property.isAvailable ? 'Available' : 'Fully Booked'}
          </span>
        </div>

        {/* Heart button — top right, Airbnb style */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-rose-500 text-rose-500' : 'text-gray-600 hover:text-rose-500'
            }`}
          />
        </button>
      </div>

      {/* Meta block — 16px padding, Airbnb body-sm (14px/400) */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Location & Rating row */}
          <div className="flex items-center justify-between text-xs text-mutedtext mb-1">
            <span className="flex items-center truncate max-w-[70%]">
              <MapPin className="w-3 h-3 mr-1 text-brand-500 flex-shrink-0" />
              {property.address?.city || 'Indonesia'}
            </span>
            {/* Airbnb: rating in ink (near-black), not gold */}
            <span className="flex items-center font-medium text-ink shrink-0">
              <Star className="w-3 h-3 mr-0.5 fill-amber-400 text-amber-400" />
              {property.rating > 0 ? property.rating.toFixed(1) : 'New'}
              {property.numReviews > 0 && (
                <span className="text-mutedtext font-normal ml-0.5">({property.numReviews})</span>
              )}
            </span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property._id}`}>
            <h3 className="font-medium text-ink text-sm group-hover:text-brand-500 transition-colors line-clamp-1 mb-1.5">
              {property.title}
            </h3>
          </Link>

          {/* Specs row */}
          <div className="flex items-center gap-3 text-xs text-mutedtext mb-3">
            <span className="flex items-center">
              <Bed className="w-3 h-3 mr-1 flex-shrink-0" />
              {property.bedrooms || 1} KT
            </span>
            <span className="flex items-center">
              <Bath className="w-3 h-3 mr-1 flex-shrink-0" />
              {property.bathrooms || 1} KM
            </span>
            {property.area && (
              <span className="flex items-center">
                <Maximize2 className="w-3 h-3 mr-1 flex-shrink-0" />
                {property.area} m²
              </span>
            )}
          </div>
        </div>

        {/* Price — Airbnb: bold ink, muted period label */}
        <div className="pt-3 border-t border-hairline flex items-baseline justify-between">
          <div>
            <span className="text-sm font-semibold text-ink tabular-nums">
              {formatRupiah(property.price)}
            </span>
            <span className="text-xs text-mutedtext font-normal ml-1">
              /{periodLabel}
            </span>
          </div>
          <Link
            to={`/properties/${property._id}`}
            className="text-xs text-brand-500 hover:text-brand-800 font-medium"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
