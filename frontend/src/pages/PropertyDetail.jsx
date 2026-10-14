import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Star,
  Calendar,
  ShieldCheck,
  User,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { propertyService, bookingService, reviewService } from '../services/apiServices';
import { formatRupiah, formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import PropertyBadges from '../components/property/PropertyBadges';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleWishlist } = useWishlist();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetchPropertyData();
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const [propRes, reviewRes] = await Promise.all([
        propertyService.getPropertyById(id),
        reviewService.getPropertyReviews(id),
      ]);
      setProperty(propRes.data.data);
      setReviews(reviewRes.data.data || []);
    } catch (error) {
      console.error('Error fetching property details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      return navigate('/login');
    }
    if (user.role !== 'tenant') {
      return setBookingError('Hanya akun Penyewa (Tenant) yang dapat melakukan pemesanan.');
    }

    setBookingError('');
    setIsBooking(true);

    try {
      await bookingService.createBooking({
        propertyId: property._id,
        startDate,
        endDate,
        totalPrice: property.price,
        notes: bookingNotes,
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Gagal memproses pemesanan.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    try {
      setReviewError('');
      await reviewService.createReview(id, { rating, comment: reviewComment });
      setReviewComment('');
      fetchPropertyData();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Gagal mengirim ulasan');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Properti tidak ditemukan.</p>
      </div>
    );
  }

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase">
              {property.propertyType}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                property.isAvailable
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {property.isAvailable ? 'Tersedia' : 'Sudah Dipesan'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-xs md:text-sm text-gray-500 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            {property.address?.street}, {property.address?.city}, {property.address?.province}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleWishlist(property._id)}
            className="flex items-center space-x-1"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited(property._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
            <span>{isFavorited(property._id) ? 'Tersimpan' : 'Favorit'}</span>
          </Button>
        </div>
      </div>

      {/* Main Image Banner */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-gray-100 mb-8">
        <img src={mainImage} alt={property.title} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Specifications */}
          <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-100 text-center">
            <div className="flex flex-col items-center">
              <Bed className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-sm font-bold text-gray-800">{property.bedrooms} Kamar</span>
              <span className="text-xs text-gray-400">Tidur</span>
            </div>
            <div className="flex flex-col items-center">
              <Bath className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-sm font-bold text-gray-800">{property.bathrooms} Kamar</span>
              <span className="text-xs text-gray-400">Mandi</span>
            </div>
            <div className="flex flex-col items-center">
              <Maximize className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-sm font-bold text-gray-800">{property.area || '-'} m²</span>
              <span className="text-xs text-gray-400">Luas Bangunan</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi Properti</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Badges */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Fasilitas & Amenities</h3>
            <PropertyBadges items={property.amenities} type="amenity" size="md" />
          </div>

          {/* Rules Badges */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Peraturan & Ketentuan</h3>
            <PropertyBadges items={property.rules} type="rule" size="md" />
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Ulasan & Rating Penyewa</h3>
              <div className="flex items-center text-sm font-semibold text-amber-600">
                <Star className="w-4 h-4 fill-amber-400 mr-1 text-amber-400" />
                {property.rating > 0 ? property.rating.toFixed(1) : 'Belum ada ulasan'} ({reviews.length})
              </div>
            </div>

            {/* Submit Review */}
            {user && user.role === 'tenant' && (
              <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Beri Ulasan</h4>
                {reviewError && <p className="text-xs text-red-600 mb-2">{reviewError}</p>}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs text-gray-500">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-sm ${rating >= star ? 'text-amber-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Bagikan pengalaman tinggal di tempat ini..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg mb-2 focus:ring-1 focus:ring-blue-500"
                ></textarea>
                <Button type="submit" size="sm" variant="primary">Kirim Ulasan</Button>
              </form>
            )}

            {/* Review List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Belum ada ulasan untuk tempat ini.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-800">{rev.user?.name || 'Penyewa'}</span>
                      <span className="text-xs text-gray-400">{formatDate(rev.createdAt)}</span>
                    </div>
                    <div className="flex text-amber-400 text-xs mb-1">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <p className="text-xs text-gray-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Booking Box Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="mb-4">
              <span className="text-xs text-gray-400">Harga Sewa:</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black text-blue-600">
                  {formatRupiah(property.price)}
                </span>
                <span className="text-xs text-gray-500">
                  /{property.pricePeriod === 'monthly' ? 'bulan' : property.pricePeriod === 'yearly' ? 'tahun' : 'malam'}
                </span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-800">Booking Berhasil Dikirim!</h4>
                <p className="text-xs text-emerald-700">
                  Permintaan sewa Anda menunggu konfirmasi dari pemilik properti. Anda dapat memantau statusnya di dashboard.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/tenant/dashboard')}
                  className="w-full mt-2"
                >
                  Lihat Dashboard Saya
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                {bookingError && (
                  <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Mulai Sewa</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Selesai Sewa</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Jumlah orang yang akan tinggal..."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5"
                  disabled={!property.isAvailable || isBooking}
                >
                  {isBooking ? 'Memproses...' : property.isAvailable ? 'Ajukan Sewa Sekarang' : 'Tidak Tersedia'}
                </Button>
              </form>
            )}

            {/* Owner Details Card */}
            {property.owner && (
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {property.owner.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Pemilik Properti:</span>
                  <span className="text-xs font-bold text-gray-800">{property.owner.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
