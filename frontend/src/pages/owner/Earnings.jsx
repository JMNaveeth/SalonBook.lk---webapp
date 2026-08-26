import React, { useEffect, useState } from 'react';
import { getOwnerEarningsApi } from '../../api/paymentApi';
import EarningsChart from '../../components/owner/EarningsChart';
import Loader from '../../components/common/Loader';
import { formatLKR } from '../../utils/formatCurrency';
import { DollarSign, PieChart, ArrowUpRight, TrendingUp } from 'lucide-react';

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await getOwnerEarningsApi();
        setEarnings(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) return <Loader message="Calculating financial metrics..." />;

  const totalRev = parseFloat(earnings?.total_revenue || 0);
  const comm = parseFloat(earnings?.total_commission || 0);
  const netPayout = parseFloat(earnings?.net_payout || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-secondary-500" />
          <span>Earnings & Payout Financial Summary</span>
        </h1>
        <p className="text-xs text-neutral-500">Track total salon sales, platform commissions (10%), and net payout</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Gross Salon Revenue</span>
          <h3 className="text-3xl font-display font-bold text-neutral-900 font-mono">{formatLKR(totalRev)}</h3>
          <p className="text-[11px] text-neutral-400">Total appointments completed</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Platform Fee (10%)</span>
          <h3 className="text-3xl font-display font-bold text-rose-600 font-mono">-{formatLKR(comm)}</h3>
          <p className="text-[11px] text-neutral-400">SalonBook LK service fee</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-2 bg-gradient-to-br from-secondary-50 to-white">
          <span className="text-xs font-semibold text-secondary-800 uppercase tracking-wider">Net Payout to Salon</span>
          <h3 className="text-3xl font-display font-bold text-secondary-600 font-mono">{formatLKR(netPayout)}</h3>
          <p className="text-[11px] text-secondary-700">Direct earnings after commission</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <EarningsChart />
    </div>
  );
};

export default Earnings;
