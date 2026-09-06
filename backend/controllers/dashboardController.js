const Transaction = require('../models/Transaction');
const SavingsGoal = require('../models/SavingsGoal');
const Asset = require('../models/Asset');
const Habit = require('../models/Habit');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId });
    let totalIncome = 0;
    let totalExpenses = 0;
    
    transactions.forEach((tx) => {
      if (tx.type === 'Income') totalIncome += tx.amount;
      if (tx.type === 'Expense') totalExpenses += tx.amount;
    });

    const totalBalance = totalIncome - totalExpenses;

    const goals = await SavingsGoal.find({ userId });
    const totalSavings = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
    const targetSavings = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);

    const assets = await Asset.find({ userId });
    const totalInvestments = assets.reduce((acc, asset) => acc + asset.currentValue, 0);

    const currentNetWorth = totalBalance + totalSavings + totalInvestments;

    // Calculate Financial Health Score (0-100)
    let score = 50; // Base score
    
    // Factor 1: Savings Rate (Income vs Expense)
    if (totalIncome > 0) {
      const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
      if (savingsRate > 20) score += 20;
      else if (savingsRate > 10) score += 10;
      else if (savingsRate < 0) score -= 20;
    }

    // Factor 2: Goal Progress
    if (targetSavings > 0) {
      const goalProgress = (totalSavings / targetSavings) * 100;
      if (goalProgress > 50) score += 15;
      else if (goalProgress > 20) score += 5;
    }

    // Factor 3: Habits
    const habits = await Habit.find({ userId });
    const activeHabits = habits.filter(h => h.streak > 3).length;
    score += (activeHabits * 5);

    // Cap score at 100
    const healthScore = Math.min(Math.max(Math.round(score), 0), 100);

    res.status(200).json({
      totalBalance,
      totalIncome,
      totalExpenses,
      totalSavings,
      totalInvestments,
      currentNetWorth,
      healthScore
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics (charts data)
// @route   GET /api/dashboard/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId }).sort({ date: 1 });
    
    // Expense Breakdown
    const expenseBreakdown = {};
    const cashFlowMap = {}; // Format: "MMM YYYY": { income, expense }
    
    transactions.forEach(tx => {
      if (tx.type === 'Expense') {
        if (!expenseBreakdown[tx.category]) expenseBreakdown[tx.category] = 0;
        expenseBreakdown[tx.category] += tx.amount;
      }

      const dateObj = new Date(tx.date);
      const monthYear = dateObj.toLocaleString('default', { month: 'short' }) + ' ' + dateObj.getFullYear();
      
      if (!cashFlowMap[monthYear]) {
        cashFlowMap[monthYear] = { name: monthYear, Income: 0, Expense: 0 };
      }
      
      if (tx.type === 'Income') cashFlowMap[monthYear].Income += tx.amount;
      if (tx.type === 'Expense') cashFlowMap[monthYear].Expense += tx.amount;
    });
    
    const formattedExpenseBreakdown = Object.keys(expenseBreakdown).map(key => ({
      name: key,
      value: expenseBreakdown[key]
    }));

    const cashFlowData = Object.values(cashFlowMap);

    res.status(200).json({
      expenseBreakdown: formattedExpenseBreakdown,
      cashFlow: cashFlowData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get insights
// @route   GET /api/dashboard/insights
// @access  Private
const getInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const insights = [];

    const habits = await Habit.find({ userId });
    const strongHabits = habits.filter(h => h.streak >= 7);
    
    if (strongHabits.length > 0) {
      insights.push(`Great job! You have ${strongHabits.length} financial habits with a 7+ day streak.`);
    }

    const goals = await SavingsGoal.find({ userId, status: 'In Progress' });
    const closeGoals = goals.filter(g => (g.currentAmount / g.targetAmount) > 0.8);
    if (closeGoals.length > 0) {
      insights.push(`You are over 80% close to achieving your '${closeGoals[0].name}' goal!`);
    }

    res.status(200).json({ insights });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getAnalytics,
  getInsights
};
