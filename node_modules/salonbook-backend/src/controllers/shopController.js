const ShopModel = require('../models/shopModel');
const { success, error } = require('../utils/responseHelper');

class ShopController {
  static async getShops(req, res) {
    try {
      const { city, category, rating, minPrice, maxPrice, search } = req.query;
      const shops = await ShopModel.getApprovedShops({ city, category, rating, minPrice, maxPrice, search });
      return success(res, shops, 'Shops fetched successfully');
    } catch (err) {
      console.error(err);
      return error(res, err.message || 'Failed to fetch shops');
    }
  }

  static async getFeaturedShops(req, res) {
    try {
      const shops = await ShopModel.getFeaturedShops();
      return success(res, shops, 'Featured shops fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch featured shops');
    }
  }

  static async getShopById(req, res) {
    try {
      const shop = await ShopModel.getShopById(req.params.id);
      if (!shop) {
        return error(res, 'Shop not found', 404);
      }
      return success(res, shop, 'Shop details fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch shop details');
    }
  }

  static async getMyShop(req, res) {
    try {
      const shop = await ShopModel.getShopByOwnerId(req.user.id);
      return success(res, shop || null, 'Owner shop fetched');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch shop');
    }
  }

  static async createShop(req, res) {
    try {
      const existing = await ShopModel.getShopByOwnerId(req.user.id);
      if (existing) {
        return error(res, 'You already have a shop registered', 400);
      }

      const shopData = {
        ...req.body,
        owner_id: req.user.id,
      };

      const newShop = await ShopModel.createShop(shopData);
      return success(res, newShop, 'Shop submitted for approval', 201);
    } catch (err) {
      console.error(err);
      return error(res, err.message || 'Failed to create shop');
    }
  }

  static async updateShop(req, res) {
    try {
      const shop = await ShopModel.getShopById(req.params.id);
      if (!shop) {
        return error(res, 'Shop not found', 404);
      }

      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized to update this shop', 403);
      }

      const updated = await ShopModel.updateShop(req.params.id, req.body);
      return success(res, updated, 'Shop updated successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to update shop');
    }
  }

  static async uploadGalleryImages(req, res) {
    try {
      const shop = await ShopModel.getShopById(req.params.id);
      if (!shop) {
        return error(res, 'Shop not found', 404);
      }

      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      if (!req.files || req.files.length === 0) {
        return error(res, 'No image files uploaded', 400);
      }

      const uploadedImages = [];
      for (const file of req.files) {
        const imageUrl = `/uploads/${file.filename}`;
        const imgRecord = await ShopModel.addShopImage(req.params.id, imageUrl);
        uploadedImages.push(imgRecord);
      }

      return success(res, uploadedImages, 'Images uploaded successfully', 201);
    } catch (err) {
      return error(res, err.message || 'Failed to upload images');
    }
  }

  static async blockDate(req, res) {
    try {
      const { blocked_date, reason } = req.body;
      const shop = await ShopModel.getShopById(req.params.id);
      if (!shop) return error(res, 'Shop not found', 404);

      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      const result = await ShopModel.blockDate(req.params.id, blocked_date, reason);
      return success(res, result, 'Date blocked successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to block date');
    }
  }

  static async unblockDate(req, res) {
    try {
      const shop = await ShopModel.getShopById(req.params.id);
      if (!shop) return error(res, 'Shop not found', 404);

      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      await ShopModel.unblockDate(req.params.id, req.params.date);
      return success(res, null, 'Date unblocked successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to unblock date');
    }
  }
}

module.exports = ShopController;
