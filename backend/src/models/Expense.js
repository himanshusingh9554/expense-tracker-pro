const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a relationship with the User model
    },
    amount: {
      type: Number,
      required: [true, 'Please add a positive amount'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Food', 'Rent', 'Travel', 'Utilities', 'Entertainment', 'Health', 'Other'], // Restricts input to these values to keep data clean
    },
    date: {
      type: Date,
      required: [true, 'Please select a date'],
      default: Date.now,
    },
    description: {
      type: String, // Optional: useful for specific details like "Lunch at Subway"
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);