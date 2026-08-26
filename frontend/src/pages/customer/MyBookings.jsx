import React, { useEffect, useState } from 'react';
import { getMyBookingsApi, confirmRescheduleApi, declineRescheduleApi } from '../../api/bookingApi';
import { submitReviewApi } from '../../api/reviewApi';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import StarRating from '../../components/common/StarRating';
import Loader from '../../components/common/Loader';
import { formatDate, formatTime } from '../../utils/formatDate';
import { formatLKR } from '../../utils/formatCurrency';
import { useToast } from '../../hooks/useToast';
import { Calendar, Clock, MapPin, Star, AlertCircle, RefreshCw } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const toast = useToast();

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBookingsApi();
      setBookings(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirmReschedule = async (bookingId) => {
    try {
      await confirmRescheduleApi(bookingId);
      toast.success('Reschedule confirmed!');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to confirm reschedule');
    }
  };

  const handleDeclineReschedule = async (bookingId) => {
    try {
      await declineRescheduleApi(bookingId);
      toast.success('Reschedule declined');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to decline reschedule');
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setRating(5);
    setComment('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      toast.error('Please write a short comment about your experience');
      return;
    }

    setSubmittingReview(true);
    try {
      await submitReviewApi({
        booking_id: selectedBookingForReview.id,
        shop_id: selectedBookingForReview.shop_id,
        rating,
        comment,
      });
      toast.success('Review submitted successfully!');
      setReviewModalOpen(false);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filterBookings = () => {
    if (activeTab === 'upcoming') {
      return bookings.filter((b) => ['pending', 'accepted', 'rescheduled'].includes(b.status));
    }
    if (activeTab === 'past') {
      return bookings.filter((b) => b.status === 'completed');
    }
    if (activeTab === 'cancelled') {
      return bookings.filter((b) => ['cancelled', 'rejected', 'no_show'].includes(b.status));
    }
    return bookings;
  };

  const displayedList = filterBookings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">My Appointments</h1>
        <p className="text-xs text-neutral-500">Track and manage your salon bookings in Sri Lanka</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 space-x-6 text-sm font-semibold">
        {['upcoming', 'past', 'cancelled'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-3 capitalize border-b-2 transition-all ${
              activeTab === t
                ? 'border-primary-500 text-primary-600 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <Loader message="Loading appointment history..." />
      ) : displayedList.length > 0 ? (
        <div className="space-y-4">
          {displayedList.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center space-x-3">
                  <Badge status={booking.status} />
                  <span className="text-xs text-neutral-400 font-mono">#{booking.id.substring(0, 8)}</span>
                </div>
                <span className="font-mono font-bold text-sm text-neutral-900">{formatLKR(booking.service_price)}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-neutral-900">{booking.shop_name}</h3>
                  <p className="text-xs font-semibold text-primary-600">{booking.service_name}</p>
                  <div className="flex items-center space-x-3 text-xs text-neutral-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formatDate(booking.booking_date)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formatTime(booking.booking_time)}</span>
                    </span>
                  </div>
                </div>

                {/* Reschedule Proposal Alert Box */}
                {booking.status === 'rescheduled' && (
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs space-y-2 max-w-sm">
                    <div className="flex items-center space-x-1.5 font-bold text-blue-900">
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                      <span>New Time Proposed:</span>
                    </div>
                    <p className="text-blue-800">
                      {formatDate(booking.reschedule_date)} at {formatTime(booking.reschedule_time)}
                    </p>
                    {booking.reschedule_reason && (
                      <p className="text-blue-600 italic">"{booking.reschedule_reason}"</p>
                    )}
                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={() => handleConfirmReschedule(booking.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineReschedule(booking.id)}
                        className="bg-white hover:bg-neutral-100 text-rose-600 border border-rose-200 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* Completed Leave Review Action */}
                {booking.status === 'completed' && !booking.review_id && (
                  <button
                    onClick={() => handleOpenReviewModal(booking)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow transition-all"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    <span>Leave Review</span>
                  </button>
                )}

                {booking.status === 'completed' && booking.review_id && (
                  <span className="text-xs font-semibold text-secondary-600 bg-secondary-50 px-3 py-1.5 rounded-xl border border-secondary-200">
                    ✓ Reviewed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-neutral-200 text-neutral-500">
          No appointments found in this category.
        </div>
      )}

      {/* Review Submission Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Rate Your Salon Experience">
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h4 className="font-bold text-base text-neutral-900">{selectedBookingForReview?.shop_name}</h4>
            <p className="text-xs text-neutral-500">{selectedBookingForReview?.service_name}</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase">Select Rating</label>
            <StarRating rating={rating} onRate={(r) => setRating(r)} size="lg" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Your Review</label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about the hair cut, service cleanliness, staff friendliness..."
              className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={submittingReview}
              onClick={handleSubmitReview}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-2 rounded-xl text-sm shadow transition-colors"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
