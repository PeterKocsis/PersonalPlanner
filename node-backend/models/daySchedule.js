const mongoose = require('mongoose');


const dayScheduleShema = mongoose.Schema({
    dateOfQueue: { type: Date, required: true },
    taskIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Task', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const model = mongoose.model('DaySchedule', dayScheduleShema);
module.exports = model;