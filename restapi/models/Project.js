const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model
const { String, ObjectId } = Schema.Types
const projectUserRole = require('./ProjectUserRole')


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

    membersRoles: [{
        type: ObjectId,
        ref: "ProjectUserRole"
    }],

    lists: [{ type: ObjectId, ref: "List" }]

})


module.exports = new Model('Project', projectSchema)