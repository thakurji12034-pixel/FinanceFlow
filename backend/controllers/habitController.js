const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');

// @desc    Get user habits
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });
    res.status(200).json(habits);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a habit
// @route   POST /api/habits
// @access  Private
const addHabit = async (req, res, next) => {
  try {
    const { name, description, frequency, target, reminder } = req.body;

    if (!name || !frequency) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const habit = await Habit.create({
      userId: req.user._id,
      name,
      description,
      frequency,
      target,
      reminder,
    });

    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Habit not found or user not authorized');
    }

    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedHabit);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Habit not found or user not authorized');
    }

    await habit.deleteOne();
    await HabitCompletion.deleteMany({ habitId: req.params.id });

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a habit for the current date
// @route   POST /api/habits/:id/complete
// @access  Private
const completeHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Habit not found or user not authorized');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    const existingCompletion = await HabitCompletion.findOne({
      habitId: habit._id,
      date: { $gte: today }
    });

    if (existingCompletion) {
      res.status(400);
      throw new Error('Habit already completed today');
    }

    // Complete habit
    await HabitCompletion.create({
      habitId: habit._id,
      userId: req.user._id,
      date: new Date()
    });

    // Update streak (simplified logic)
    habit.streak += 1;
    if (habit.streak > habit.longestStreak) {
      habit.longestStreak = habit.streak;
    }
    await habit.save();

    res.status(200).json({ message: 'Habit completed', habit });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  completeHabit
};
