const express = require('express');
const ServiceController = require('../controllers/serviceController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/shop/:shopId', ServiceController.getServicesByShop);
router.post('/', authenticateToken, authorize('owner', 'admin'), ServiceController.addService);
router.put('/:id', authenticateToken, authorize('owner', 'admin'), ServiceController.updateService);
router.delete('/:id', authenticateToken, authorize('owner', 'admin'), ServiceController.deleteService);

module.exports = router;
