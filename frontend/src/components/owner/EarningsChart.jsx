import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EarningsChart = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { month: 'Jan', earnings: 45000 },
    { month: 'Feb', earnings: 62000 },
    { month: 'Mar', earnings: 58000 },
    { month: 'Apr', earnings: 92000 },
    { month: 'May', earnings: 75000 },
    { month: 'Jun', earnings: 110000 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
      <h3 className="font-display font-semibold text-base text-neutral-900">Monthly Earnings Overview (LKR)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Earnings']}
              contentStyle={{ background: '#1f1f1f', borderRadius: '8px', color: '#fff', border: 'none' }}
            />
            <Bar dataKey="earnings" fill="#e8631a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;
