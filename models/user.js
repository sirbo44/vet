const mongoose = require('mongoose');
var user = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    role: String
}, {collection: 'users'})

const User = mongoose.model('User', user);

module.exports = User;