const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnection = require('../config/database');

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const TokenVerificationrSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
});

const TokenVerification = dbConnection.model(
  'TokenVerification',
  TokenVerificationrSchema
);

module.exports = TokenVerification;
