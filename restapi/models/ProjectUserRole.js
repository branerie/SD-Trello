const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;
const { ObjectId, Boolean } = Schema.Types;

const projectUserRoleSchema = new Schema({
    admin: {
        type: Boolean,
        required: true
    },
    projectId: {
        type: ObjectId,
        ref: "Project",
        required: true
    },
    memberId: {
        type: ObjectId,
        ref: "User",
        required: true
    }
})


module.exports = new Model('ProjectUserRole', projectUserRoleSchema);

