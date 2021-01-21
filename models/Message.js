const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model
const { String, ObjectId } = Schema.Types


const messageSchema = new Schema({

    subject: {
        type: String,
        required: true
    },

    team: {
        type: ObjectId,
        ref: "Team",
    },

    project: {
        type: ObjectId,
        ref: "Project",
    },

    list: {
        type: ObjectId,
        ref: "List",
    },

    card: {
        type: ObjectId,
        ref: "Card",
    },

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