const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { Schema } = mongoose
const Model = mongoose.model
const { String, ObjectId } = Schema.Types
const saltRounds = 10

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    username: {
        type: String,
        required: true
    },

    password: { type: String },

    newPassword: { type: String },

    image: {
        path: { type: String },
        publicId: { type: String }
    },

    projects: [{ type: ObjectId, ref: 'ProjectUserRole' }],

    inbox: [{ type: ObjectId, ref: 'Message' }],

    inboxHistory: [{ type: ObjectId, ref: 'Message' }],

    confirmed: { type: Boolean, default: true },

    newPasswordConfirmed: { type: Boolean, default: true },

    confirmationToken: { type: String, default: '' },

    recentProjects: [],

    lastTeamSelected: { type: String }

})

userSchema.methods.matchPassword = function(password) {
    return bcrypt.compare(password, this.password)
}

userSchema.methods.setConfirmationToken = function() {
    this.confirmationToken = jwt.sign({ data: this._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
}

userSchema.methods.generateConfirmationUrl = function() {
    return `${process.env.HOST}confirmation/${this.confirmationToken}`
}

userSchema.pre('save', (next) => {
    if (this.isModified('password') && this.password) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    next(err)
                    return 
                }

                this.password = hash
                next()
            })
        })
        return
    }
    
    next()
})

module.exports = new Model('User', userSchema)