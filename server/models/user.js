const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{Value} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function() {
    const access = 'auth';
    const token = jwt.sign({
        _id: this._id.toHexString(),
        access
    }, 'abc123').toString();

    this.tokens = this.tokens.concat([{ access, token }]);
    return this.save().then(() => token);
};

userSchema.statics.findByToken = function(token) {
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return this.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

const User = mongoose.model('User', userSchema);

module.exports.User = User;