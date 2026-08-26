const express = require('express');
const ReviewController = require('../controllers/reviewController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/shop/:shopId', ReviewController.getShopReviews);
router.get('/my', authenticateToken, authorize('customer'), ReviewController.getMyReviews);
router.post('/', authenticateToken, authorize('customer'), ReviewController.submitReview);
router.post('/:id/reply', authenticateToken, authorize('owner', 'admin'), ReviewController.replyToReview);

module.exports = router;
