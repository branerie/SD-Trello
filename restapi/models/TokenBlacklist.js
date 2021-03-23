const mongoose = require('mongoose')

const { Schema } = mongoose
const Model = mongoose.model
const { String, Date } = Schema.Types

const tokenBlacklist = new Schema({
    token: String,
    expirationDate: Date
})

module.exports = new Model('TokenBlacklist', tokenBlacklist)