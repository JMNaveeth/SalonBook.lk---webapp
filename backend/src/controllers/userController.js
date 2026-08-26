const UserModel = require('../models/userModel');
const NotificationModel = require('../models/notificationModel');
const { success, error } = require('../utils/responseHelper');

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return error(res, 'User not found', 404);
      return success(res, user, 'Profile fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch profile');
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, phone } = req.body;
      let avatar_url = req.body.avatar_url;

      if (req.file) {
        avatar_url = `/uploads/${req.file.filename}`;
      }

      const updated = await UserModel.updateProfile(req.user.id, {
        name,
        phone,
        avatar_url,
      });

      return success(res, updated, 'Profile updated successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to update profile');
    }
  }

  static async getFavourites(req, res) {
    try {
      const favourites = await UserModel.getFavourites(req.user.id);
      return success(res, favourites, 'Favourites fetched');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch favourites');
    }
  }

  static async addFavourite(req, res) {
    try {
      await UserModel.addFavourite(req.user.id, req.params.shopId);
      return success(res, null, 'Shop added to favourites');
    } catch (err) {
      return error(res, err.message || 'Failed to add favourite');
    }
  }

  static async removeFavourite(req, res) {
    try {
      await UserModel.removeFavourite(req.user.id, req.params.shopId);
      return success(res, null, 'Shop removed from favourites');
    } catch (err) {
      return error(res, err.message || 'Failed to remove favourite');
    }
  }

  static async getNotifications(req, res) {
    try {
      const list = await NotificationModel.getUserNotifications(req.user.id);
      return success(res, list, 'Notifications fetched');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch notifications');
    }
  }

  static async markNotificationRead(req, res) {
    try {
      const updated = await NotificationModel.markAsRead(req.params.id, req.user.id);
      return success(res, updated, 'Notification marked as read');
    } catch (err) {
      return error(res, err.message || 'Failed to mark notification as read');
    }
  }
}

module.exports = UserController;
