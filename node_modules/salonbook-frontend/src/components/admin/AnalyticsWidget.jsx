import React from 'react';

const AnalyticsWidget = ({ title, value, subtitle, icon: Icon, color = 'primary' }) => {
  const colorStyles = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-secondary-50 text-secondary-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-display font-bold text-neutral-900 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3.5 rounded-2xl ${colorStyles[color] || colorStyles.primary}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default AnalyticsWidget;
