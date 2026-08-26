const ReviewModel = require('../models/reviewModel');
const ShopModel = require('../models/shopModel');
const { success, error } = require('../utils/responseHelper');

class ReviewController {
  static async getShopReviews(req, res) {
    try {
      const reviews = await ReviewModel.getShopReviews(req.params.shopId);
      return success(res, reviews, 'Shop reviews fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch reviews');
    }
  }

  static async getMyReviews(req, res) {
    try {
      const reviews = await ReviewModel.getCustomerReviews(req.user.id);
      return success(res, reviews, 'User reviews fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch user reviews');
    }
  }

  static async submitReview(req, res) {
    try {
      const customer_id = req.user.id;
      const { booking_id, shop_id, rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return error(res, 'Rating must be an integer between 1 and 5', 400);
      }

      const review = await ReviewModel.createReview({
        booking_id,
        customer_id,
        shop_id,
        rating,
        comment,
      });

      return success(res, review, 'Review submitted successfully', 201);
    } catch (err) {
      return error(res, err.message || 'Failed to submit review');
    }
  }

  static async replyToReview(req, res) {
    try {
      const { owner_reply } = req.body;
      const reviewId = req.params.id;

      const updated = await ReviewModel.replyToReview(reviewId, owner_reply);
      return success(res, updated, 'Reply added successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to reply to review');
    }
  }
}

module.exports = ReviewController;
