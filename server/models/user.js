const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 1
    }
});

const User = mongoose.model('User', userSchema);

module.exports.User = User;