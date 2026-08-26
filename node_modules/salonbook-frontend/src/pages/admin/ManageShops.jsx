import React, { useEffect, useState } from 'react';
import { getAllAdminShopsApi, approveShopApi, suspendShopApi, toggleFeaturedShopApi } from '../../api/adminApi';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { useToast } from '../../hooks/useToast';
import { Store, CheckCircle, Ban, Sparkles } from 'lucide-react';

const ManageShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const toast = useToast();

  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await getAllAdminShopsApi(statusFilter);
      setShops(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [statusFilter]);

  const handleApprove = async (id) => {
    try {
      await approveShopApi(id);
      toast.success('Shop approved!');
      fetchShops();
    } catch (err) {
      toast.error('Failed to approve shop');
    }
  };

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this salon listing?')) return;
    try {
      await suspendShopApi(id);
      toast.error('Shop suspended');
      fetchShops();
    } catch (err) {
      toast.error('Failed to suspend shop');
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await toggleFeaturedShopApi(id, { is_featured: !currentStatus });
      toast.success(`Featured status set to ${!currentStatus}`);
      fetchShops();
    } catch (err) {
      toast.error('Failed to toggle featured status');
    }
  };

  if (loading) return <Loader message="Fetching shops catalog..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
            <Store className="w-6 h-6 text-primary-500" />
            <span>Manage All Salons</span>
          </h1>
          <p className="text-xs text-neutral-500">Approve listings, toggle featured badge, or suspend violating salons</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none shadow-sm"
        >
          <option value="">All Shop Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved & Live</option>
          <option value="suspended">Suspended</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Salon Name</th>
                <th className="py-3.5 px-6">Owner</th>
                <th className="py-3.5 px-6">City</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Rating</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {shops.map((shop) => (
                <tr key={shop.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-neutral-900">{shop.name}</span>
                      {shop.is_featured && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                          <Sparkles className="w-3 h-3 mr-0.5" /> Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-600 text-xs">{shop.owner_name}</td>
                  <td className="py-4 px-6 text-neutral-600 text-xs">{shop.city}</td>
                  <td className="py-4 px-6">
                    <Badge status={shop.status} />
                  </td>
                  <td className="py-4 px-6 font-semibold text-neutral-900 text-xs">
                    {parseFloat(shop.rating || 0).toFixed(1)} ★ ({shop.total_reviews})
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {shop.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(shop.id)}
                        className="px-2.5 py-1 bg-secondary-500 text-white rounded-lg text-xs font-semibold hover:bg-secondary-700"
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleFeatured(shop.id, shop.is_featured)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        shop.is_featured
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {shop.is_featured ? 'Unfeature' : 'Feature'}
                    </button>

                    {shop.status !== 'suspended' && (
                      <button
                        onClick={() => handleSuspend(shop.id)}
                        className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-100"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageShops;
