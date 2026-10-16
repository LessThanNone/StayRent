import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Heart,
  Star,
  ShieldCheck,
  Calendar,
  MessageCircle,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Home,
} from 'lucide-react';
import { propertyService, bookingService, reviewService } from '../services/apiServices';
import { formatRupiah, formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import PropertyBadges from '../components/property/PropertyBadges';
import Button from '../components/ui/Button';

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

  const today = new Date().toISOString().split('T')[0];

  // Calculate duration and total price based on pricePeriod
  const calcBooking = () => {
    if (!startDate || !endDate || !property) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    if (diffMs <= 0) return null;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (property.pricePeriod === 'daily') {
      return { units: diffDays, label: `${diffDays} night(s)`, total: diffDays * property.price };
    }
    if (property.pricePeriod === 'monthly') {
      const months = Math.ceil(diffDays / 30);
      return { units: months, label: `${months} month(s)`, total: months * property.price };
    }
    if (property.pricePeriod === 'yearly') {
      const years = Math.ceil(diffDays / 365);
      return { units: years, label: `${years} year(s)`, total: years * property.price };
    }
    return { units: 1, label: '1 period', total: property.price };
  };

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchPropertyData();
    window.scrollTo(0, 0);
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
      return setBookingError('Only Tenant accounts can submit a rental request.');
    }
    if (!startDate || !endDate) {
      return setBookingError('Please select a start and end date for your rental.');
    }
    if (endDate <= startDate) {
      return setBookingError('The end date must be after the start date.');
    }

    const calc = calcBooking();
    if (!calc) {
      return setBookingError('Invalid dates, please check again.');
    }

    setBookingError('');
    setIsBooking(true);

    try {
      await bookingService.createBooking({
        propertyId: property._id,
        startDate,
        endDate,
        totalPrice: calc.total,
        notes: bookingNotes,
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to process booking.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    try {
      setSubmittingReview(true);
      setReviewError('');
      await reviewService.createReview(id, { rating, comment: reviewComment });
      setReviewComment('');
      fetchPropertyData();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // WhatsApp redirection
  const handleWhatsAppChat = () => {
    const phone = property.owner?.phone ? property.owner.phone.replace(/[^0-9]/g, '') : '6281234567890';
    const message = encodeURIComponent(
      `Hi ${property.owner?.name || 'Property Owner'}, I'm interested in renting a property on StayRent: "${property.title}" (${window.location.href}). Is this unit still available?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl w-1/3 mb-4"></div>
        <div className="h-96 bg-gray-200 rounded-3xl mb-8"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-ink mb-1">Property Not Found</h2>
        <p className="text-xs text-mutedtext mb-6">
          This listing may have been removed by the owner or the URL is incorrect.
        </p>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const periodLabel =
    property.pricePeriod === 'monthly'
      ? 'month'
      : property.pricePeriod === 'yearly'
      ? 'year'
      : 'night';

  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header: Title, Location, and Action Buttons */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1 rounded-full border border-brand-100">
                {property.propertyType}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  property.isAvailable
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {property.isAvailable ? '● Available' : '● Fully Booked'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
              {property.title}
            </h1>

            <p className="text-xs md:text-sm text-mutedtext flex items-center mt-2">
              <MapPin className="w-4 h-4 mr-1 text-brand-700 flex-shrink-0" />
              <span>
                {property.address?.street}, {property.address?.city}, {property.address?.province}
              </span>
            </p>
          </div>

          {/* Social / Wishlist Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => toggleWishlist(property._id)}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                isFavorited(property._id)
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-gray-200 text-ink hover:bg-gray-50'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited(property._id) ? 'fill-rose-500 text-rose-500' : 'text-gray-600'
                }`}
              />
              <span>{isFavorited(property._id) ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid ala Airbnb / Rukita */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden mb-10 aspect-[16/9] md:aspect-[21/9]">
        <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-gray-100">
          <img
            src={images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
        </div>
        <div className="hidden md:block relative group overflow-hidden bg-gray-100">
          <img
            src={images[1] || images[0]}
            alt="Interior 1"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="hidden md:block relative group overflow-hidden bg-gray-100">
          <img
            src={images[2] || images[0]}
            alt="Interior 2"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="hidden md:block relative group overflow-hidden bg-gray-100">
          <img
            src={images[0]}
            alt="Interior 3"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="hidden md:block relative group overflow-hidden bg-gray-100">
          <img
            src={images[1] || images[0]}
            alt="Interior 4"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ================= LEFT COLUMN: WIDE (~65%) ================= */}
        <div className="lg:col-span-8 space-y-10">
          {/* Quick Specs Bar ala Rukita */}
          <div className="bg-surface-warm p-5 rounded-2xl border border-hairline grid grid-cols-3 divide-x divide-gray-200 text-center">
            <div className="px-3">
              <Bed className="w-5 h-5 text-brand-700 mx-auto mb-1 stroke-[2]" />
              <span className="text-sm font-bold text-ink block">{property.bedrooms} Bedroom(s)</span>
              <span className="text-[11px] text-mutedtext">Ready to Move</span>
            </div>
            <div className="px-3">
              <Bath className="w-5 h-5 text-brand-700 mx-auto mb-1 stroke-[2]" />
              <span className="text-sm font-bold text-ink block">{property.bathrooms} Bathroom(s)</span>
              <span className="text-[11px] text-mutedtext">Equipped</span>
            </div>
            <div className="px-3">
              <Maximize2 className="w-5 h-5 text-brand-700 mx-auto mb-1 stroke-[2]" />
              <span className="text-sm font-bold text-ink block">{property.area || 36} m²</span>
              <span className="text-[11px] text-mutedtext">Building Area</span>
            </div>
          </div>

          {/* Host / Owner Info Card */}
          {property.owner && (
            <div className="p-5 rounded-2xl border border-hairline bg-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-800 font-extrabold text-base flex items-center justify-center border border-brand-200">
                  {property.owner.name?.charAt(0) || 'H'}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-sm text-ink">{property.owner.name}</span>
                    <span className="bg-brand-50 text-brand-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-0.5" />
                      Verified
                    </span>
                  </div>
                  <span className="text-xs text-mutedtext block mt-0.5">
                    Responds to rental requests within hours
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppChat}
                className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact Owner</span>
              </button>
            </div>
          )}

          {/* Section: Description */}
          <div className="border-b border-hairline pb-8">
            <h2 className="text-lg font-bold text-ink mb-3 tracking-tight">
              About This Property
            </h2>
            <p className="text-sm text-bodytext leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Section: Amenities Badges */}
          <div className="border-b border-hairline pb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-ink tracking-tight">Amenities</h2>
                <p className="text-xs text-mutedtext">Facilities provided and included in the rental price</p>
              </div>
            </div>
            <PropertyBadges items={property.amenities} type="amenity" variant="blocks" />
          </div>

          {/* Section: House Rules — split diperbolehkan / tidak diperbolehkan */}
          <div className="border-b border-hairline pb-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-ink tracking-tight">House Rules</h2>
            </div>
            {(() => {
              const prohibited = (property.rules || []).filter(r =>
                r.toLowerCase().startsWith('no ') ||
                r.toLowerCase().includes('not allowed') ||
                r.toLowerCase().includes('limited')
              );
              const allowed = (property.rules || []).filter(r =>
                !prohibited.includes(r)
              );
              return (
                <div className="space-y-5">
                  {allowed.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Allowed</p>
                      <PropertyBadges items={allowed} type="rule" variant="blocks" />
                    </div>
                  )}
                  {prohibited.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-2">Not Allowed</p>
                      <PropertyBadges items={prohibited} type="rule" variant="blocks" />
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Section: Reviews & Ratings ala Airbnb */}
          <div className="pb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-xl font-extrabold text-ink">
                    {property.rating > 0 ? property.rating.toFixed(1) : 'No Ratings Yet'}
                  </span>
                  <span className="text-sm text-mutedtext font-medium">
                    ({reviews.length} tenant review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <p className="text-xs text-mutedtext mt-1">
                  Genuine reviews from tenants who have stayed in this unit
                </p>
              </div>
            </div>

            {/* Write Review Form (For Tenants) */}
            {user && user.role === 'tenant' && (
              <form onSubmit={handleReviewSubmit} className="mb-8 p-5 bg-surface-warm rounded-2xl border border-hairline">
                <h3 className="text-base font-medium text-ink mb-3">
                  Write your review
                </h3>
                {reviewError && (
                  <p className="text-xs text-rose-600 mb-2 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {reviewError}
                  </p>
                )}

                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-xs font-semibold text-gray-700">Rate:</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder="Share about the room condition, owner's hospitality, cleanliness, and neighborhood atmosphere..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-1 focus:ring-brand-700"
                ></textarea>

                <Button type="submit" size="sm" variant="primary" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            )}

            {/* Review Cards Grid */}
            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs text-mutedtext">
                  No reviews yet for this place. Be the first tenant to leave a review!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl border border-hairline bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center">
                            {rev.user?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-ink block leading-tight">
                              {rev.user?.name || 'Tenant'}
                            </span>
                            <span className="text-[10px] text-mutedtext">
                              {formatDate(rev.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex text-amber-400 text-xs">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-bodytext leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: STICKY CARD ALA AIRBNB (~35%) ================= */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-hairline shadow-sticky-card">
            {/* Price & Rating Header */}
            <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-hairline">
              <div>
                <span className="text-2xl font-extrabold text-ink tracking-tight">
                  {formatRupiah(property.price)}
                </span>
                <span className="text-xs text-mutedtext font-medium ml-1">
                  /{periodLabel}
                </span>
              </div>

              <div className="flex items-center text-xs font-bold text-ink">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                <span>{property.rating > 0 ? property.rating.toFixed(1) : 'New'}</span>
              </div>
            </div>

            {/* Booking State Handler */}
            {bookingSuccess ? (
              <div className="p-5 bg-emerald-50 rounded-2xl text-center space-y-3 border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">
                  Rental Request Sent!
                </h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Your request has been sent to the owner's dashboard. You can periodically check the confirmation status.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/tenant/dashboard')}
                  className="w-full mt-2"
                >
                  View My Rental History
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                {bookingError && (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center space-x-2 border border-rose-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Date Picker Segment ala Airbnb */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
                  <div className="p-3 bg-gray-50/50">
                    <label className="block text-xs font-medium text-mutedtext">
                      Start Date (Check-in)
                    </label>
                    <input
                      type="date"
                      required
                      min={today}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (endDate && endDate <= e.target.value) setEndDate('');
                      }}
                      className="w-full bg-transparent text-xs text-ink font-semibold focus:outline-none pt-1"
                    />
                  </div>
                  <div className="p-3 bg-gray-50/50">
                    <label className="block text-xs font-medium text-mutedtext">
                      End Date (Check-out)
                    </label>
                    <input
                      type="date"
                      required
                      min={startDate || today}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-transparent text-xs text-ink font-semibold focus:outline-none pt-1"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Planning to move in on the 1st, bringing a motorcycle..."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-700"
                  ></textarea>
                </div>

                {/* Price Breakdown Calculation */}
                {(() => {
                  const calc = calcBooking();
                  return (
                    <div className="pt-3 border-t border-hairline space-y-2 text-xs text-mutedtext">
                      <div className="flex justify-between">
                        <span>
                          {formatRupiah(property.price)}/{periodLabel}
                          {calc ? ` × ${calc.label}` : ''}
                        </span>
                        <span className="font-semibold text-ink">
                          {calc ? formatRupiah(calc.total) : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service & Admin Fee</span>
                        <span className="text-emerald-600 font-semibold">Free (Rp 0)</span>
                      </div>
                      <div className="pt-2 border-t border-hairline flex justify-between text-sm font-bold text-ink">
                        <span>Estimated Total</span>
                        <span className="text-brand-700">
                          {calc ? formatRupiah(calc.total) : '—'}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Primary CTA: Book Now */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3.5 text-sm"
                  disabled={!property.isAvailable || isBooking}
                >
                  {isBooking
                    ? 'Processing...'
                    : property.isAvailable
                    ? 'Book Now'
                    : 'Unit Fully Booked'}
                </Button>

                {/* Secondary CTA: Chat via WhatsApp */}
                <Button
                  type="button"
                  variant="whatsapp"
                  onClick={handleWhatsAppChat}
                  className="w-full py-3 text-xs flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat via WhatsApp</span>
                </Button>

                <p className="text-[11px] text-center text-mutedtext mt-2">
                  You will not be charged at this stage of the request.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
