const mongoose = require('mongoose');
var message = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    exams: String,
    message: String,
}, {collection: 'messages'});

const Message = mongoose.model('Message', message);

module.exports = Message;