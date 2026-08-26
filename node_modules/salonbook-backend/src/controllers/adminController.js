const pool = require('../config/db');
const ShopModel = require('../models/shopModel');
const UserModel = require('../models/userModel');
const PaymentModel = require('../models/paymentModel');
const NotificationModel = require('../models/notificationModel');
const { success, error } = require('../utils/responseHelper');
const sendEmail = require('../utils/sendEmail');

class AdminController {
  static async getDashboardStats(req, res) {
    try {
      const shopsRes = await pool.query('SELECT COUNT(*) FROM shops');
      const usersRes = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['customer']);
      const bookingsRes = await pool.query('SELECT COUNT(*) FROM bookings');
      const revenueRes = await pool.query('SELECT COALESCE(SUM(commission_amount), 0) as platform_revenue FROM payments WHERE status = $1', ['paid']);

      const stats = {
        totalShops: parseInt(shopsRes.rows[0].count, 10),
        totalUsers: parseInt(usersRes.rows[0].count, 10),
        totalBookings: parseInt(bookingsRes.rows[0].count, 10),
        platformRevenue: parseFloat(revenueRes.rows[0].platform_revenue),
      };

      const recentShops = await ShopModel.getAllShops('pending');

      return success(res, { stats, pendingApprovals: recentShops }, 'Admin dashboard data loaded');
    } catch (err) {
      console.error(err);
      return error(res, err.message || 'Failed to fetch admin stats');
    }
  }

  static async getAllShops(req, res) {
    try {
      const { status } = req.query;
      const shops = await ShopModel.getAllShops(status);
      return success(res, shops, 'All shops fetched for admin');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch shops');
    }
  }

  static async approveShop(req, res) {
    try {
      const shop = await ShopModel.getShopById(req.params.id);
      if (!shop) return error(res, 'Shop not found', 404);

      const updated = await ShopModel.updateStatus(req.params.id, 'approved');

      NotificationModel.createNotification({
        user_id: shop.owner_id,
        title: 'Shop Approved! 🎉',
        message: `Congratulations! Your salon '${shop.name}' has been approved and is now live on SalonBook LK.`,
        type: 'shop_approved',
      });

      sendEmail({
        to: shop.owner_email,
        subject: 'Shop Approved - SalonBook LK',
        text: `Your shop '${shop.name}' is now approved! You can log in to your owner dashboard and manage your services and slots.`,
        html: `<h2>Shop Approved!</h2><p>Your shop <strong>${shop.name}</strong> is officially live on SalonBook LK.</p>`,
      });

      return success(res, updated, 'Shop approved successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to approve shop');
    }
  }

  static async rejectShop(req, res) {
    try {
      const { reason } = req.body;
      const shop = await ShopModel.getShopById(req.params.id);
      if (!shop) return error(res, 'Shop not found', 404);

      const updated = await ShopModel.updateStatus(req.params.id, 'rejected');

      NotificationModel.createNotification({
        user_id: shop.owner_id,
        title: 'Shop Registration Rejected',
        message: `Your shop application for '${shop.name}' was rejected: ${reason || 'Does not meet listing criteria.'}`,
        type: 'shop_rejected',
      });

      return success(res, updated, 'Shop rejected');
    } catch (err) {
      return error(res, err.message || 'Failed to reject shop');
    }
  }

  static async suspendShop(req, res) {
    try {
      const shop = await ShopModel.getShopById(req.params.id);
      if (!shop) return error(res, 'Shop not found', 404);

      const updated = await ShopModel.updateStatus(req.params.id, 'suspended');
      return success(res, updated, 'Shop suspended');
    } catch (err) {
      return error(res, err.message || 'Failed to suspend shop');
    }
  }

  static async toggleFeatured(req, res) {
    try {
      const { is_featured } = req.body;
      const updated = await ShopModel.toggleFeatured(req.params.id, is_featured);
      return success(res, updated, 'Shop featured status toggled');
    } catch (err) {
      return error(res, err.message || 'Failed to toggle featured status');
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      return success(res, users, 'All users fetched');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch users');
    }
  }

  static async toggleUserBan(req, res) {
    try {
      const { is_active } = req.body;
      const updated = await UserModel.toggleActiveStatus(req.params.id, is_active);
      return success(res, updated, `User account ${is_active ? 'unbanned' : 'banned'} successfully`);
    } catch (err) {
      return error(res, err.message || 'Failed to update user status');
    }
  }

  static async getAllPayments(req, res) {
    try {
      const payments = await PaymentModel.getAllPayments();
      return success(res, payments, 'All payments fetched');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch payments');
    }
  }

  static async getAnalytics(req, res) {
    try {
      const cityRes = await pool.query('SELECT city, COUNT(*) as count FROM shops GROUP BY city ORDER BY count DESC');
      const categoryRes = await pool.query('SELECT category, COUNT(*) as count FROM services GROUP BY category ORDER BY count DESC');
      const peakHoursRes = await pool.query(`
        SELECT EXTRACT(HOUR FROM booking_time) as hour, COUNT(*) as count
        FROM bookings
        GROUP BY hour
        ORDER BY count DESC
        LIMIT 6;
      `);

      const analyticsData = {
        cityDistribution: cityRes.rows,
        popularCategories: categoryRes.rows,
        peakBookingHours: peakHoursRes.rows,
      };

      return success(res, analyticsData, 'Analytics data generated');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch analytics');
    }
  }
}

module.exports = AdminController;
