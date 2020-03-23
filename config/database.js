const mongoose = require('mongoose');

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

const connection = mongoose.createConnection(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Check connection
connection.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for DB errors
connection.on('error', function (err) {
    console.log(err);
});

// Expose the connection
module.exports = connection;