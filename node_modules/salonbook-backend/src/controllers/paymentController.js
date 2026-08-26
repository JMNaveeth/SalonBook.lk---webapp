const PaymentModel = require('../models/paymentModel');
const ShopModel = require('../models/shopModel');
const env = require('../config/env');
const { success, error } = require('../utils/responseHelper');

class PaymentController {
  static async getPaymentByBooking(req, res) {
    try {
      const payment = await PaymentModel.getPaymentByBookingId(req.params.bookingId);
      if (!payment) return error(res, 'Payment record not found', 404);
      return success(res, payment, 'Payment details fetched');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch payment');
    }
  }

  static async initiatePayHere(req, res) {
    try {
      const { booking_id, amount, item_name } = req.body;
      const order_id = `SB-${booking_id.substring(0, 8)}-${Date.now()}`;

      const payload = {
        merchant_id: env.payhere.merchantId || '123456',
        return_url: `${env.frontendUrl}/bookings?status=success`,
        cancel_url: `${env.frontendUrl}/bookings?status=cancel`,
        notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`,
        order_id,
        items: item_name || 'Salon Appointment Booking',
        currency: 'LKR',
        amount: parseFloat(amount).toFixed(2),
        first_name: req.user.name.split(' ')[0] || 'Customer',
        last_name: req.user.name.split(' ')[1] || 'User',
        email: req.user.email,
        phone: req.user.phone || '0770000000',
        address: 'Sri Lanka',
        city: 'Colombo',
        country: 'Sri Lanka',
      };

      return success(res, payload, 'PayHere payment initiated');
    } catch (err) {
      return error(res, err.message || 'Failed to initiate payment');
    }
  }

  static async payhereWebhook(req, res) {
    try {
      const { order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

      // Status code 2 = Success in PayHere
      if (parseInt(status_code, 10) === 2) {
        console.log(`[PAYHERE WEBHOOK SUCCESS] Order ID: ${order_id}, Amount: ${payhere_amount} ${payhere_currency}`);
      }

      return res.status(200).send('OK');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Webhook Error');
    }
  }

  static async refundPayment(req, res) {
    try {
      const { refund_reason } = req.body;
      const payment = await PaymentModel.updatePaymentStatus(req.params.id, 'refunded', null, refund_reason);
      return success(res, payment, 'Refund processed successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to process refund');
    }
  }

  static async getOwnerEarnings(req, res) {
    try {
      const shop = await ShopModel.getShopByOwnerId(req.user.id);
      if (!shop) return error(res, 'Shop not found', 404);

      const earnings = await PaymentModel.getEarningsByShopId(shop.id);
      return success(res, earnings, 'Earnings fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch earnings');
    }
  }
}

module.exports = PaymentController;
