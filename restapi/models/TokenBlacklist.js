const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Date } = Schema.Types;

const tokenBlacklist = new Schema({
    token: String,
    expirationDate: Date
});

module.exports = new Model('TokenBlacklist', tokenBlacklist);