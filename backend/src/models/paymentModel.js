const pool = require('../config/db');

class PaymentModel {
  static async createPayment({ booking_id, customer_id, shop_id, amount, method = 'cash' }) {
    // 10% commission default
    const commission = amount * 0.10;
    const ownerPayout = amount - commission;

    const query = `
      INSERT INTO payments (booking_id, customer_id, shop_id, amount, commission_amount, owner_payout, method, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const initialStatus = method === 'cash' ? 'pending' : 'pending';
    const { rows } = await pool.query(query, [
      booking_id,
      customer_id,
      shop_id,
      amount,
      commission,
      ownerPayout,
      method,
      initialStatus,
    ]);
    return rows[0];
  }

  static async getPaymentByBookingId(bookingId) {
    const query = `SELECT * FROM payments WHERE booking_id = $1;`;
    const { rows } = await pool.query(query, [bookingId]);
    return rows[0];
  }

  static async updatePaymentStatus(id, status, transactionId = null, refundReason = null) {
    const query = `
      UPDATE payments
      SET status = $1,
          transaction_id = COALESCE($2, transaction_id),
          refund_reason = COALESCE($3, refund_reason),
          updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, transactionId, refundReason, id]);
    return rows[0];
  }

  static async getEarningsByShopId(shopId) {
    const query = `
      SELECT
        COALESCE(SUM(amount), 0) as total_revenue,
        COALESCE(SUM(commission_amount), 0) as total_commission,
        COALESCE(SUM(owner_payout), 0) as net_payout,
        COUNT(*) as total_transactions
      FROM payments
      WHERE shop_id = $1 AND status = 'paid';
    `;
    const { rows } = await pool.query(query, [shopId]);
    return rows[0];
  }

  static async getAllPayments() {
    const query = `
      SELECT p.*,
             u.name as customer_name,
             s.name as shop_name
      FROM payments p
      LEFT JOIN users u ON p.customer_id = u.id
      LEFT JOIN shops s ON p.shop_id = s.id
      ORDER BY p.created_at DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }
}

module.exports = PaymentModel;
