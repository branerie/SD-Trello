const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model
const { String, ObjectId } = Schema.Types


const listSchema = new Schema({

    name: {
        type: String,    
        required: true
    },   

    cards: [{
        type: ObjectId,
        ref: "Card"
    }],
   
})


module.exports = new Model('List', listSchema)