import React, { createContext, useState, useEffect } from 'react';
import { reviewService } from '../services/apiServices';
import { useAuth } from '../hooks/useAuth';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getWishlist();
      setWishlist(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (propertyId) => {
    try {
      const res = await reviewService.toggleWishlist(propertyId);
      // Refresh wishlist after toggle
      await fetchWishlist();
      return res.data;
    } catch (error) {
      console.error('Failed to toggle wishlist item', error);
      throw error;
    }
  };

  const isFavorited = (propertyId) => {
    return wishlist.some((item) => (item._id || item) === propertyId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isFavorited, loading, refreshWishlist: fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
