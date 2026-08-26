import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Star, Calendar, Scissors, User, Image, ArrowRight, ShieldCheck } from 'lucide-react';
import { getShopByIdApi } from '../../api/shopApi';
import { getServicesByShopApi } from '../../api/serviceApi';
import { getStaffByShopApi } from '../../api/staffApi';
import { getShopReviewsApi } from '../../api/reviewApi';
import StarRating from '../../components/common/StarRating';
import ReviewCard from '../../components/customer/ReviewCard';
import Loader from '../../components/common/Loader';
import { formatLKR } from '../../utils/formatCurrency';

const SalonDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const [shopRes, servRes, staffRes, revRes] = await Promise.all([
          getShopByIdApi(id),
          getServicesByShopApi(id),
          getStaffByShopApi(id),
          getShopReviewsApi(id),
        ]);
        setShop(shopRes.data.data);
        setServices(servRes.data.data || []);
        setStaff(staffRes.data.data || []);
        setReviews(revRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (loading) return <Loader message="Loading salon details..." />;
  if (!shop) return <div className="text-center py-20 text-neutral-500 font-semibold">Salon not found.</div>;

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner with Glassmorphism Overlay */}
      <div className="relative h-72 sm:h-[26rem] w-full bg-neutral-950 overflow-hidden shadow-xl">
        <img
          src={shop.cover_image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200'}
          alt={shop.name}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center space-x-4">
            <img
              src={shop.logo_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=200'}
              alt={shop.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-white/20 shadow-2xl bg-neutral-900"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight">{shop.name}</h1>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs sm:text-sm text-neutral-300">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>{shop.address}, {shop.city}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-lg">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="font-extrabold text-xl">{parseFloat(shop.rating || 0).toFixed(1)}</span>
            <span className="text-xs text-neutral-300 font-medium">({shop.total_reviews || 0} reviews)</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shop Description */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-neutral-900">About {shop.name}</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              {shop.description || 'Professional hair styling, gents grooming, facials, and luxury beauty care.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-neutral-100 text-xs text-neutral-600 font-medium">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>{shop.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>{shop.email}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-neutral-200 space-x-4 sm:space-x-8 text-xs sm:text-sm font-bold">
            {[
              { id: 'services', label: `Services (${services.length})`, icon: Scissors },
              { id: 'staff', label: `Staff (${staff.length})`, icon: User },
              { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
              { id: 'gallery', label: `Gallery (${shop.images?.length || 0})`, icon: Image },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3.5 flex items-center space-x-2 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 font-extrabold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Services List */}
          {activeTab === 'services' && (
            <div className="space-y-3">
              {services.map((ser) => (
                <div
                  key={ser.id}
                  className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {ser.name}
                      </h4>
                      <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-2.5 py-0.5 rounded-full">
                        {ser.category}
                      </span>
                    </div>
                    {ser.description && <p className="text-xs text-neutral-500 font-normal">{ser.description}</p>}
                    <div className="flex items-center space-x-1.5 text-xs text-neutral-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ser.duration_mins} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-extrabold text-base text-neutral-900">{formatLKR(ser.price)}</span>
                    <Link
                      to={`/book/${shop.id}?serviceId=${ser.id}`}
                      className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-primary-500/20"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Staff Grid */}
          {activeTab === 'staff' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {staff.map((st) => (
                <div key={st.id} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex items-center space-x-4">
                  <img
                    src={st.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'}
                    alt={st.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-neutral-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">{st.name}</h4>
                    <p className="text-xs text-primary-600 font-bold">{st.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
              ) : (
                <p className="text-sm text-neutral-500 py-8 text-center bg-white rounded-3xl border border-dashed">
                  No reviews submitted yet for this salon.
                </p>
              )}
            </div>
          )}

          {/* Tab 4: Gallery */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {shop.images && shop.images.length > 0 ? (
                shop.images.map((img) => (
                  <div key={img.id} className="h-44 rounded-3xl overflow-hidden bg-neutral-100 shadow-sm">
                    <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-sm text-neutral-500 py-8 text-center bg-white rounded-3xl border border-dashed">
                  No photos uploaded to gallery.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xl sticky top-24 space-y-6">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-xl text-neutral-900">Book Appointment</h3>
              <p className="text-xs text-neutral-500">Fast online booking with instant confirmation.</p>
            </div>

            <Link
              to={`/book/${shop.id}`}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-lg shadow-primary-500/25 text-sm flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Proceed to Booking</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Working Hours List */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <h4 className="font-bold text-xs text-neutral-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-primary-500" />
                <span>Working Hours</span>
              </h4>
              <div className="space-y-2 text-xs text-neutral-600 font-mono">
                <div className="flex justify-between font-medium"><span>Mon - Fri:</span> <span>09:00 AM - 06:00 PM</span></div>
                <div className="flex justify-between font-medium"><span>Saturday:</span> <span>09:00 AM - 05:00 PM</span></div>
                <div className="flex justify-between text-neutral-400 font-medium"><span>Sunday:</span> <span>Closed</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDetail;
