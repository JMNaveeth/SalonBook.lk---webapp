import React, { useEffect, useState } from 'react';
import { getAllPaymentsAdminApi, refundPaymentApi } from '../../api/adminApi';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { formatLKR } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../hooks/useToast';
import { DollarSign, RotateCcw } from 'lucide-react';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getAllPaymentsAdminApi();
      setPayments(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (payment) => {
    const reason = window.prompt('Refund reason for customer?', 'Customer request / Salon dispute');
    if (!reason) return;
    try {
      await refundPaymentApi(payment.id, { refund_reason: reason });
      toast.success('Refund issued successfully!');
      fetchPayments();
    } catch (err) {
      toast.error('Failed to process refund');
    }
  };

  if (loading) return <Loader message="Fetching transaction logs..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
          <DollarSign className="w-6 h-6 text-secondary-500" />
          <span>Payment Transactions Log</span>
        </h1>
        <p className="text-xs text-neutral-500">Monitor PayHere and cash transactions, platform commission, and refund requests</p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Transaction Date</th>
                <th className="py-3.5 px-6">Customer / Salon</th>
                <th className="py-3.5 px-6">Method</th>
                <th className="py-3.5 px-6">Gross Amount</th>
                <th className="py-3.5 px-6">Commission (10%)</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 text-xs text-neutral-600 font-mono">{formatDate(p.created_at)}</td>
                  <td className="py-4 px-6 text-xs">
                    <div className="font-bold text-neutral-900">{p.customer_name}</div>
                    <div className="text-neutral-500">Salon: {p.shop_name}</div>
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold uppercase">{p.method}</td>
                  <td className="py-4 px-6 font-mono font-bold text-neutral-900">{formatLKR(p.amount)}</td>
                  <td className="py-4 px-6 font-mono text-secondary-600 font-bold">{formatLKR(p.commission_amount)}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : p.status === 'refunded'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {p.status === 'paid' && (
                      <button
                        onClick={() => handleRefund(p)}
                        className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center space-x-1 ml-auto"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Refund</span>
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

export default ManagePayments;
