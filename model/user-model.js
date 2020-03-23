const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnection = require('../config/database')

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new Schema({
    username: String,
    hash: String,
    salt: String,
    googleId: String,
    facebookId: String,
    thumbnail: String,
    admin: Boolean
});

const User = dbConnection.model('User', UserSchema);

module.exports = User;