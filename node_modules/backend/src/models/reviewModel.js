const pool = require('../config/db');

class ReviewModel {
  static async createReview({ booking_id, customer_id, shop_id, rating, comment }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check booking is completed
      const bookingRes = await client.query(
        `SELECT * FROM bookings WHERE id = $1 AND customer_id = $2 AND status = 'completed'`,
        [booking_id, customer_id]
      );
      if (bookingRes.rows.length === 0) {
        throw new Error('Review can only be submitted for completed bookings.');
      }

      const insertQuery = `
        INSERT INTO reviews (booking_id, customer_id, shop_id, rating, comment)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const reviewRes = await client.query(insertQuery, [booking_id, customer_id, shop_id, rating, comment]);

      // Recalculate average rating & review count for shop
      const statsRes = await client.query(
        `SELECT AVG(rating)::DECIMAL(3,2) as avg_rating, COUNT(*)::INTEGER as count FROM reviews WHERE shop_id = $1`,
        [shop_id]
      );
      const newRating = statsRes.rows[0].avg_rating || 0.00;
      const totalReviews = statsRes.rows[0].count || 0;

      await client.query(
        `UPDATE shops SET rating = $1, total_reviews = $2, updated_at = NOW() WHERE id = $3`,
        [newRating, totalReviews, shop_id]
      );

      await client.query('COMMIT');
      return reviewRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async getShopReviews(shopId) {
    const query = `
      SELECT r.*, u.name as customer_name, u.avatar_url as customer_avatar
      FROM reviews r
      JOIN users u ON r.customer_id = u.id
      WHERE r.shop_id = $1
      ORDER BY r.created_at DESC;
    `;
    const { rows } = await pool.query(query, [shopId]);
    return rows;
  }

  static async getCustomerReviews(customerId) {
    const query = `
      SELECT r.*, s.name as shop_name, s.cover_image_url as shop_cover
      FROM reviews r
      JOIN shops s ON r.shop_id = s.id
      WHERE r.customer_id = $1
      ORDER BY r.created_at DESC;
    `;
    const { rows } = await pool.query(query, [customerId]);
    return rows;
  }

  static async replyToReview(reviewId, ownerReply) {
    const query = `
      UPDATE reviews
      SET owner_reply = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [ownerReply, reviewId]);
    return rows[0];
  }
}

module.exports = ReviewModel;
