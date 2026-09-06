const express = require('express');
const router = express.Router();
const { getChallenges, joinChallenge } = require('../controllers/challengeController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getChallenges).post(protect, joinChallenge);

module.exports = router;
