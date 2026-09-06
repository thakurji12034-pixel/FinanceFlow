const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Habit = require('../models/Habit');
const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalHabits = await Habit.countDocuments();
    const totalGoals = await SavingsGoal.countDocuments();

    res.status(200).json({
      totalUsers,
      totalTransactions,
      totalHabits,
      totalGoals,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getAdminAnalytics
};
