const express = require('express');
const ShopController = require('../controllers/shopController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/', ShopController.getShops);
router.get('/featured', ShopController.getFeaturedShops);
router.get('/my', authenticateToken, authorize('owner'), ShopController.getMyShop);
router.get('/:id', ShopController.getShopById);

router.post('/', authenticateToken, authorize('owner'), ShopController.createShop);
router.put('/:id', authenticateToken, authorize('owner', 'admin'), ShopController.updateShop);

router.post('/:id/images', authenticateToken, authorize('owner', 'admin'), upload.array('images', 5), ShopController.uploadGalleryImages);
router.post('/:id/block-date', authenticateToken, authorize('owner', 'admin'), ShopController.blockDate);
router.delete('/:id/block-date/:date', authenticateToken, authorize('owner', 'admin'), ShopController.unblockDate);

module.exports = router;
