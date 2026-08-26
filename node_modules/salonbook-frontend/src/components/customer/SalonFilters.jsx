import React from 'react';
import { SRI_LANKA_CITIES, SERVICE_CATEGORIES } from '../../utils/constants';
import { Filter, RotateCcw } from 'lucide-react';

const SalonFilters = ({ filters, onChange, onReset }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <h3 className="font-display font-bold text-base text-neutral-900 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-primary-500" />
          <span>Filter Salons</span>
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-neutral-500 hover:text-primary-500 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* City Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">City</label>
        <select
          value={filters.city || ''}
          onChange={(e) => onChange('city', e.target.value)}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
        >
          <option value="">All Cities</option>
          {SRI_LANKA_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Category Multi/Single selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Service Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => onChange('category', e.target.value)}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {SERVICE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Minimum Rating</label>
        <div className="flex items-center space-x-2">
          {[4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChange('rating', filters.rating === String(r) ? '' : String(r))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filters.rating === String(r)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              {r}+ ★
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
          <span>Max Service Price</span>
          <span className="text-primary-600 font-mono">
            {filters.maxPrice ? `Rs. ${Number(filters.maxPrice).toLocaleString()}` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="50000"
          step="500"
          value={filters.maxPrice || '50000'}
          onChange={(e) => onChange('maxPrice', e.target.value)}
          className="w-full accent-primary-500"
        />
      </div>
    </div>
  );
};

export default SalonFilters;
