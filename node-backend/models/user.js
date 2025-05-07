const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const spacePriority = require('./spacePriority');


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
const model = mongoose.model('User', userSchema);
module.exports = model;