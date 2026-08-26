const express = require('express');
const TimeslotController = require('../controllers/timeslotController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/shop/:shopId', TimeslotController.getSlots);
router.post('/generate', authenticateToken, authorize('owner', 'admin'), TimeslotController.generateSlots);

module.exports = router;
