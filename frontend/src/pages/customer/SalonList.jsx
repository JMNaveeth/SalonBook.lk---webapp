import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { getShopsApi } from '../../api/shopApi';
import SalonCard from '../../components/customer/SalonCard';
import SalonFilters from '../../components/customer/SalonFilters';
import Loader from '../../components/common/Loader';

const SalonList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    rating: searchParams.get('rating') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
  });

  const [sortBy, setSortBy] = useState('rating');

  const fetchShops = async (currentFilters) => {
    setLoading(true);
    try {
      const res = await getShopsApi(currentFilters);
      let list = res.data.data || [];

      if (sortBy === 'rating') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setShops(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops(filters);
  }, [filters, sortBy]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    const params = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleReset = () => {
    const empty = { city: '', category: '', rating: '', maxPrice: '', search: '' };
    setFilters(empty);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-neutral-900">Explore Salons in Sri Lanka</h1>
            <p className="text-xs text-neutral-500">Find and book verified hair stylists, barbers, and spas</p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-neutral-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-800 focus:outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="name">Salon Name</option>
            </select>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search salon name, city, or specialty..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Filter & Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filter */}
        <div className="lg:col-span-1">
          <SalonFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />
        </div>

        {/* Right Salon Card Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loader message="Searching salons..." />
          ) : shops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <SalonCard key={shop.id} shop={shop} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-neutral-200 space-y-3">
              <SlidersHorizontal className="w-10 h-10 text-neutral-300 mx-auto" />
              <h3 className="font-display font-bold text-lg text-neutral-800">No salons found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters to explore all salons across Sri Lanka.
              </p>
              <button
                onClick={handleReset}
                className="mt-2 inline-block bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonList;
