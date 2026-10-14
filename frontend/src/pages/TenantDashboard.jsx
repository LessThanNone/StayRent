import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingService } from '../services/apiServices';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { formatRupiah, formatDate } from '../utils/formatters';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/ui/Button';
import { Calendar, Heart, User, CheckCircle, Clock, XCircle } from 'lucide-react';

const TenantDashboard = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'wishlist' ? 'wishlist' : 'bookings';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      setBookings(res.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pengajuan sewa ini?')) {
      try {
        await bookingService.updateBookingStatus(bookingId, 'cancelled');
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal membatalkan booking');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 flex items-center space-x-1"><CheckCircle className="w-3 h-3" /><span>Disetujui</span></span>;
      case 'pending':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 flex items-center space-x-1"><Clock className="w-3 h-3" /><span>Menunggu Konfirmasi</span></span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">Dibatalkan</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 flex items-center space-x-1"><XCircle className="w-3 h-3" /><span>Ditolak</span></span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-xs text-gray-500">{user?.email} • {user?.phone || 'Belum ada telepon'}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 uppercase">
              Penyewa (Tenant)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'bookings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Pengajuan Sewa ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'wishlist'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Properti Favorit ({wishlist.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookings' ? (
        <div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-xs text-gray-500">Anda belum pernah melakukan pemesanan sewa.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.property?.title || 'Properti'}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Periode: {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </p>
                    <p className="text-xs font-semibold text-blue-600 mt-1">
                      Total: {formatRupiah(booking.totalPrice)}
                    </p>
                    {booking.notes && (
                      <p className="text-xs text-gray-400 mt-1 italic">Catatan: "{booking.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                    {getStatusBadge(booking.status)}
                    {booking.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-600 hover:bg-red-50 text-xs"
                      >
                        Batalkan
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {wishlist.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-xs text-gray-500">Belum ada properti yang Anda simpan ke wishlist.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <PropertyCard key={item._id} property={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;
