const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.route('/').put(protect, updateProfile);

module.exports = router;
