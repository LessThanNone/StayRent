import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { bookingService } from '../services/apiServices';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { formatRupiah, formatDate } from '../utils/formatters';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/ui/Button';
import {
  Calendar,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  AlertCircle,
} from 'lucide-react';

const CancelModal = ({ onConfirm, onCancel, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative z-10 p-2 bg-white/60 ring-1 ring-rose-100/60 rounded-[1.5rem] w-full max-w-sm shadow-rukita-lg">
      <div className="bg-white rounded-[1.125rem] p-6" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.95)' }}>
        <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-5 h-5 text-rose-500 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-ink text-center tracking-snug mb-1">
          Batalkan pengajuan sewa?
        </h3>
        <p className="text-sm text-mutedtext text-center mb-6 leading-relaxed">
          Tindakan ini tidak dapat dibatalkan. Pengajuan sewa akan dihapus dari daftar aktif.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-medium text-ink border border-hairline rounded-xl hover:bg-gray-50 transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Membatalkan...' : 'Ya, Batalkan'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const TenantDashboard = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'wishlist' ? 'wishlist' : 'bookings';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleCancelBooking = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      await bookingService.updateBookingStatus(cancelTarget, 'cancelled');
      setCancelTarget(null);
      fetchBookings();
    } catch (error) {
      console.error(error.response?.data?.message || 'Gagal membatalkan booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Disetujui (Booked)</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Menunggu Konfirmasi</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
            <span>Dibatalkan</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {cancelTarget && (
        <CancelModal
          onConfirm={handleCancelBooking}
          onCancel={() => setCancelTarget(null)}
          isLoading={isCancelling}
        />
      )}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Double-Bezel Profile Card */}
      <div className="p-2 bg-brand-50/40 ring-1 ring-brand-100/60 rounded-[1.75rem] mb-10">
        <div
          className="bg-white rounded-[1.375rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}
        >
          <div className="flex items-center space-x-4">
            {/* Avatar with double-bezel */}
            <div className="p-1 bg-brand-100/60 ring-1 ring-brand-200/40 rounded-2xl flex-shrink-0">
              <div className="w-14 h-14 rounded-[0.875rem] bg-brand-500 text-white flex items-center justify-center font-semibold text-2xl shadow-btn">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold tracking-snug text-ink">{user?.name}</h1>
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-100">
                  Penyewa
                </span>
              </div>
              <p className="text-sm text-mutedtext mt-1">
                {user?.email} · {user?.phone || 'Nomor HP belum diatur'}
              </p>
            </div>
          </div>

          <Link to="/">
            <Button variant="secondary" size="sm">
              Cari Hunian Lainnya
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs ala Rukita & Airbnb */}
      <div className="flex border-b border-hairline mb-8">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3.5 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === 'bookings'
              ? 'border-brand-700 text-brand-800'
              : 'border-transparent text-mutedtext hover:text-ink'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Pengajuan Sewa ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3.5 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === 'wishlist'
              ? 'border-brand-700 text-brand-800'
              : 'border-transparent text-mutedtext hover:text-ink'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Properti Favorit ({wishlist.length})</span>
        </button>
      </div>

      {/* Tab 1: Bookings */}
      {activeTab === 'bookings' ? (
        <div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-surface-warm rounded-3xl border border-hairline p-12 text-center max-w-md mx-auto">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
              <h3 className="text-base font-bold text-ink">Belum Ada Pengajuan Sewa</h3>
              <p className="text-xs text-mutedtext mt-1 mb-6">
                Anda belum pernah mengajukan reservasi sewa. Temukan hunian impian Anda sekarang!
              </p>
              <Link to="/">
                <Button variant="primary" size="sm">Jelajahi Properti</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-hairline p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-gray-200 transition-colors shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    {booking.property?.images && booking.property.images.length > 0 && (
                      <img
                        src={booking.property.images[0]}
                        alt={booking.property.title}
                        className="w-20 h-20 rounded-xl object-cover hidden sm:block flex-shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full uppercase">
                          {booking.property?.propertyType || 'Properti'}
                        </span>
                        <span className="text-xs text-mutedtext">
                          ID: #{booking._id.slice(-6)}
                        </span>
                      </div>

                      <Link to={`/properties/${booking.property?._id}`}>
                        <h3 className="font-bold text-ink text-base hover:text-brand-700 transition-colors mt-1">
                          {booking.property?.title || 'Properti Sewa'}
                        </h3>
                      </Link>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-mutedtext mt-1.5">
                        <span>
                          Durasi: <strong className="text-ink">{formatDate(booking.startDate)} – {formatDate(booking.endDate)}</strong>
                        </span>
                        <span>
                          Total: <strong className="text-brand-800">{formatRupiah(booking.totalPrice)}</strong>
                        </span>
                      </div>

                      {booking.notes && (
                        <p className="text-xs text-mutedtext italic mt-2 bg-gray-50 p-2 rounded-lg inline-block">
                          "{booking.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                    {getStatusBadge(booking.status)}

                    {booking.status === 'pending' && (
                      <button
                        onClick={() => setCancelTarget(booking._id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
                      >
                        Batalkan Sewa
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Wishlist */
        <div>
          {wishlist.length === 0 ? (
            <div className="bg-surface-warm rounded-3xl border border-hairline p-12 text-center max-w-md mx-auto">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
              <h3 className="text-base font-bold text-ink">Wishlist Masih Kosong</h3>
              <p className="text-xs text-mutedtext mt-1 mb-6">
                Simpan unit hunian favorit Anda dengan menekan ikon hati pada kartu properti.
              </p>
              <Link to="/">
                <Button variant="primary" size="sm">Jelajahi Properti</Button>
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
      )}
    </div>
    </>
  );
};

export default TenantDashboard;
