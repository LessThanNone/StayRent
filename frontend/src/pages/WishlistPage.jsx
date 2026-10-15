import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/ui/Button';
import { Heart, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist, loading } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium text-ink flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Favorit Saya</span>
          </h1>
          <p className="text-xs text-mutedtext mt-0.5">
            Daftar kost, kontrakan, dan hunian sewa yang Anda simpan untuk disewa nanti
          </p>
        </div>
        <Link to="/">
          <Button variant="secondary" size="sm">
            Jelajahi Hunian
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="bg-surface-warm rounded-3xl border border-hairline p-12 text-center max-w-md mx-auto">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-ink">Wishlist Anda Masih Kosong</h3>
          <p className="text-xs text-mutedtext mt-1 mb-6">
            Klik ikon hati pada properti mana pun untuk menyimpannya ke daftar wishlist pribadi Anda.
          </p>
          <Link to="/">
            <Button variant="primary" size="sm">Cari Properti Sekarang</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <PropertyCard key={item._id} property={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
