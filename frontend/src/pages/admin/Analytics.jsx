import React, { useEffect, useState } from 'react';
import { getAdminAnalyticsApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon, BarChart3, MapPin, Clock } from 'lucide-react';

const COLORS = ['#e8631a', '#1a9e74', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAdminAnalyticsApi();
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader message="Compiling analytics..." />;

  const { cityDistribution, popularCategories, peakBookingHours } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-primary-500" />
          <span>Platform Business Analytics</span>
        </h1>
        <p className="text-xs text-neutral-500">City-wise distribution, peak booking hours, and category popularity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* City Distribution Chart */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary-500" />
            <span>Salon Distribution by City</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="city" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1f1f1f', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#e8631a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Categories Pie */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-secondary-500" />
            <span>Popular Service Categories</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popularCategories || []}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => entry.category}
                >
                  {(popularCategories || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1f1f1f', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
