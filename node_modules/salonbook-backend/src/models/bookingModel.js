const pool = require('../config/db');

class BookingModel {
  static async getBookingById(id) {
    const query = `
      SELECT b.*,
             u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
             s.name as shop_name, s.address as shop_address, s.city as shop_city, s.phone as shop_phone,
             ser.name as service_name, ser.price as service_price, ser.duration_mins as service_duration,
             st.name as staff_name
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN shops s ON b.shop_id = s.id
      LEFT JOIN services ser ON b.service_id = ser.id
      LEFT JOIN staff st ON b.staff_id = st.id
      WHERE b.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getBookingsByCustomerId(customerId) {
    const query = `
      SELECT b.*,
             s.name as shop_name, s.cover_image_url as shop_cover, s.city as shop_city,
             ser.name as service_name, ser.price as service_price,
             st.name as staff_name,
             r.id as review_id
      FROM bookings b
      JOIN shops s ON b.shop_id = s.id
      LEFT JOIN services ser ON b.service_id = ser.id
      LEFT JOIN staff st ON b.staff_id = st.id
      LEFT JOIN reviews r ON b.id = r.booking_id
      WHERE b.customer_id = $1
      ORDER BY b.booking_date DESC, b.booking_time DESC;
    `;
    const { rows } = await pool.query(query, [customerId]);
    return rows;
  }

  static async getBookingsByShopId(shopId) {
    const query = `
      SELECT b.*,
             u.name as customer_name, u.phone as customer_phone, u.email as customer_email,
             ser.name as service_name, ser.price as service_price,
             st.name as staff_name
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      LEFT JOIN services ser ON b.service_id = ser.id
      LEFT JOIN staff st ON b.staff_id = st.id
      WHERE b.shop_id = $1
      ORDER BY b.booking_date DESC, b.booking_time DESC;
    `;
    const { rows } = await pool.query(query, [shopId]);
    return rows;
  }

  static async updateBookingStatus(id, status, extraFields = {}) {
    const fields = ['status = $1', 'updated_at = NOW()'];
    const values = [status];
    let idx = 2;

    if (extraFields.owner_note !== undefined) {
      fields.push(`owner_note = $${idx++}`);
      values.push(extraFields.owner_note);
    }
    if (extraFields.reschedule_date !== undefined) {
      fields.push(`reschedule_date = $${idx++}`);
      values.push(extraFields.reschedule_date);
    }
    if (extraFields.reschedule_time !== undefined) {
      fields.push(`reschedule_time = $${idx++}`);
      values.push(extraFields.reschedule_time);
    }
    if (extraFields.reschedule_reason !== undefined) {
      fields.push(`reschedule_reason = $${idx++}`);
      values.push(extraFields.reschedule_reason);
    }

    values.push(id);
    const query = `
      UPDATE bookings
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async reassignStaff(id, staffId) {
    const query = `
      UPDATE bookings
      SET staff_id = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [staffId, id]);
    return rows[0];
  }

  static async expirePendingBookings() {
    // Find bookings pending and auto_expire_at < NOW()
    const query = `
      UPDATE bookings
      SET status = 'cancelled', updated_at = NOW()
      WHERE status = 'pending' AND auto_expire_at <= NOW()
      RETURNING *;
    `;
    const { rows } = await pool.query(query);

    // Release slots for expired bookings
    for (const b of rows) {
      if (b.slot_id) {
        await pool.query(`UPDATE time_slots SET is_booked = false WHERE id = $1;`, [b.slot_id]);
      }
    }
    return rows;
  }
}

module.exports = BookingModel;
