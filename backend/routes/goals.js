const express = require('express');
const router = express.Router();
const {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  contributeToGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getGoals).post(protect, addGoal);
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal);
router.post('/:id/contribute', protect, contributeToGoal);

module.exports = router;
