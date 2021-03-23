const mongoose = require('mongoose')

const { Schema } = mongoose
const Model = mongoose.model
const { String, ObjectId } = Schema.Types


const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: ObjectId,
        ref: 'User'
    }],
    requests: [{
        type: ObjectId,
        ref: 'User'
    }],
    projects: [{
        type: ObjectId,
        ref: 'Project'
    }]
})


module.exports = new Model('Team', teamSchema)