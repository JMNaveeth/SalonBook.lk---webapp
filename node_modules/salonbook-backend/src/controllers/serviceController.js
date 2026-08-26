const ServiceModel = require('../models/serviceModel');
const ShopModel = require('../models/shopModel');
const { success, error } = require('../utils/responseHelper');

class ServiceController {
  static async getServicesByShop(req, res) {
    try {
      const services = await ServiceModel.getServicesByShopId(req.params.shopId);
      return success(res, services, 'Services fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch services');
    }
  }

  static async addService(req, res) {
    try {
      const { shop_id, name, description, price, duration_mins, category } = req.body;
      const shop = await ShopModel.getShopById(shop_id);

      if (!shop) return error(res, 'Shop not found', 404);
      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      const newService = await ServiceModel.createService({
        shop_id,
        name,
        description,
        price,
        duration_mins,
        category,
      });

      return success(res, newService, 'Service added successfully', 201);
    } catch (err) {
      return error(res, err.message || 'Failed to add service');
    }
  }

  static async updateService(req, res) {
    try {
      const service = await ServiceModel.getServiceById(req.params.id);
      if (!service) return error(res, 'Service not found', 404);

      const shop = await ShopModel.getShopById(service.shop_id);
      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      const updated = await ServiceModel.updateService(req.params.id, req.body);
      return success(res, updated, 'Service updated successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to update service');
    }
  }

  static async deleteService(req, res) {
    try {
      const service = await ServiceModel.getServiceById(req.params.id);
      if (!service) return error(res, 'Service not found', 404);

      const shop = await ShopModel.getShopById(service.shop_id);
      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      await ServiceModel.deleteService(req.params.id);
      return success(res, null, 'Service deleted successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to delete service');
    }
  }
}

module.exports = ServiceController;
