const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get user savings goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user._id });
    res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a savings goal
// @route   POST /api/goals
// @access  Private
const addGoal = async (req, res, next) => {
  try {
    const { name, targetAmount, deadline, category, description } = req.body;

    if (!name || !targetAmount) {
      res.status(400);
      throw new Error('Please provide goal name and target amount');
    }

    const goal = await SavingsGoal.create({
      userId: req.user._id,
      name,
      targetAmount,
      deadline,
      category,
      description,
    });

    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal || goal.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Goal not found or not authorized');
    }

    const updatedGoal = await SavingsGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedGoal);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal || goal.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Goal not found or not authorized');
    }

    await goal.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Contribute to a goal
// @route   POST /api/goals/:id/contribute
// @access  Private
const contributeToGoal = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error('Please provide a valid contribution amount');
    }

    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal || goal.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Goal not found or not authorized');
    }

    goal.currentAmount += Number(amount);
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'Completed';
    }

    await goal.save();
    res.status(200).json(goal);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  contributeToGoal
};
