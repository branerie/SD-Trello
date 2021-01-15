const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model
const { String, ObjectId } = Schema.Types


const messageSchema = new Schema({

    subject: {
        type: String,
        required: true
    },

    team: [{
        type: ObjectId,
        ref: "Team",
    }],

    invitedBy: {
        type: ObjectId,
        ref: "User"
    },

    accepted: {
        type: Boolean
    },

    canceled: {
        type: Boolean
    },

    newMessage: {
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