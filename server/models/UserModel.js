require('dotenv').config()
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, sparse: true, trim: true},
    email: { type: String, unique: true},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
