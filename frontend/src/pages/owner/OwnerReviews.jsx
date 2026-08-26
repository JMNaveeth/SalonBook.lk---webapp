import React, { useEffect, useState } from 'react';
import { getMyShopApi } from '../../api/shopApi';
import { getShopReviewsApi, replyReviewApi } from '../../api/reviewApi';
import ReviewCard from '../../components/customer/ReviewCard';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { useToast } from '../../hooks/useToast';
import { Star, MessageSquare } from 'lucide-react';

const OwnerReviews = () => {
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [targetReview, setTargetReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const loadData = async () => {
    try {
      const sRes = await getMyShopApi();
      const shopObj = sRes.data.data;
      setShop(shopObj);
      if (shopObj) {
        const revRes = await getShopReviewsApi(shopObj.id);
        setReviews(revRes.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReply = (rev) => {
    setTargetReview(rev);
    setReplyText(rev.owner_reply || '');
    setReplyModalOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await replyReviewApi(targetReview.id, { owner_reply: replyText });
      toast.success('Reply submitted!');
      setReplyModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading reviews..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
          <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
          <span>Customer Reviews & Feedback</span>
        </h1>
        <p className="text-xs text-neutral-500">Read and publicly reply to verified customer feedback</p>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="relative">
              <ReviewCard review={rev} />
              <button
                onClick={() => handleOpenReply(rev)}
                className="absolute top-4 right-4 bg-primary-50 text-primary-600 hover:bg-primary-100 px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{rev.owner_reply ? 'Edit Reply' : 'Reply'}</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-neutral-200 text-neutral-500 text-sm">
          No customer reviews submitted yet.
        </div>
      )}

      {/* Reply Modal */}
      <Modal isOpen={replyModalOpen} onClose={() => setReplyModalOpen(false)} title="Reply to Customer Review">
        <div className="space-y-4">
          <p className="text-xs text-neutral-500">
            Replying to <span className="font-semibold text-neutral-800">{targetReview?.customer_name}</span>
          </p>

          <textarea
            rows="4"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Thank you for visiting our salon! We look forward to seeing you again..."
            className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
          ></textarea>

          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={() => setReplyModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-neutral-600">
              Cancel
            </button>
            <button
              disabled={submitting}
              onClick={handleSubmitReply}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow"
            >
              {submitting ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OwnerReviews;
