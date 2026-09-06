const express = require('express');
const router = express.Router();
const { getUsers, getAdminAnalytics } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/users', protect, admin, getUsers);
router.get('/analytics', protect, admin, getAdminAnalytics);

module.exports = router;
