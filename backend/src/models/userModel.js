const pool = require('../config/db');

class UserModel {
  static async createUser({ name, email, phone, passwordHash, role = 'customer' }) {
    const query = `
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role, avatar_url, is_verified, is_active, warning_strikes, created_at;
    `;
    const values = [name, email, phone, passwordHash, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, name, email, phone, role, avatar_url, is_verified, is_active, warning_strikes, created_at, updated_at
      FROM users WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async updateRefreshToken(userId, refreshToken) {
    const query = `UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2;`;
    await pool.query(query, [refreshToken, userId]);
  }

  static async updateProfile(id, { name, phone, avatar_url }) {
    const query = `
      UPDATE users
      SET name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          avatar_url = COALESCE($3, avatar_url),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, email, phone, role, avatar_url, is_verified, is_active, warning_strikes;
    `;
    const { rows } = await pool.query(query, [name, phone, avatar_url, id]);
    return rows[0];
  }

  static async updatePassword(id, passwordHash) {
    const query = `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2;`;
    await pool.query(query, [passwordHash, id]);
  }

  static async incrementWarningStrike(id) {
    const query = `
      UPDATE users
      SET warning_strikes = warning_strikes + 1,
          is_active = CASE WHEN warning_strikes + 1 >= 3 THEN false ELSE is_active END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, warning_strikes, is_active;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getAllUsers() {
    const query = `
      SELECT id, name, email, phone, role, avatar_url, is_verified, is_active, warning_strikes, created_at
      FROM users
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async toggleActiveStatus(id, isActive) {
    const query = `
      UPDATE users
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email, role, is_active;
    `;
    const { rows } = await pool.query(query, [isActive, id]);
    return rows[0];
  }

  // User Favourites
  static async addFavourite(customerId, shopId) {
    const query = `
      INSERT INTO user_favourites (customer_id, shop_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `;
    await pool.query(query, [customerId, shopId]);
  }

  static async removeFavourite(customerId, shopId) {
    const query = `
      DELETE FROM user_favourites
      WHERE customer_id = $1 AND shop_id = $2;
    `;
    await pool.query(query, [customerId, shopId]);
  }

  static async getFavourites(customerId) {
    const query = `
      SELECT s.*
      FROM user_favourites uf
      JOIN shops s ON uf.shop_id = s.id
      WHERE uf.customer_id = $1;
    `;
    const { rows } = await pool.query(query, [customerId]);
    return rows;
  }
}

module.exports = UserModel;
