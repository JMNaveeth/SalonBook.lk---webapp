const pool = require('../config/db');

class ShopModel {
  static async createShop(shopData) {
    const {
      owner_id,
      name,
      description,
      address,
      city,
      latitude,
      longitude,
      phone,
      email,
      cover_image_url,
      logo_url,
      working_hours,
      advance_booking_days,
    } = shopData;

    const query = `
      INSERT INTO shops (
        owner_id, name, description, address, city, latitude, longitude,
        phone, email, cover_image_url, logo_url, working_hours, advance_booking_days
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const values = [
      owner_id,
      name,
      description,
      address,
      city,
      latitude || null,
      longitude || null,
      phone,
      email,
      cover_image_url || null,
      logo_url || null,
      working_hours ? JSON.stringify(working_hours) : undefined,
      advance_booking_days || 14,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getApprovedShops({ city, category, rating, minPrice, maxPrice, search, isFeatured }) {
    let query = `
      SELECT DISTINCT s.*, 
        (SELECT JSON_AGG(image_url) FROM shop_images WHERE shop_id = s.id) AS gallery_images
      FROM shops s
      LEFT JOIN services ser ON s.id = ser.shop_id
      WHERE s.status = 'approved'
    `;
    const values = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND LOWER(s.city) = LOWER($${paramIndex++})`;
      values.push(city);
    }

    if (category) {
      query += ` AND LOWER(ser.category) = LOWER($${paramIndex++})`;
      values.push(category);
    }

    if (rating) {
      query += ` AND s.rating >= $${paramIndex++}`;
      values.push(parseFloat(rating));
    }

    if (minPrice) {
      query += ` AND ser.price >= $${paramIndex++}`;
      values.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ` AND ser.price <= $${paramIndex++}`;
      values.push(parseFloat(maxPrice));
    }

    if (isFeatured !== undefined) {
      query += ` AND s.is_featured = $${paramIndex++}`;
      values.push(isFeatured);
    }

    if (search) {
      query += ` AND (LOWER(s.name) LIKE LOWER($${paramIndex}) OR LOWER(s.city) LIKE LOWER($${paramIndex}) OR LOWER(s.description) LIKE LOWER($${paramIndex}))`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY s.rating DESC, s.created_at DESC;`;

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async getFeaturedShops() {
    return this.getApprovedShops({ isFeatured: true });
  }

  static async getShopById(id) {
    const query = `
      SELECT s.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
      FROM shops s
      JOIN users u ON s.owner_id = u.id
      WHERE s.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) return null;

    const shop = rows[0];

    // Fetch images
    const imgQuery = `SELECT id, image_url FROM shop_images WHERE shop_id = $1;`;
    const imgs = await pool.query(imgQuery, [id]);
    shop.images = imgs.rows;

    // Fetch blocked dates
    const blockedQuery = `SELECT blocked_date, reason FROM blocked_dates WHERE shop_id = $1;`;
    const blocked = await pool.query(blockedQuery, [id]);
    shop.blocked_dates = blocked.rows;

    return shop;
  }

  static async getShopByOwnerId(ownerId) {
    const query = `SELECT * FROM shops WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 1;`;
    const { rows } = await pool.query(query, [ownerId]);
    return rows[0];
  }

  static async updateShop(id, shopData) {
    const fields = [];
    const values = [];
    let idx = 1;

    const allowed = [
      'name',
      'description',
      'address',
      'city',
      'latitude',
      'longitude',
      'phone',
      'email',
      'cover_image_url',
      'logo_url',
      'working_hours',
      'advance_booking_days',
      'status',
      'is_featured',
    ];

    for (const key of allowed) {
      if (shopData[key] !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(key === 'working_hours' ? JSON.stringify(shopData[key]) : shopData[key]);
      }
    }

    if (fields.length === 0) return this.getShopById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE shops
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async addShopImage(shopId, imageUrl) {
    const query = `
      INSERT INTO shop_images (shop_id, image_url)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [shopId, imageUrl]);
    return rows[0];
  }

  static async blockDate(shopId, blockedDate, reason) {
    const query = `
      INSERT INTO blocked_dates (shop_id, blocked_date, reason)
      VALUES ($1, $2, $3)
      ON CONFLICT (shop_id, blocked_date) DO UPDATE SET reason = EXCLUDED.reason
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [shopId, blockedDate, reason]);
    return rows[0];
  }

  static async unblockDate(shopId, blockedDate) {
    const query = `DELETE FROM blocked_dates WHERE shop_id = $1 AND blocked_date = $2;`;
    await pool.query(query, [shopId, blockedDate]);
  }

  static async updateStatus(shopId, status) {
    const query = `UPDATE shops SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;`;
    const { rows } = await pool.query(query, [status, shopId]);
    return rows[0];
  }

  static async toggleFeatured(shopId, isFeatured) {
    const query = `UPDATE shops SET is_featured = $1, updated_at = NOW() WHERE id = $2 RETURNING *;`;
    const { rows } = await pool.query(query, [isFeatured, shopId]);
    return rows[0];
  }

  static async getAllShops(statusFilter) {
    let query = `
      SELECT s.*, u.name as owner_name, u.email as owner_email
      FROM shops s
      JOIN users u ON s.owner_id = u.id
    `;
    const values = [];
    if (statusFilter) {
      query += ` WHERE s.status = $1`;
      values.push(statusFilter);
    }
    query += ` ORDER BY s.created_at DESC;`;
    const { rows } = await pool.query(query, values);
    return rows;
  }
}

module.exports = ShopModel;
