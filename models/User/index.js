const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String },
    DOB: { type: String },
    userType: { type: String },
    phoneNumber: { type: String },
    registerDate: { type: Date, default: Date.now() },
    avatar: { type: String },
    fullName: { type: String },
    rate: { type: Number, default: 0 },
});

const User = mongoose.model('User', UserSchema, 'User');

module.exports = {
    UserSchema,
    User
};
