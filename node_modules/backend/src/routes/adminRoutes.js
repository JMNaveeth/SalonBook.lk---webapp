const express = require('express');
const AdminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateToken, authorize('admin'));

router.get('/dashboard', AdminController.getDashboardStats);
router.get('/shops', AdminController.getAllShops);
router.patch('/shops/:id/approve', AdminController.approveShop);
router.patch('/shops/:id/reject', AdminController.rejectShop);
router.patch('/shops/:id/suspend', AdminController.suspendShop);
router.patch('/shops/:id/feature', AdminController.toggleFeatured);

router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id/ban', AdminController.toggleUserBan);

router.get('/payments', AdminController.getAllPayments);
router.get('/analytics', AdminController.getAnalytics);

module.exports = router;
