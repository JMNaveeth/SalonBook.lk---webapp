const StaffModel = require('../models/staffModel');
const ShopModel = require('../models/shopModel');
const { success, error } = require('../utils/responseHelper');

class StaffController {
  static async getStaffByShop(req, res) {
    try {
      const staffList = await StaffModel.getStaffByShopId(req.params.shopId);
      return success(res, staffList, 'Staff list fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch staff list');
    }
  }

  static async addStaff(req, res) {
    try {
      const { shop_id, name, specialization } = req.body;
      const shop = await ShopModel.getShopById(shop_id);

      if (!shop) return error(res, 'Shop not found', 404);
      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      let avatar_url = req.body.avatar_url || null;
      if (req.file) {
        avatar_url = `/uploads/${req.file.filename}`;
      }

      const newStaff = await StaffModel.createStaff({
        shop_id,
        name,
        specialization,
        avatar_url,
      });

      return success(res, newStaff, 'Staff member added successfully', 201);
    } catch (err) {
      return error(res, err.message || 'Failed to add staff member');
    }
  }

  static async updateStaff(req, res) {
    try {
      const staff = await StaffModel.getStaffById(req.params.id);
      if (!staff) return error(res, 'Staff member not found', 404);

      const shop = await ShopModel.getShopById(staff.shop_id);
      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      let avatar_url = req.body.avatar_url || staff.avatar_url;
      if (req.file) {
        avatar_url = `/uploads/${req.file.filename}`;
      }

      const updated = await StaffModel.updateStaff(req.params.id, {
        ...req.body,
        avatar_url,
      });

      return success(res, updated, 'Staff member updated successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to update staff member');
    }
  }

  static async deleteStaff(req, res) {
    try {
      const staff = await StaffModel.getStaffById(req.params.id);
      if (!staff) return error(res, 'Staff member not found', 404);

      const shop = await ShopModel.getShopById(staff.shop_id);
      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      await StaffModel.deleteStaff(req.params.id);
      return success(res, null, 'Staff member removed successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to remove staff member');
    }
  }
}

module.exports = StaffController;
