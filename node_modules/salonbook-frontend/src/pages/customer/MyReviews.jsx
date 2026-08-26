import React, { useEffect, useState } from 'react';
import { getMyReviewsApi } from '../../api/reviewApi';
import ReviewCard from '../../components/customer/ReviewCard';
import Loader from '../../components/common/Loader';
import { Star } from 'lucide-react';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getMyReviewsApi();
        setReviews(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
          <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
          <span>My Salon Reviews</span>
        </h1>
        <p className="text-xs text-neutral-500">Feedback submitted for your completed salon appointments</p>
      </div>

      {loading ? (
        <Loader message="Fetching your review history..." />
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-neutral-200 text-neutral-500 text-sm">
          You haven't written any salon reviews yet. Completed bookings can be reviewed under "My Bookings".
        </div>
      )}
    </div>
  );
};

export default MyReviews;
