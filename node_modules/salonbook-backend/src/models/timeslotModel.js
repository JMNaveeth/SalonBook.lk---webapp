const pool = require('../config/db');

class TimeslotModel {
  static async getAvailableSlots(shopId, dateStr, staffId = null) {
    let query = `
      SELECT ts.*, st.name as staff_name
      FROM time_slots ts
      LEFT JOIN staff st ON ts.staff_id = st.id
      WHERE ts.shop_id = $1
        AND ts.slot_date = $2
        AND ts.is_booked = false
        AND ts.is_blocked = false
    `;
    const values = [shopId, dateStr];

    if (staffId) {
      query += ` AND ts.staff_id = $3`;
      values.push(staffId);
    }

    query += ` ORDER BY ts.slot_time ASC;`;

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async generateSlotsForDate({ shop_id, staff_id, slot_date, times }) {
    const createdSlots = [];
    for (const timeStr of times) {
      const query = `
        INSERT INTO time_slots (shop_id, staff_id, slot_date, slot_time)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (shop_id, staff_id, slot_date, slot_time) DO NOTHING
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [shop_id, staff_id || null, slot_date, timeStr]);
      if (rows.length > 0) createdSlots.push(rows[0]);
    }
    return createdSlots;
  }

  static async getSlotById(id) {
    const query = `SELECT * FROM time_slots WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = TimeslotModel;
