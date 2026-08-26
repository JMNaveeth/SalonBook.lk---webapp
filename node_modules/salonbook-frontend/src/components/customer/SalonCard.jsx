import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Sparkles, ArrowUpRight, Scissors } from 'lucide-react';

const SalonCard = ({ shop }) => {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden">
      {/* Image Container with Badge Overlay */}
      <div className="relative h-52 w-full bg-neutral-100 overflow-hidden">
        <img
          src={shop.cover_image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600'}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          {shop.is_featured ? (
            <div className="bg-gradient-to-r from-amber-500 to-primary-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>FEATURED</span>
            </div>
          ) : (
            <div className="bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1">
              <Scissors className="w-3 h-3 text-amber-300" />
              <span className="capitalize">{shop.city}</span>
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-md text-neutral-900 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{parseFloat(shop.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        {/* Bottom City Label */}
        <div className="absolute bottom-3 left-3.5 flex items-center space-x-1.5 text-white/90 text-xs font-medium">
          <MapPin className="w-3.5 h-3.5 text-primary-400" />
          <span className="line-clamp-1">{shop.address}, {shop.city}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {shop.name}
            </h3>
          </div>

          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-normal">
            {shop.description || 'Premier hair styling, gents grooming, facials, and luxury beauty spa services.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Total Reviews</span>
            <span className="text-xs font-bold text-neutral-700">{shop.total_reviews || 0} Ratings</span>
          </div>

          <Link
            to={`/salons/${shop.id}`}
            className="bg-neutral-900 hover:bg-primary-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1 group/btn"
          >
            <span>Book Visit</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
