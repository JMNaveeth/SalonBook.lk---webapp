const express = require('express');
const PaymentController = require('../controllers/paymentController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/booking/:bookingId', authenticateToken, PaymentController.getPaymentByBooking);
router.post('/initiate', authenticateToken, authorize('customer'), PaymentController.initiatePayHere);
router.post('/webhook', express.urlencoded({ extended: true }), PaymentController.payhereWebhook);
router.post('/:id/refund', authenticateToken, authorize('admin'), PaymentController.refundPayment);
router.get('/earnings', authenticateToken, authorize('owner'), PaymentController.getOwnerEarnings);

module.exports = router;
