const pool = require('../config/db');

class ServiceModel {
  static async getServicesByShopId(shopId) {
    const query = `
      SELECT * FROM services
      WHERE shop_id = $1 AND is_active = true
      ORDER BY category ASC, name ASC;
    `;
    const { rows } = await pool.query(query, [shopId]);
    return rows;
  }

  static async getServiceById(id) {
    const query = `SELECT * FROM services WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async createService({ shop_id, name, description, price, duration_mins, category }) {
    const query = `
      INSERT INTO services (shop_id, name, description, price, duration_mins, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [shop_id, name, description, price, duration_mins, category]);
    return rows[0];
  }

  static async updateService(id, { name, description, price, duration_mins, category, is_active }) {
    const query = `
      UPDATE services
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          duration_mins = COALESCE($4, duration_mins),
          category = COALESCE($5, category),
          is_active = COALESCE($6, is_active)
      WHERE id = $7
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, description, price, duration_mins, category, is_active, id]);
    return rows[0];
  }

  static async deleteService(id) {
    const query = `DELETE FROM services WHERE id = $1;`;
    await pool.query(query, [id]);
  }
}

module.exports = ServiceModel;
