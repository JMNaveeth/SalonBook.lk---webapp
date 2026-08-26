import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, max = 5, onRate = null, size = 'sm' }) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: max }).map((_, idx) => {
        const starValue = idx + 1;
        const isFilled = rating >= starValue;
        const isHalf = rating > idx && rating < starValue;

        return (
          <button
            key={idx}
            type="button"
            disabled={!onRate}
            onClick={() => onRate && onRate(starValue)}
            className={`${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform focus:outline-none`}
          >
            <Star
              className={`${iconSizes[size] || 'w-4 h-4'} ${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : isHalf
                  ? 'text-amber-400 fill-amber-200'
                  : 'text-neutral-300 fill-neutral-100'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
