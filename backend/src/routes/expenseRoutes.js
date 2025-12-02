const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  deleteExpense,
  getExpenseSummary,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
// syntax: router.route(path).method(middleware, controller)

// specific routes must come before parameterized routes (/:id)
router.get('/summary', protect, getExpenseSummary);

router.route('/')
  .get(protect, getExpenses)
  .post(protect, createExpense);

router.route('/:id')
  .delete(protect, deleteExpense);

module.exports = router;