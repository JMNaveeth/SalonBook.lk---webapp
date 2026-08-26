import React, { useEffect, useState } from 'react';
import { getMyShopApi } from '../../api/shopApi';
import {
  getShopBookingsApi,
  acceptBookingApi,
  rejectBookingApi,
  rescheduleBookingApi,
  reassignStaffApi,
  completeBookingApi,
  noShowBookingApi,
} from '../../api/bookingApi';
import { getStaffByShopApi } from '../../api/staffApi';
import AppointmentCard from '../../components/owner/AppointmentCard';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { useToast } from '../../hooks/useToast';
import { Calendar as CalendarIcon, Filter, RefreshCw, UserCheck, AlertOctagon } from 'lucide-react';

const AppointmentCalendar = () => {
  const [shop, setShop] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [targetBooking, setTargetBooking] = useState(null);

  // Form states
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00:00');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  const toast = useToast();

  const loadData = async () => {
    try {
      const sRes = await getMyShopApi();
      const shopObj = sRes.data.data;
      setShop(shopObj);
      if (shopObj) {
        const [bRes, stRes] = await Promise.all([
          getShopBookingsApi(shopObj.id),
          getStaffByShopApi(shopObj.id),
        ]);
        setBookings(bRes.data.data || []);
        setStaffList(stRes.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (booking) => {
    try {
      await acceptBookingApi(booking.id, { owner_note: 'Accepted by owner' });
      toast.success('Booking accepted!');
      loadData();
    } catch (err) {
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async (booking) => {
    const reason = window.prompt('Reason for rejecting booking?', 'Owner unavailable');
    if (reason === null) return;
    try {
      await rejectBookingApi(booking.id, { owner_note: reason });
      toast.success('Booking rejected and slot released');
      loadData();
    } catch (err) {
      toast.error('Failed to reject booking');
    }
  };

  const handleOpenReschedule = (booking) => {
    setTargetBooking(booking);
    setRescheduleDate(booking.booking_date);
    setRescheduleTime(booking.booking_time);
    setRescheduleReason('');
    setRescheduleModalOpen(true);
  };

  const handleSubmitReschedule = async () => {
    try {
      await rescheduleBookingApi(targetBooking.id, {
        reschedule_date: rescheduleDate,
        reschedule_time: rescheduleTime,
        reschedule_reason: rescheduleReason,
      });
      toast.success('Reschedule request sent to customer!');
      setRescheduleModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Failed to propose reschedule');
    }
  };

  const handleOpenReassign = (booking) => {
    setTargetBooking(booking);
    setSelectedStaffId(booking.staff_id || (staffList[0]?.id || ''));
    setReassignModalOpen(true);
  };

  const handleSubmitReassign = async () => {
    try {
      await reassignStaffApi(targetBooking.id, { staff_id: selectedStaffId });
      toast.success('Staff reassigned!');
      setReassignModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Failed to reassign staff');
    }
  };

  const handleComplete = async (booking) => {
    try {
      await completeBookingApi(booking.id);
      toast.success('Marked as completed!');
      loadData();
    } catch (err) {
      toast.error('Failed to mark complete');
    }
  };

  const handleNoShow = async (booking) => {
    if (!window.confirm('Mark customer as NO-SHOW? Warning strike will be added to their account.')) return;
    try {
      await noShowBookingApi(booking.id);
      toast.error('Marked as NO-SHOW. Customer strike counter updated.');
      loadData();
    } catch (err) {
      toast.error('Failed to mark no-show');
    }
  };

  const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter);

  if (loading) return <Loader message="Loading appointment calendar..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-primary-500" />
            <span>Appointment Management</span>
          </h1>
          <p className="text-xs text-neutral-500">Manage incoming bookings, accept/reject, reschedule, or reassign staff</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none shadow-sm"
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No-Show</option>
          </select>
        </div>
      </div>

      {/* Grid of Appointment Cards */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <AppointmentCard
              key={booking.id}
              booking={booking}
              onAccept={handleAccept}
              onReject={handleReject}
              onReschedule={handleOpenReschedule}
              onReassign={handleOpenReassign}
              onComplete={handleComplete}
              onNoShow={handleNoShow}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-neutral-200 text-neutral-500 text-sm">
          No appointments found matching this status filter.
        </div>
      )}

      {/* Reschedule Modal */}
      <Modal isOpen={rescheduleModalOpen} onClose={() => setRescheduleModalOpen(false)} title="Propose New Appointment Time">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">New Date</label>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">New Time</label>
            <input
              type="time"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Reason for Reschedule</label>
            <textarea
              rows="3"
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              placeholder="e.g. Stylist is unavailable at the original slot..."
              className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={() => setRescheduleModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-neutral-600">
              Cancel
            </button>
            <button onClick={handleSubmitReschedule} className="bg-blue-600 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow">
              Send Reschedule Proposal
            </button>
          </div>
        </div>
      </Modal>

      {/* Reassign Staff Modal */}
      <Modal isOpen={reassignModalOpen} onClose={() => setReassignModalOpen(false)} title="Reassign Staff Member">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Select Staff Member</label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            >
              {staffList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={() => setReassignModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-neutral-600">
              Cancel
            </button>
            <button onClick={handleSubmitReassign} className="bg-primary-500 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow">
              Reassign Staff
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentCalendar;
