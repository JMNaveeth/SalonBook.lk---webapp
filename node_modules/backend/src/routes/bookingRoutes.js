const express = require('express');
const BookingController = require('../controllers/bookingController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', authenticateToken.optionalAuth, BookingController.createBooking);
router.get('/my', authenticateToken, authorize('customer'), BookingController.getMyBookings);
router.get('/shop/:shopId', authenticateToken, authorize('owner', 'admin'), BookingController.getShopBookings);

router.patch('/:id/accept', authenticateToken, authorize('owner', 'admin'), BookingController.acceptBooking);
router.patch('/:id/reject', authenticateToken, authorize('owner', 'admin'), BookingController.rejectBooking);
router.patch('/:id/reschedule', authenticateToken, authorize('owner', 'admin'), BookingController.rescheduleBooking);
router.patch('/:id/confirm-reschedule', authenticateToken, authorize('customer'), BookingController.confirmReschedule);
router.patch('/:id/decline-reschedule', authenticateToken, authorize('customer'), BookingController.declineReschedule);
router.patch('/:id/reassign-staff', authenticateToken, authorize('owner', 'admin'), BookingController.reassignStaff);
router.patch('/:id/complete', authenticateToken, authorize('owner', 'admin'), BookingController.completeBooking);
router.patch('/:id/no-show', authenticateToken, authorize('owner', 'admin'), BookingController.noShowBooking);

module.exports = router;
