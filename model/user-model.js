const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnection = require('../config/database');

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new Schema({
  local: {
    email: String,
    username: String,
    displayName: String,
    hash: String,
    salt: String,
  },
  facebook: {
    id: String,
    token: String,
    displayName: String,
    email: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    displayName: String,
  },
});

const User = dbConnection.model('User', UserSchema);

module.exports = User;
