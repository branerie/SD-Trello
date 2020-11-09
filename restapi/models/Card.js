const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model
const { String, ObjectId } = Schema.Types


const cardSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    author: {
        type: ObjectId,
        ref: "User",
        required: true
    },

    members: [{
        type: ObjectId,
        ref: "User"
    }],

    dueDate: Date,

    progress:{
        type: Number
    }

})


module.exports = new Model('Card', cardSchema)