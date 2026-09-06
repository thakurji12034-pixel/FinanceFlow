const express = require('express');
const router = express.Router();
const { getSummary, getAnalytics, getInsights } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/summary', protect, getSummary);
router.get('/analytics', protect, getAnalytics);
router.get('/insights', protect, getInsights);

module.exports = router;
