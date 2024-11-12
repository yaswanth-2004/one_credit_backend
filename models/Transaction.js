const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0, 
  },
  description: {
    type: String,
    required: true,
    trim: true, 
  },
  debit: {
    type: Boolean,
    required: true, 
  },
  date: {
    type: Date,
    default: Date.now, 
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
