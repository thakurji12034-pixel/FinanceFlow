require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Habit = require('./models/Habit');
const SavingsGoal = require('./models/SavingsGoal');
const Asset = require('./models/Asset');
const connectDB = require('./config/db');

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Transaction.deleteMany();
    await Habit.deleteMany();
    await SavingsGoal.deleteMany();
    await Asset.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('password123', salt);
    const demoPassword = await bcrypt.hash(process.env.DEMO_USER_PASSWORD || 'password123', salt);

    // Create Admin and Regular User
    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@financeflow.com', password: adminPassword, role: 'admin' },
      { name: 'Vandana Tanwar', email: '2006vtanwar@gmail.com', password: demoPassword, role: 'user' }
    ]);

    const vandana = users[1]._id;

    // Transactions (6 months of data)
    const transactions = [];
    const today = new Date();
    
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 15);
      
      transactions.push({
        userId: vandana, type: 'Income', amount: 45000, category: 'Salary', description: 'Monthly Salary', date: monthDate
      });
      transactions.push({
        userId: vandana, type: 'Income', amount: 8000, category: 'Freelance', description: 'Web Project', date: new Date(monthDate.getTime() + 86400000 * 2)
      });
      transactions.push({
        userId: vandana, type: 'Expense', amount: 12000, category: 'Rent', description: 'House Rent', date: new Date(monthDate.getTime() + 86400000 * 3)
      });
      transactions.push({
        userId: vandana, type: 'Expense', amount: 4500, category: 'Food', description: 'Groceries & Dining', date: new Date(monthDate.getTime() + 86400000 * 5)
      });
      transactions.push({
        userId: vandana, type: 'Expense', amount: 2800, category: 'Transport', description: 'Fuel & Cab', date: new Date(monthDate.getTime() + 86400000 * 7)
      });
      transactions.push({
        userId: vandana, type: 'Expense', amount: 3000, category: 'Education', description: 'Courses', date: new Date(monthDate.getTime() + 86400000 * 10)
      });
      transactions.push({
        userId: vandana, type: 'Expense', amount: 2000, category: 'Entertainment', description: 'Movies & Subs', date: new Date(monthDate.getTime() + 86400000 * 12)
      });
    }

    await Transaction.insertMany(transactions);

    // Habits
    await Habit.insertMany([
      { userId: vandana, name: 'Save ₹100 everyday', frequency: 'Daily', target: 1, streak: 14, longestStreak: 21 },
      { userId: vandana, name: 'Track expenses', frequency: 'Daily', target: 1, streak: 7, longestStreak: 7 },
      { userId: vandana, name: 'Invest 20% salary', frequency: 'Monthly', target: 1, streak: 4, longestStreak: 6 }
    ]);

    // Savings Goals
    await SavingsGoal.insertMany([
      { userId: vandana, name: 'Emergency Fund', targetAmount: 100000, currentAmount: 68000, category: 'Emergency Fund', status: 'In Progress' },
      { userId: vandana, name: 'New Laptop', targetAmount: 85000, currentAmount: 85000, category: 'New Laptop', status: 'Completed' }
    ]);

    // Assets
    await Asset.insertMany([
      { userId: vandana, name: 'Nifty 50 Index Fund', type: 'Mutual Funds', investedAmount: 25000, currentValue: 28500, purchaseDate: new Date('2023-01-15') },
      { userId: vandana, name: 'HDFC Fixed Deposit', type: 'Fixed Deposits', investedAmount: 40000, currentValue: 42000, purchaseDate: new Date('2023-05-10') },
      { userId: vandana, name: 'Reliance Shares', type: 'Stocks', investedAmount: 15000, currentValue: 17200, purchaseDate: new Date('2023-08-20') }
    ]);

    console.log('Data Imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
