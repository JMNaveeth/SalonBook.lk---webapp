const express = require('express');
const UserController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', UserController.getProfile);
router.put('/profile', upload.single('avatar'), UserController.updateProfile);

router.get('/favourites', authorize('customer'), UserController.getFavourites);
router.post('/favourites/:shopId', authorize('customer'), UserController.addFavourite);
router.delete('/favourites/:shopId', authorize('customer'), UserController.removeFavourite);

router.get('/notifications', UserController.getNotifications);
router.patch('/notifications/:id/read', UserController.markNotificationRead);

module.exports = router;
