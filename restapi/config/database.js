const mongoose = require('mongoose');
const config = require('./config');

module.exports = () => {
    return mongoose.connect(process.env.MONGODB_URI || config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
};