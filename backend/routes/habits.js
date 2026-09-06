const express = require('express');
const router = express.Router();
const {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  completeHabit
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getHabits).post(protect, addHabit);
router.route('/:id').put(protect, updateHabit).delete(protect, deleteHabit);
router.post('/:id/complete', protect, completeHabit);

module.exports = router;
