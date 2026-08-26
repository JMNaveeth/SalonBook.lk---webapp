const express = require('express');
const StaffController = require('../controllers/staffController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/shop/:shopId', StaffController.getStaffByShop);
router.post('/', authenticateToken, authorize('owner', 'admin'), upload.single('avatar'), StaffController.addStaff);
router.put('/:id', authenticateToken, authorize('owner', 'admin'), upload.single('avatar'), StaffController.updateStaff);
router.delete('/:id', authenticateToken, authorize('owner', 'admin'), StaffController.deleteStaff);

module.exports = router;
