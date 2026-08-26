import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyShopApi } from '../../api/shopApi';
import { getShopBookingsApi } from '../../api/bookingApi';
import { getOwnerEarningsApi } from '../../api/paymentApi';
import AppointmentCard from '../../components/owner/AppointmentCard';
import Loader from '../../components/common/Loader';
import { formatLKR } from '../../utils/formatCurrency';
import { useToast } from '../../hooks/useToast';
import {
  Store,
  Calendar,
  DollarSign,
  Clock,
  PlusCircle,
  CalendarOff,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';

const OwnerDashboard = () => {
  const [shop, setShop] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadOwnerData = async () => {
    try {
      const sRes = await getMyShopApi();
      const shopObj = sRes.data.data;
      setShop(shopObj);

      if (shopObj) {
        const [bRes, eRes] = await Promise.all([
          getShopBookingsApi(shopObj.id),
          getOwnerEarningsApi(),
        ]);
        setBookings(bRes.data.data || []);
        setEarnings(eRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  if (loading) return <Loader message="Loading owner workspace..." />;

  // Setup Checklist Calculation
  const checklistSteps = [
    { label: 'Basic Info & Address', done: !!shop?.address },
    { label: 'Add Salon Services', done: true },
    { label: 'Add Team Members', done: true },
    { label: 'Set Working Hours', done: !!shop?.working_hours },
    { label: 'Admin Approval Status', done: shop?.status === 'approved' },
  ];

  const completedChecklistCount = checklistSteps.filter((s) => s.done).length;
  const checklistPercent = Math.round((completedChecklistCount / checklistSteps.length) * 100);

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const todayBookings = bookings.filter((b) => b.status === 'accepted' || b.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-primary-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
            <Store className="w-3.5 h-3.5" />
            <span>Salon Owner Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight">{shop?.name || 'Owner Workspace'}</h1>
          <p className="text-xs text-neutral-300">
            Listing Status:{' '}
            <span className="font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {shop?.status || 'Pending Setup'}
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-3 relative z-10">
          <Link
            to="/owner/setup"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all border border-white/15"
          >
            Edit Settings
          </Link>
          <Link
            to="/owner/appointments"
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-primary-500/30 flex items-center space-x-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Open Calendar</span>
          </Link>
        </div>
      </div>

      {/* Onboarding Setup Checklist */}
      {checklistPercent < 100 && (
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-neutral-900">Salon Setup Checklist</h3>
            <span className="text-xs font-extrabold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              {checklistPercent}% Completed
            </span>
          </div>

          <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-amber-500 h-full transition-all duration-500" style={{ width: `${checklistPercent}%` }}></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {checklistSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl text-xs font-semibold border flex items-center space-x-2 transition-colors ${
                  step.done
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-400'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${step.done ? 'text-emerald-600' : 'text-neutral-300'}`} />
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-2">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Today's Bookings</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-display font-black text-neutral-900">{todayBookings.length}</h3>
            <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-2">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Gross Sales</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-black text-neutral-900 font-mono">
              {formatLKR(earnings?.net_payout || 0)}
            </h3>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-2">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pending Approvals</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-display font-black text-amber-600">{pendingBookings.length}</h3>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-2">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Salon Rating</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-display font-black text-neutral-900">
              {parseFloat(shop?.rating || 0).toFixed(1)} ★
            </h3>
            <span className="text-xs text-neutral-400 font-medium">({shop?.total_reviews || 0} reviews)</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
        <h3 className="font-display font-extrabold text-lg text-neutral-900">Quick Actions Toolbar</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Link
            to="/owner/services"
            className="p-4 bg-neutral-50 hover:bg-primary-50 hover:border-primary-200 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-800 hover:text-primary-700 flex flex-col items-center justify-center space-y-2.5 transition-all group"
          >
            <div className="p-2.5 bg-white rounded-xl shadow-xs group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5 text-primary-500" />
            </div>
            <span>Manage Services</span>
          </Link>

          <Link
            to="/owner/staff"
            className="p-4 bg-neutral-50 hover:bg-secondary-50 hover:border-secondary-200 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-800 hover:text-secondary-700 flex flex-col items-center justify-center space-y-2.5 transition-all group"
          >
            <div className="p-2.5 bg-white rounded-xl shadow-xs group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5 text-secondary-500" />
            </div>
            <span>Manage Staff</span>
          </Link>

          <Link
            to="/owner/appointments"
            className="p-4 bg-neutral-50 hover:bg-blue-50 hover:border-blue-200 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-800 hover:text-blue-700 flex flex-col items-center justify-center space-y-2.5 transition-all group"
          >
            <div className="p-2.5 bg-white rounded-xl shadow-xs group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <span>Calendar View</span>
          </Link>

          <Link
            to="/owner/earnings"
            className="p-4 bg-neutral-50 hover:bg-emerald-50 hover:border-emerald-200 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-800 hover:text-emerald-700 flex flex-col items-center justify-center space-y-2.5 transition-all group"
          >
            <div className="p-2.5 bg-white rounded-xl shadow-xs group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <span>Earnings Report</span>
          </Link>

          <Link
            to="/owner/reviews"
            className="p-4 bg-neutral-50 hover:bg-amber-50 hover:border-amber-200 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-800 hover:text-amber-700 flex flex-col items-center justify-center space-y-2.5 transition-all group"
          >
            <div className="p-2.5 bg-white rounded-xl shadow-xs group-hover:scale-110 transition-transform">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <span>Customer Reviews</span>
          </Link>
        </div>
      </div>

      {/* Pending Appointments Action List */}
      <div className="space-y-4">
        <h3 className="text-xl font-display font-bold text-neutral-900">Pending Appointments</h3>
        {pendingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingBookings.map((b) => (
              <AppointmentCard
                key={b.id}
                booking={b}
                onAccept={() => toast.success('Accepted')}
                onReject={() => toast.success('Rejected')}
                onReschedule={() => toast.info('Open calendar to reschedule')}
                onReassign={() => {}}
                onComplete={() => {}}
                onNoShow={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-neutral-200 text-neutral-500 text-sm">
            No pending bookings awaiting approval. All caught up!
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
