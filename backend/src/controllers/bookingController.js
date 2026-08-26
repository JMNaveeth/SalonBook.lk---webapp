const pool = require('../config/db');
const BookingModel = require('../models/bookingModel');
const ShopModel = require('../models/shopModel');
const UserModel = require('../models/userModel');
const PaymentModel = require('../models/paymentModel');
const NotificationModel = require('../models/notificationModel');
const { success, error } = require('../utils/responseHelper');
const sendEmail = require('../utils/sendEmail');

class BookingController {
  static async createBooking(req, res) {
    const client = await pool.connect();
    try {
      const customer_id = req.user.id;
      const { shop_id, service_id, staff_id, slot_id, booking_date, booking_time, customer_note, payment_method } = req.body;

      await client.query('BEGIN');

      // Lock the slot row to prevent concurrent booking
      const slotCheck = await client.query(
        'SELECT * FROM time_slots WHERE id = $1 AND is_booked = false FOR UPDATE',
        [slot_id]
      );

      if (slotCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return error(res, 'This slot is already booked. Please choose another time.', 409);
      }

      // Check if date is blocked
      const blockedCheck = await client.query(
        'SELECT * FROM blocked_dates WHERE shop_id = $1 AND blocked_date = $2',
        [shop_id, booking_date]
      );

      if (blockedCheck.rows.length > 0) {
        await client.query('ROLLBACK');
        return error(res, 'Shop is not available on this date.', 409);
      }

      // Fetch service price for payment initialization
      const serviceRes = await client.query('SELECT price FROM services WHERE id = $1', [service_id]);
      const price = serviceRes.rows.length > 0 ? serviceRes.rows[0].price : 0;

      // Mark slot as booked
      await client.query('UPDATE time_slots SET is_booked = true WHERE id = $1', [slot_id]);

      // Create booking
      const booking = await client.query(
        `INSERT INTO bookings (customer_id, shop_id, service_id, staff_id, slot_id, booking_date, booking_time, status, auto_expire_at, customer_note)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW() + INTERVAL '24 hours', $8)
         RETURNING *`,
        [customer_id, shop_id, service_id, staff_id || null, slot_id, booking_date, booking_time, customer_note || '']
      );

      const createdBooking = booking.rows[0];

      // Create payment record
      const commission = price * 0.10;
      const ownerPayout = price - commission;
      await client.query(
        `INSERT INTO payments (booking_id, customer_id, shop_id, amount, commission_amount, owner_payout, method, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')`,
        [createdBooking.id, customer_id, shop_id, price, commission, ownerPayout, payment_method || 'cash']
      );

      await client.query('COMMIT');

      // Async Notifications
      ShopModel.getShopById(shop_id).then((shop) => {
        if (shop && shop.owner_id) {
          NotificationModel.createNotification({
            user_id: shop.owner_id,
            title: 'New Booking Request',
            message: `New booking received for ${booking_date} at ${booking_time}`,
            type: 'booking_new',
            related_booking_id: createdBooking.id,
          });

          sendEmail({
            to: shop.owner_email,
            subject: 'New Booking Request - SalonBook LK',
            text: `You have received a new booking for ${booking_date} at ${booking_time}. Please review it on your owner dashboard.`,
            html: `<h3>New Booking Received!</h3><p>Date: ${booking_date}</p><p>Time: ${booking_time}</p><p>Customer Note: ${customer_note || 'None'}</p>`,
          });
        }
      });

      return success(res, createdBooking, 'Booking created successfully', 201);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      return error(res, err.message || 'Failed to create booking');
    } finally {
      client.release();
    }
  }

  static async getMyBookings(req, res) {
    try {
      const bookings = await BookingModel.getBookingsByCustomerId(req.user.id);
      return success(res, bookings, 'Customer bookings fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch bookings');
    }
  }

