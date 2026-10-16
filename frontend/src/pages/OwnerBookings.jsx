import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/apiServices';
import { formatRupiah, formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import {
  User,
  Phone,
  Check,
  X,
  ArrowLeft,
  Building,
  AlertCircle,
} from 'lucide-react';

const OwnerBookings = () => {
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getOwnerBookings();
      setIncomingBookings(res.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    setActionError('');
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      fetchBookings();
    } catch (error) {
      setActionError(error.response?.data?.message || 'Gagal mengubah status booking');
    }
  };

  const pendingCount = incomingBookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              to="/owner/dashboard"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight mt-2">
            Manage Incoming Bookings
          </h1>
          <p className="text-xs text-mutedtext mt-0.5">
            Review reservations from prospective tenants, verify stay dates, and give your approval
          </p>
        </div>

        {pendingCount > 0 && (
          <span className="px-3 py-1.5 rounded-full text-xs bg-amber-500 text-white font-bold shadow-sm">
            {pendingCount} Requests Pending Confirmation
          </span>
        )}
      </div>

      {actionError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 stroke-[1.5]" />
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : incomingBookings.length === 0 ? (
        <div className="bg-surface-warm rounded-3xl border border-hairline p-12 text-center max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-ink">No Incoming Requests</h3>
          <p className="text-xs text-mutedtext mt-1 mb-6">
            Rental requests from prospective tenants will appear here for you to approve or reject.
          </p>
          <Link to="/owner/dashboard">
            <Button variant="primary" size="sm">Back to Dashboard</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {incomingBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-hairline p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-sm hover:border-gray-200 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full uppercase">
                    ID: #{b._id.slice(-6)}
                  </span>
                  <span className="text-xs text-mutedtext font-medium">
                    Submitted {formatDate(b.createdAt)}
                  </span>
                </div>

                <h4 className="font-bold text-ink text-base mt-1">{b.property?.title}</h4>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-mutedtext mt-2">
                  <span className="flex items-center text-ink font-semibold">
                    <User className="w-3.5 h-3.5 mr-1 text-brand-700" />
                    {b.tenant?.name}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {b.tenant?.phone || b.tenant?.email}
                  </span>
                  <span>
                    {formatDate(b.startDate)} – {formatDate(b.endDate)}
                  </span>
                  <span>
                    Total: <strong className="text-brand-800">{formatRupiah(b.totalPrice)}</strong>
                  </span>
                </div>

                {b.notes && (
                  <p className="text-xs text-mutedtext italic mt-2 bg-gray-50 p-2 rounded-lg inline-block">
                    Tenant note: "{b.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
                    b.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : b.status === 'rejected'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {b.status === 'approved' ? 'Approved (Booked)' : b.status}
                </span>

                {b.status === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBookingAction(b._id, 'approved')}
                      className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleBookingAction(b._id, 'rejected')}
                      className="inline-flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
