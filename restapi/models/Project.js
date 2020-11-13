const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model
const { String, ObjectId, Boolean } = Schema.Types

const projectSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true
    },

    author: {
        type: ObjectId,
        ref: "User",
        required: true
    },

    description: {
        type: String
    },

    isFinished: {
       type: Boolean
    },

    membersRoles: [{
        type: ObjectId,
        ref: "ProjectUserRole"
    }],

    lists: [{ type: ObjectId, ref: "List" }]

})


module.exports = new Model('Project', projectSchema)