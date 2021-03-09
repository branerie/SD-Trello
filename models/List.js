const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model
const { String, ObjectId } = Schema.Types


const listSchema = new Schema({

    name: {
        type: String,    
        required: true
    },

    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    cards: [{
        type: ObjectId,
        ref: 'Card'
    }],

    color: {
        type: String
    }
   
})


module.exports = new Model('List', listSchema)