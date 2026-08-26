import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Scissors, Sparkles, CalendarCheck, Smile, Star, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { getFeaturedShopsApi, getShopsApi } from '../../api/shopApi';
import SalonCard from '../../components/customer/SalonCard';
import Loader from '../../components/common/Loader';
import { SRI_LANKA_CITIES, SERVICE_CATEGORIES } from '../../utils/constants';

const Home = () => {
  const [featuredShops, setFeaturedShops] = useState([]);
  const [topShops, setTopShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, allRes] = await Promise.all([getFeaturedShopsApi(), getShopsApi()]);
        setFeaturedShops(featRes.data.data || []);
        setTopShops((allRes.data.data || []).slice(0, 6));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchQuery) params.set('search', searchQuery);
    navigate(`/salons?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[2.5rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-primary-950 opacity-90"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Sri Lanka's #1 Multi-Salon Booking Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-none">
            Book Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-amber-400 to-primary-500">Salon Visit</span> Instantly
          </h1>

          <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Skip long queues. Discover top barber studios, hair stylists, bridal dressing lounges, and spas in Colombo, Kandy, Galle & beyond.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-lg p-2.5 sm:p-3 rounded-3xl shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2 text-neutral-800 border border-white/40"
          >
            <div className="flex-1 flex items-center px-4 py-2.5 w-full border-b sm:border-b-0 sm:border-r border-neutral-200">
              <Search className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search salon name or service (e.g. Haircut, Facial)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm focus:outline-none text-neutral-900 font-medium placeholder-neutral-400 bg-transparent"
              />
            </div>

            <div className="flex-1 flex items-center px-4 py-2.5 w-full">
              <MapPin className="w-5 h-5 text-secondary-500 mr-3 flex-shrink-0" />
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none text-neutral-900 font-semibold cursor-pointer"
              >
                <option value="">All Sri Lanka Cities</option>
                {SRI_LANKA_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-primary-500/30 text-sm flex items-center justify-center space-x-2"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Proof Counters */}
          <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center border-t border-white/10">
            <div>
              <p className="text-xl sm:text-2xl font-display font-extrabold text-white">100+</p>
              <p className="text-[11px] text-neutral-400 font-medium">Verified Salons</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-display font-extrabold text-white">15,000+</p>
              <p className="text-[11px] text-neutral-400 font-medium">Booked Slots</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-display font-extrabold text-amber-400">4.9 ★</p>
              <p className="text-[11px] text-neutral-400 font-medium">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-neutral-900">Explore by Category</h2>
            <p className="text-xs text-neutral-500">Pick a specialized grooming or styling service</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {SERVICE_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              to={`/salons?category=${encodeURIComponent(cat)}`}
              className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-xs hover:shadow-lg hover:border-primary-400 transition-all text-center group flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-xs">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-neutral-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Salons Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-neutral-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Featured Salons</span>
            </h2>
            <p className="text-xs text-neutral-500">Handpicked luxury salons and grooming studios</p>
          </div>
          <Link
            to="/salons"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading featured salons..." />
        ) : featuredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShops.map((shop) => (
              <SalonCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 italic py-8 text-center bg-white rounded-3xl border border-dashed">
            No featured salons listed yet.
          </p>
        )}
      </section>

      {/* How it Works Banner */}
      <section className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-[2.5rem] max-w-7xl mx-auto shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2 relative z-10">
          <h2 className="text-3xl font-display font-extrabold">How SalonBook LK Works</h2>
          <p className="text-xs text-neutral-400">Book your salon appointment in 3 easy steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center mx-auto font-display font-black text-lg shadow-md">
              1
            </div>
            <h3 className="font-display font-bold text-lg text-white">Search & Filter</h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              Find top rated salons in Colombo, Kandy, Galle, filter by price range and service type.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 bg-secondary-500 text-white rounded-2xl flex items-center justify-center mx-auto font-display font-black text-lg shadow-md">
              2
            </div>
            <h3 className="font-display font-bold text-lg text-white">Pick Time & Staff</h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              Choose your preferred date, active staff member, and select optional "Pay at Salon".
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto font-display font-black text-lg shadow-md">
              3
            </div>
            <h3 className="font-display font-bold text-lg text-white">Enjoy Zero Waiting</h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              Arrive at your appointment time with instant SMS/Email notifications. Zero waiting in line.
            </p>
          </div>
        </div>
      </section>

      {/* Top Rated Salons Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-neutral-900 flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Top Rated Salons</span>
            </h2>
            <p className="text-xs text-neutral-500">Highest rated places chosen by verified customers</p>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topShops.map((shop) => (
              <SalonCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
