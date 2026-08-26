import React from 'react';
import StarRating from '../common/StarRating';
import { formatDate } from '../../utils/formatDate';
import { ShieldCheck, MessageSquare } from 'lucide-react';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={review.customer_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'}
            alt={review.customer_name}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-sm text-neutral-900">{review.customer_name}</h4>
              {review.is_verified && (
                <span className="inline-flex items-center text-[10px] font-semibold text-secondary-700 bg-secondary-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                  Verified Customer
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400">{formatDate(review.created_at)}</p>
          </div>
        </div>

        <StarRating rating={review.rating} size="sm" />
      </div>

      <p className="text-sm text-neutral-700 leading-relaxed font-normal">{review.comment}</p>

      {/* Owner Reply */}
      {review.owner_reply && (
        <div className="mt-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 font-semibold text-primary-600">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Response from Salon Owner</span>
          </div>
          <p className="text-neutral-600 pl-5">{review.owner_reply}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
