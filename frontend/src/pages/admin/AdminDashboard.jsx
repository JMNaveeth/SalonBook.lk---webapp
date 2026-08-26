import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboardApi, approveShopApi, rejectShopApi } from '../../api/adminApi';
import AnalyticsWidget from '../../components/admin/AnalyticsWidget';
import ShopApprovalCard from '../../components/admin/ShopApprovalCard';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { formatLKR } from '../../utils/formatCurrency';
import { useToast } from '../../hooks/useToast';
import { Store, Users, Calendar, DollarSign, Shield, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetShop, setTargetShop] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const toast = useToast();

  const loadData = async () => {
    try {
      const res = await getAdminDashboardApi();
      setData(res.data.data);
    } catch (err) {
      toast.error('Failed to load admin panel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (shopId) => {
    try {
      await approveShopApi(shopId);
      toast.success('Shop approved successfully!');
      loadData();
    } catch (err) {
      toast.error('Failed to approve shop');
    }
  };

  const handleOpenReject = (shop) => {
    setTargetShop(shop);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    try {
      await rejectShopApi(targetShop.id, { reason: rejectReason });
      toast.success('Shop application rejected');
      setRejectModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Failed to reject shop');
    }
  };

  if (loading) return <Loader message="Loading admin dashboard..." />;

  const { stats, pendingApprovals } = data || { stats: {}, pendingApprovals: [] };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-secondary-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-secondary-300">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Oversight Control</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight">System Admin Panel</h1>
          <p className="text-xs text-neutral-300">Manage all registered salons, customer accounts, and platform fees</p>
        </div>

        <div className="flex items-center space-x-2 relative z-10">
          <Link
            to="/admin/shops"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all border border-white/15"
          >
            All Salons
          </Link>
          <Link
            to="/admin/users"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all border border-white/15"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/analytics"
            className="bg-secondary-500 hover:bg-secondary-600 text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-secondary-500/30"
          >
            Analytics
          </Link>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsWidget
          title="Total Salons"
          value={stats.totalShops || 0}
          subtitle="Registered businesses"
          icon={Store}
          color="primary"
        />
        <AnalyticsWidget
          title="Registered Customers"
          value={stats.totalUsers || 0}
          subtitle="Active user accounts"
          icon={Users}
          color="secondary"
        />
        <AnalyticsWidget
          title="Total Bookings"
          value={stats.totalBookings || 0}
          subtitle="Platform booking volume"
          icon={Calendar}
          color="blue"
        />
        <AnalyticsWidget
          title="Platform Revenue"
          value={formatLKR(stats.platformRevenue || 0)}
          subtitle="10% platform commission"
          icon={DollarSign}
          color="amber"
        />
      </div>

      {/* Pending Shop Approval Requests */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-neutral-900">
          Pending Salon Approvals ({pendingApprovals.length})
        </h2>

        {pendingApprovals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingApprovals.map((shop) => (
              <ShopApprovalCard
                key={shop.id}
                shop={shop}
                onApprove={handleApprove}
                onReject={handleOpenReject}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-neutral-200 text-neutral-500 text-sm">
            ✓ No pending salon registrations awaiting approval.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject Salon Registration">
        <div className="space-y-4">
          <p className="text-xs text-neutral-600">
            Provide reason for rejecting <span className="font-bold text-neutral-900">{targetShop?.name}</span>:
          </p>

          <textarea
            rows="3"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Incomplete street address or unverified contact phone..."
            className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none"
          ></textarea>

          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-neutral-600">
              Cancel
            </button>
            <button onClick={handleConfirmReject} className="bg-rose-600 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow">
              Confirm Reject
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
