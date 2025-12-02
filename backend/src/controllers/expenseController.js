const Expense = require('../models/Expense');

// @desc    Get expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
  res.status(200).json(expenses);
};

// @desc    Set expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ message: 'Please add amount and category' });
  }

  const expense = await Expense.create({
    user: req.user.id,
    amount,
    category,
    date: date || Date.now(),
    description,
  });

  res.status(200).json(expense);
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  // Check for user
  if (!req.user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Make sure the logged in user matches the expense user
  if (expense.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await expense.deleteOne();

  res.status(200).json({ id: req.params.id });
};

// Using MongoDB aggregation pipeline here. 
// It's more efficient to group by category on the server side than sending all data to the frontend.
// @route   GET /api/expenses/summary
// @access  Private
const getExpenseSummary = async (req, res) => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          user: req.user._id, // Filter by logged-in user
          date: {
            $gte: firstDay, // Filter from start of month
            $lte: lastDay,  // Filter to end of month
          },
        },
      },
      {
        $group: {
          _id: '$category', // Group by category
          totalAmount: { $sum: '$amount' }, // Sum the amount
          count: { $sum: 1 } // Optional: Count how many expenses in this category
        },
      },
      {
        $sort: { totalAmount: -1 } // Sort by highest spend
      }
    ]);

    res.status(200).json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
  getExpenseSummary,
};