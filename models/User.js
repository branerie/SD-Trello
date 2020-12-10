const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, ObjectId } = Schema.Types;

const userSchema = new Schema({

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    username: {
        type: String,
        required: true
    },

    password: {
        type: String       
    },  

    imageUrl: {
        type: String
    },

    projects: [{ type: ObjectId, ref: "ProjectUserRole" }],

    inbox: [String]

});

userSchema.methods = {

    matchPassword: function (password) {
        return bcrypt.compare(password, this.password)
    }

}

userSchema.pre('save', function (next) {
    if (this.isModified('password') && this.password) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return }
                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});



module.exports = new Model('User', userSchema);