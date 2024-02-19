const mongoose = require('mongoose');
var pet = new mongoose.Schema({
    id: String,
    owner: String,
    exams: String
}, {collection: 'pets'})

const Pet = mongoose.model('Pet', pet);

module.exports = Pet;