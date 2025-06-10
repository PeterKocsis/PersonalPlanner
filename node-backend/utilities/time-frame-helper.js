const Task = require('../models/task');
const SchedulePocketModel = require('../models/schedulePocket');

const collectFrameData = async(timeRanges, userId)=> {
    return await Promise.all(
        timeRanges.map(async range => {
        const pockets = await SchedulePocketModel.find({
                ownerId: userId,
                year: range.startDate.getFullYear(),
                index: range.index
            });
            console.log('Pockets for time range:', pockets);
        if (pockets && pockets.length === 0) {
            return {
                ...range,
                pocketsTasks: []
            };;
        } else {
            let pocketTasks = [];
            for (const pocket of pockets) {
                pocketTasks =  await Task.find({
                        _id: { $in: pocket.taskIds },
                        ownerId: userId
                    }
                );
            }
            return {
                ...range,
                pocketsTasks: pocketTasks
            };
        }
    }));
}

module.exports = { collectFrameData };