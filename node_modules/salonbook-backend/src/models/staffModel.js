const pool = require('../config/db');

class StaffModel {
  static async getStaffByShopId(shopId) {
    const query = `
      SELECT * FROM staff
      WHERE shop_id = $1 AND is_active = true
      ORDER BY name ASC;
    `;
    const { rows } = await pool.query(query, [shopId]);
    return rows;
  }

  static async getStaffById(id) {
    const query = `SELECT * FROM staff WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async createStaff({ shop_id, name, specialization, avatar_url }) {
    const query = `
      INSERT INTO staff (shop_id, name, specialization, avatar_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [shop_id, name, specialization, avatar_url]);
    return rows[0];
  }

  static async updateStaff(id, { name, specialization, avatar_url, is_active }) {
    const query = `
      UPDATE staff
      SET name = COALESCE($1, name),
          specialization = COALESCE($2, specialization),
          avatar_url = COALESCE($3, avatar_url),
          is_active = COALESCE($4, is_active)
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, specialization, avatar_url, is_active, id]);
    return rows[0];
  }

  static async deleteStaff(id) {
    const query = `DELETE FROM staff WHERE id = $1;`;
    await pool.query(query, [id]);
  }
}

module.exports = StaffModel;
