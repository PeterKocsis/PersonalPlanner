const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    inboxSpaceId: {type: String },
    othersSpaceId: {type: String },
    spacePriorityId: { type: String },
    settingsId: { type: mongoose.Schema.Types.ObjectId, ref: 'Settings' },
});

userSchema.plugin(uniqueValidator);
const model = mongoose.model('User', userSchema);
module.exports = model;