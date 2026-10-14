import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { useWishlist } from '../../hooks/useWishlist';
import Card from '../ui/Card';

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
      ? property.images[0].startsWith('http')
        ? property.images[0]
        : property.images[0]
      : 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80';

  return (
    <Card className="group relative flex flex-col h-full">
      {/* Property Thumbnail & Overlays */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Property Type Badge */}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {property.propertyType}
        </span>

        {/* Availability Badge */}
        <span
          className={`absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm ${
            property.isAvailable
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {property.isAvailable ? 'Tersedia' : 'Sudah Dipesan'}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            className={`w-4 h-4 ${
              favorited ? 'fill-red-500 text-red-500' : 'text-gray-700'
            }`}
          />
        </button>
      </div>

      {/* Property Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="flex items-center truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0" />
              {property.address?.city || 'Indonesia'}
            </span>
            <span className="flex items-center font-medium text-amber-600">
              <Star className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400" />
              {property.rating > 0 ? property.rating.toFixed(1) : 'Baru'}
              {property.numReviews > 0 && ` (${property.numReviews})`}
            </span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property._id}`}>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          {/* Facilities Spec Icons */}
          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
            <span className="flex items-center">
              <Bed className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {property.bedrooms || 1} KT
            </span>
            <span className="flex items-center">
              <Bath className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {property.bathrooms || 1} KM
            </span>
            {property.area && (
              <span className="flex items-center">
                <Maximize className="w-3.5 h-3.5 mr-1 text-gray-400" />
                {property.area} m²
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Action */}
        <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
          <div>
            <span className="text-base font-bold text-blue-600">
              {formatRupiah(property.price)}
            </span>
            <span className="text-xs text-gray-500">
              /{property.pricePeriod === 'monthly' ? 'bln' : property.pricePeriod === 'yearly' ? 'thn' : 'mlm'}
            </span>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