  static async getShopBookings(req, res) {
    try {
      const shop = await ShopModel.getShopById(req.params.shopId);
      if (!shop) return error(res, 'Shop not found', 404);

      if (shop.owner_id !== req.user.id && req.user.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      const bookings = await BookingModel.getBookingsByShopId(req.params.shopId);
      return success(res, bookings, 'Shop bookings fetched successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to fetch shop bookings');
    }
  }

  static async acceptBooking(req, res) {
    try {
      const booking = await BookingModel.getBookingById(req.params.id);
      if (!booking) return error(res, 'Booking not found', 404);

      const updated = await BookingModel.updateBookingStatus(req.params.id, 'accepted', {
        owner_note: req.body.owner_note,
      });

      // Notify Customer
      NotificationModel.createNotification({
        user_id: booking.customer_id,
        title: 'Booking Accepted! 💈',
        message: `Your booking at ${booking.shop_name} for ${booking.booking_date} has been accepted.`,
        type: 'booking_accepted',
        related_booking_id: booking.id,
      });

      sendEmail({
        to: booking.customer_email,
        subject: `Booking Confirmed - ${booking.shop_name}`,
        text: `Great news! Your booking at ${booking.shop_name} on ${booking.booking_date} at ${booking.booking_time} is confirmed.`,
        html: `<h2>Booking Confirmed!</h2><p>Salon: <strong>${booking.shop_name}</strong></p><p>Date: ${booking.booking_date}</p><p>Time: ${booking.booking_time}</p>`,
      });

      return success(res, updated, 'Booking accepted successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to accept booking');
    }
  }

  static async rejectBooking(req, res) {
    try {
      const booking = await BookingModel.getBookingById(req.params.id);
      if (!booking) return error(res, 'Booking not found', 404);

      const updated = await BookingModel.updateBookingStatus(req.params.id, 'rejected', {
        owner_note: req.body.owner_note || 'Owner was unavailable.',
      });

      // Release slot
      if (booking.slot_id) {
        await pool.query('UPDATE time_slots SET is_booked = false WHERE id = $1', [booking.slot_id]);
      }

      // Trigger refund if paid
      const payment = await PaymentModel.getPaymentByBookingId(booking.id);
      if (payment && payment.status === 'paid') {
        await PaymentModel.updatePaymentStatus(payment.id, 'refunded', null, 'Booking rejected by salon owner');
      }

      // Notify Customer
      NotificationModel.createNotification({
        user_id: booking.customer_id,
        title: 'Booking Declined',
        message: `Your booking at ${booking.shop_name} was declined: ${req.body.owner_note || 'Owner unavailable'}`,
        type: 'booking_rejected',
        related_booking_id: booking.id,
      });

      return success(res, updated, 'Booking rejected successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to reject booking');
    }
  }

  static async rescheduleBooking(req, res) {
    try {
      const { reschedule_date, reschedule_time, reschedule_reason } = req.body;
      const booking = await BookingModel.getBookingById(req.params.id);
      if (!booking) return error(res, 'Booking not found', 404);

      // Free old slot
      if (booking.slot_id) {
        await pool.query('UPDATE time_slots SET is_booked = false WHERE id = $1', [booking.slot_id]);
      }

      const updated = await BookingModel.updateBookingStatus(req.params.id, 'rescheduled', {
        reschedule_date,
        reschedule_time,
        reschedule_reason,
      });

      NotificationModel.createNotification({
        user_id: booking.customer_id,
        title: 'Reschedule Proposed by Salon',
        message: `${booking.shop_name} proposed a new appointment time: ${reschedule_date} at ${reschedule_time}`,
        type: 'booking_rescheduled',
        related_booking_id: booking.id,
      });

      return success(res, updated, 'Reschedule proposal sent to customer');
    } catch (err) {
      return error(res, err.message || 'Failed to reschedule booking');
    }
  }

  static async confirmReschedule(req, res) {
    try {
      const booking = await BookingModel.getBookingById(req.params.id);
      if (!booking || booking.customer_id !== req.user.id) {
        return error(res, 'Booking not found or unauthorized', 404);
      }

      const updated = await BookingModel.updateBookingStatus(req.params.id, 'accepted', {
        booking_date: booking.reschedule_date,
        booking_time: booking.reschedule_time,
      });

      // Update date and time
      await pool.query('UPDATE bookings SET booking_date = $1, booking_time = $2 WHERE id = $3', [
        booking.reschedule_date,
        booking.reschedule_time,
        booking.id,
      ]);

      return success(res, updated, 'Reschedule accepted');
    } catch (err) {
      return error(res, err.message || 'Failed to confirm reschedule');
    }
  }

  static async declineReschedule(req, res) {
    try {
      const booking = await BookingModel.getBookingById(req.params.id);
      if (!booking || booking.customer_id !== req.user.id) {
        return error(res, 'Booking not found or unauthorized', 404);
      }

      const updated = await BookingModel.updateBookingStatus(req.params.id, 'cancelled');

      // Refund if paid
      const payment = await PaymentModel.getPaymentByBookingId(booking.id);
      if (payment && payment.status === 'paid') {
        await PaymentModel.updatePaymentStatus(payment.id, 'refunded', null, 'Declined reschedule');
      }

      return success(res, updated, 'Reschedule declined and booking cancelled');
    } catch (err) {
      return error(res, err.message || 'Failed to decline reschedule');
    }
  }

  static async reassignStaff(req, res) {
    try {
      const { staff_id } = req.body;
      const updated = await BookingModel.reassignStaff(req.params.id, staff_id);
      return success(res, updated, 'Staff reassigned successfully');
    } catch (err) {
      return error(res, err.message || 'Failed to reassign staff');
    }
  }

  static async completeBooking(req, res) {
    try {
      const updated = await BookingModel.updateBookingStatus(req.params.id, 'completed');

      // Mark payment as paid (for cash on completion)
      const payment = await PaymentModel.getPaymentByBookingId(req.params.id);
      if (payment && payment.status === 'pending') {
        await PaymentModel.updatePaymentStatus(payment.id, 'paid', 'CASH_COMPLETED');
      }

      return success(res, updated, 'Booking marked as completed');
    } catch (err) {
      return error(res, err.message || 'Failed to complete booking');
    }
  }

  static async noShowBooking(req, res) {
    try {
      const booking = await BookingModel.getBookingById(req.params.id);
      if (!booking) return error(res, 'Booking not found', 404);

      const updated = await BookingModel.updateBookingStatus(req.params.id, 'no_show');

      // Update customer strike count
      const updatedUser = await UserModel.incrementWarningStrike(booking.customer_id);

      if (updatedUser.warning_strikes >= 3) {
        sendEmail({
          to: updatedUser.email,
          subject: 'ACCOUNT SUSPENDED - SalonBook LK',
          text: `Your account has been suspended due to 3 consecutive no-shows. Please contact support to appeal.`,
          html: `<h2 style="color:red;">Account Suspended</h2><p>Your account has accumulated 3 warning strikes for salon no-shows and is now suspended.</p>`,
        });
      } else {
        sendEmail({
          to: updatedUser.email,
          subject: 'No-Show Warning Strike - SalonBook LK',
          text: `You missed your booking at ${booking.shop_name}. You now have ${updatedUser.warning_strikes}/3 warning strikes.`,
          html: `<h3>Warning Strike Notice</h3><p>You missed your appointment at <strong>${booking.shop_name}</strong>. Accumulating 3 strikes results in account suspension.</p>`,
        });
      }

      return success(res, { booking: updated, userStrikes: updatedUser.warning_strikes }, 'Booking marked as no-show');
    } catch (err) {
      return error(res, err.message || 'Failed to mark no-show');
    }
  }
}

module.exports = BookingController;
