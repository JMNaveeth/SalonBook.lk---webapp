const TimeslotModel = require('../models/timeslotModel');
const ShopModel = require('../models/shopModel');
const { generateDailyTimeSlots } = require('../utils/dateHelper');
const { success, error } = require('../utils/responseHelper');

class TimeslotController {
  static async getSlots(req, res) {
    try {
      const { shopId } = req.params;
      const { date, staffId } = req.query;

      if (!date) {
        return error(res, 'Date query parameter (YYYY-MM-DD) is required', 400);
      }

      const slots = await TimeslotModel.getAvailableSlots(shopId, date, staffId);
      return success(res, slots, 'Available slots fetched');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch time slots');
    }
  }

  static async generateSlots(req, res) {
    try {
      const { shop_id, staff_id, slot_date, open_time, close_time, interval_mins } = req.body;

      const shop = await ShopModel.getShopById(shop_id);
      if (!shop) return error(res, 'Shop not found', 404);
      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      const timeList = generateDailyTimeSlots(open_time || '09:00', close_time || '18:00', interval_mins || 30);

      const generated = await TimeslotModel.generateSlotsForDate({
        shop_id,
        staff_id: staff_id || null,
        slot_date,
        times: timeList,
      });

      return success(res, generated, `Generated ${generated.length} time slots for ${slot_date}`, 201);
    } catch (err) {
      return error(res, err.message || 'Failed to generate time slots');
    }
  }
}

module.exports = TimeslotController;
