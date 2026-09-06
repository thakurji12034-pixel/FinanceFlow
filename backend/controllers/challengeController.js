const Challenge = require('../models/Challenge');

// @desc    Get user challenges
// @route   GET /api/challenges
// @access  Private
const getChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ userId: req.user._id });
    res.status(200).json(challenges);
  } catch (error) {
    next(error);
  }
};

// @desc    Join a new challenge
// @route   POST /api/challenges
// @access  Private
const joinChallenge = async (req, res, next) => {
  try {
    const { name, description, target, days } = req.body;

    if (!name || !target || !days) {
      res.status(400);
      throw new Error('Please provide name, target, and days');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    const challenge = await Challenge.create({
      userId: req.user._id,
      name,
      description,
      target,
      progress: 0,
      startDate,
      endDate,
    });

    res.status(201).json(challenge);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChallenges,
  joinChallenge
};
