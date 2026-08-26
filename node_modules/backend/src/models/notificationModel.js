const pool = require('../config/db');

class NotificationModel {
  static async createNotification({ user_id, title, message, type = 'general', related_booking_id = null }) {
    const query = `
      INSERT INTO notifications (user_id, title, message, type, related_booking_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [user_id, title, message, type, related_booking_id]);
    return rows[0];
  }

  static async getUserNotifications(userId) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async markAsRead(id, userId) {
    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0];
  }
}

module.exports = NotificationModel;
