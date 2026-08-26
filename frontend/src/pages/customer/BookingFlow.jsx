import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { getShopByIdApi } from '../../api/shopApi';
import { getServicesByShopApi } from '../../api/serviceApi';
import { getStaffByShopApi } from '../../api/staffApi';
import { getAvailableSlotsApi } from '../../api/timeslotApi';
import { createBookingApi } from '../../api/bookingApi';
import TimeSlotPicker from '../../components/customer/TimeSlotPicker';
import Loader from '../../components/common/Loader';
import { formatLKR } from '../../utils/formatCurrency';
import { useToast } from '../../hooks/useToast';
import { Scissors, User, Calendar, Clock, CheckCircle2, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';

const BookingFlow = () => {
  const { shopId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Selection states
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null); // null = Any
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Load shop, services, staff
  useEffect(() => {
    const initData = async () => {
      try {
        const [shopRes, servRes, staffRes] = await Promise.all([
          getShopByIdApi(shopId),
          getServicesByShopApi(shopId),
          getStaffByShopApi(shopId),
        ]);

        setShop(shopRes.data.data);
        const sList = servRes.data.data || [];
        setServices(sList);
        setStaffList(staffRes.data.data || []);

        const preselectedServiceId = searchParams.get('serviceId');
        if (preselectedServiceId) {
          const found = sList.find((s) => s.id === preselectedServiceId);
          if (found) setSelectedService(found);
        }
      } catch (err) {
        toast.error('Failed to load salon booking details');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [shopId, searchParams]);

  // Fetch slots whenever date or staff changes
  useEffect(() => {
    if (step >= 4 && selectedDate) {
      const fetchSlots = async () => {
        setSlotsLoading(true);
        try {
          const res = await getAvailableSlotsApi(shopId, selectedDate, selectedStaff?.id || null);
          setAvailableSlots(res.data.data || []);
        } catch (err) {
          console.error(err);
        } finally {
          setSlotsLoading(false);
        }
      };
      fetchSlots();
    }
  }, [shopId, selectedDate, selectedStaff, step]);

  const handleCreateBooking = async () => {
    if (!selectedService || !selectedSlot) {
      toast.error('Please select service and time slot');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        shop_id: shopId,
        service_id: selectedService.id,
        staff_id: selectedStaff?.id || null,
        slot_id: selectedSlot.id,
        booking_date: selectedDate,
        booking_time: selectedSlot.slot_time,
        customer_note: customerNote,
        payment_method: paymentMethod,
      };

      const res = await createBookingApi(payload);
      setCreatedBooking(res.data.data);
      setStep(6); // Success screen
      toast.success('Booking request submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Setting up booking wizard..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Wizard Progress Bar */}
      {step < 6 && (
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 mb-2">
            <span>Step {step} of 5</span>
            <span className="text-primary-600 font-bold">
              {step === 1 && 'Select Service'}
              {step === 2 && 'Select Staff'}
              {step === 3 && 'Select Date'}
              {step === 4 && 'Select Time Slot'}
              {step === 5 && 'Confirm & Payment'}
            </span>
          </div>
          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-500 h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
          <h2 className="text-xl font-display font-bold text-neutral-900 flex items-center space-x-2">
            <Scissors className="w-5 h-5 text-primary-500" />
            <span>Step 1: Choose Service</span>
          </h2>
          <div className="space-y-3">
            {services.map((ser) => {
              const isSelected = selectedService?.id === ser.id;
              return (
                <div
                  key={ser.id}
                  onClick={() => setSelectedService(ser)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/40 ring-2 ring-primary-200'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">{ser.name}</h4>
                    <p className="text-xs text-neutral-500">{ser.duration_mins} mins • {ser.category}</p>
                  </div>
                  <span className="font-mono font-bold text-sm text-neutral-900">{formatLKR(ser.price)}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center space-x-1"
            >
              <span>Next: Select Staff</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Staff */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
          <h2 className="text-xl font-display font-bold text-neutral-900 flex items-center space-x-2">
            <User className="w-5 h-5 text-primary-500" />
            <span>Step 2: Choose Stylist / Staff</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Any Available Staff */}
            <div
              onClick={() => setSelectedStaff(null)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                selectedStaff === null
                  ? 'border-primary-500 bg-primary-50/40 ring-2 ring-primary-200'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-600">
                ANY
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Any Available Staff</h4>
                <p className="text-xs text-neutral-500">First available specialist</p>
              </div>
            </div>

            {staffList.map((st) => {
              const isSelected = selectedStaff?.id === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStaff(st)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/40 ring-2 ring-primary-200'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <img
                    src={st.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}
                    alt={st.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">{st.name}</h4>
                    <p className="text-xs text-primary-600 font-medium">{st.specialization}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center space-x-1"
            >
              <span>Next: Select Date</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Select Date */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
          <h2 className="text-xl font-display font-bold text-neutral-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            <span>Step 3: Choose Appointment Date</span>
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700 uppercase">Select Date</label>
            <input
              type="date"
              min={format(new Date(), 'yyyy-MM-dd')}
              max={format(addDays(new Date(), shop?.advance_booking_days || 14), 'yyyy-MM-dd')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center space-x-1"
            >
              <span>Next: Select Time Slot</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Select Time Slot */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
          <h2 className="text-xl font-display font-bold text-neutral-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary-500" />
            <span>Step 4: Choose Available Slot for {selectedDate}</span>
          </h2>

          <TimeSlotPicker
            slots={availableSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
            loading={slotsLoading}
          />

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={!selectedSlot}
              onClick={() => setStep(5)}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center space-x-1"
            >
              <span>Next: Confirm Booking</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Confirm & Payment */}
      {step === 5 && (
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
          <h2 className="text-xl font-display font-bold text-neutral-900">Step 5: Review & Confirm Booking</h2>

          {/* Summary Card */}
          <div className="bg-neutral-50 p-4 rounded-2xl space-y-2 border border-neutral-200 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Salon:</span> <span className="font-bold text-neutral-900">{shop?.name}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Service:</span> <span className="font-semibold">{selectedService?.name}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Staff:</span> <span>{selectedStaff?.name || 'Any Available'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Date & Time:</span> <span className="font-semibold text-primary-600">{selectedDate} at {selectedSlot?.slot_time}</span></div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 font-mono font-bold text-base"><span>Total Amount:</span> <span className="text-neutral-900">{formatLKR(selectedService?.price)}</span></div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Customer Note (Optional)</label>
            <textarea
              rows="2"
              placeholder="Any special requests or details..."
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Payment Method Select */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-700 uppercase">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <span>Pay at Salon (Cash)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('payhere')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'payhere'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-secondary-500" />
                <span>PayHere Online</span>
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={submitting}
              onClick={handleCreateBooking}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md text-sm"
            >
              {submitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Success Screen */}
      {step === 6 && createdBooking && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-neutral-900">Booking Request Sent!</h2>
            <p className="text-xs text-neutral-500">
              Booking ID: <span className="font-mono font-bold text-neutral-800">#{createdBooking.id}</span>
            </p>
          </div>

          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            Your appointment has been logged. The salon owner has been notified and will accept your booking shortly.
          </p>

          <div className="pt-4 flex justify-center space-x-4">
            <button
              onClick={() => navigate('/bookings')}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow transition-all"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;
