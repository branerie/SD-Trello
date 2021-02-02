const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model
const { String, ObjectId, Boolean } = Schema.Types


const messageSchema = new Schema({

    subject: {
        type: String,
        required: true
    },

    team: {
        id: String,
        name: String,
        isDeleted: Boolean
    },

    project: {
        id: String,
        name: String,
        isDeleted: Boolean
    },

    list: {},

    card: {},

    sendFrom: {
        type: ObjectId,
        ref: "User"
    },

    accepted: {
        type: Boolean
    },

    canceled: {
        type: Boolean
    },

    recievers: [{
        type: ObjectId,
        ref: "User"
    }]
},
{
    timestamps: true
}
)

module.exports = new Model('Message', messageSchema)