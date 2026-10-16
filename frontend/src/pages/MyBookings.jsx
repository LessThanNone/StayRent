import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/apiServices';
import { formatRupiah, formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  ArrowRight,
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
          Cancel rental request?
        </h3>
        <p className="text-sm text-mutedtext text-center mb-6 leading-relaxed">
          This action cannot be undone. The rental request will be removed from the active list.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-medium text-ink border border-hairline rounded-xl hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MyBookings = () => {
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
      console.error(error.response?.data?.message || 'Failed to cancel booking');
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
            <span>Approved (Booked)</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Confirmation</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
            <span>Cancelled</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected</span>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Tenant Portal
          </span>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight mt-2">
            Rental History & Status
          </h1>
          <p className="text-xs text-mutedtext mt-0.5">
            Track the verification and confirmation status of your rental bookings
          </p>
        </div>
        <Link to="/">
          <Button variant="secondary" size="sm">
            <span>Find Other Properties</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-surface-warm rounded-3xl border border-hairline p-12 text-center max-w-md mx-auto">
          <Building className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-ink">No Rental History Yet</h3>
          <p className="text-xs text-mutedtext mt-1 mb-6">
            You haven't submitted any rental requests. Find your ideal place now!
          </p>
          <Link to="/">
            <Button variant="primary" size="sm">Explore Properties</Button>
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
                      {booking.property?.title || 'Rental Property'}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-mutedtext mt-1.5">
                    <span>
                      Duration: <strong className="text-ink">{formatDate(booking.startDate)} – {formatDate(booking.endDate)}</strong>
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
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default MyBookings;
