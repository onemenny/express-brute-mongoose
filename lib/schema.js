const mongoose = require('mongoose');

const bruteForceSchema = new mongoose.Schema(
  {
    _id: { type: String, index: 1 },
    data: {
      count: Number,
      lastRequest: Date,
      firstRequest: Date
    },
    expires: Date
  },
  { collection: 'bruteforce' }
);

module.exports = bruteForceSchema;
