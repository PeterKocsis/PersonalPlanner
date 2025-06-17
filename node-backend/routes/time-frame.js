const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const SchedulePocketModel = require('../models/schedulePocket');
const daySchedule = require('../models/daySchedule');
const { getTimeRangesFromDateRange, getNextTimeRange, getPreviousTimeRange, getTimeRangeByIndex } = require('../utilities/time-range-helper');
const { collectFrameData } = require('../utilities/time-frame-helper');
const checkAuth = require('../middleware/check-auth');


router.get('', checkAuth, async (req, res, next) => {
    let timeRanges = [];
    const { startDate, endDate } = req.query;
    console.log('Received query parameters:', { startDate, endDate });

    // Validate query parameters
    try {
        timeRanges = getTimeRangesFromDateRange(startDate, endDate);

        //Fetch pockets for date rage
        console.log('Fetched time ranges:', timeRanges);
        const timeRangesWithPocketTasks2 = await collectFrameData(timeRanges, req.userData.userId);

        console.log('Time frames:', timeRangesWithPocketTasks2);
        res.status(200).json({
            message: 'Time frames fetched successfully',
            timeFrames: timeRangesWithPocketTasks2,
        });
    } catch (error) {
        console.log('Error fetching time frames:', error);
        return res.status(400).json({
            message: error.message || 'Error fetching time frames',
        });
    }
});

router.get('/next', checkAuth, async (req, res, next) => {
    try {
        const { currentStartDate, currentEndDate } = req.query;
        console.log('Received query parameters for next time frame:', { currentStart: currentStartDate, currentEnd: currentEndDate });
        let timeRange = getTimeRangesFromDateRange(currentStartDate, currentEndDate);
        
        // Fetch the next time frame
        const nextTimeRange = getNextTimeRange(timeRange[0].endDate);
        const timeRangesWithPocketTasks2 = await collectFrameData([nextTimeRange], req.userData.userId);

        console.log('Time frames:', timeRangesWithPocketTasks2);
        res.status(200).json({
            message: 'Time frames fetched successfully',
            timeFrame: timeRangesWithPocketTasks2[0],
        });
    } catch (error) {
        console.error('Error fetching next time frame:', error);
        res.status(500).json({
            message: 'Error fetching next time frame',
        });
    }
});

router.get('/previous', checkAuth, async (req, res, next) => {
    try {
        const { currentStartDate, currentEndDate } = req.query;
        timeRange = getTimeRangesFromDateRange(currentStartDate, currentEndDate);
        
        const previousTimeRange = getPreviousTimeRange(timeRange[0].startDate);

        const timeRangesWithPocketTasks2 = await collectFrameData([previousTimeRange], req.userData.userId);

        console.log('Time frames:', timeRangesWithPocketTasks2);
        res.status(200).json({
            message: 'Time frames fetched successfully',
            timeFrame: timeRangesWithPocketTasks2[0],
        });
    } catch (error) {
        console.error('Error fetching previous time frame:', error);
        res.status(500).json({
            message: 'Error fetching previous time frame',
        });
    }
});

router.post('/:year/:index', checkAuth, async (req, res, next) => {
    // Extract year and index from the request parameters
    const { year, index } = req.params;
    const { taskId } = req.body;
    console.log('Received request to assign task:', { year, index, taskId });
    // Validate the request body
    if (!taskId) {
        return res.status(400).json({
            message: 'Missing required field: taskId',
        });
    }
    // Validate year and index
    if (!year || !index) {
        return res.status(400).json({
            message: 'Missing required parameters: year and index',
        });
    }
    // Parse year and index to integers
    const parsedYear = parseInt(year);
    const parsedIndex = parseInt(index);
    if (isNaN(parsedYear) || isNaN(parsedIndex)) {
        return res.status(400).json({
            message: 'Invalid year or index format',
        });
    }
    // Check if there is a frameTasksToSchedule document for the user with the specified year and index
    const mongoose = require('mongoose');
    let session = null;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const timeFrame = getTimeRangeByIndex(parsedYear, parsedIndex);
        console.log('Time frame for assignment:', timeFrame);

        // Find or create a TimeFrameUnscheduledTasks document for the user
        let frameTasksToSchedule = await SchedulePocketModel.findOne({
            ownerId: req.userData.userId,
            year: parsedYear,
            index: parsedIndex
        }).session(session);

        if (!frameTasksToSchedule) {
            frameTasksToSchedule = new SchedulePocketModel({
                ownerId: req.userData.userId,
                year: parsedYear,
                index: parsedIndex,
                taskIds: []
            });
        }

        // Add the task to the tasks array
        frameTasksToSchedule.taskIds.push(taskId);
        await frameTasksToSchedule.save({ session });

        // Update the task with the frameTasksToScheduleId
        const task = await Task.findById(taskId).session(session);
        if (!task) {
            throw new Error('Task not found');
        }
        task.taskPocketRangeId = `${frameTasksToSchedule.year}.${frameTasksToSchedule.index}`;
        await task.save({ session });

        // Get all task within the frameTasksToSchedule
        let tasks = [];
        for (const taskId of frameTasksToSchedule.taskIds) {
            const task = await Task.findById(taskId).session(session);
            if (task) {
                tasks.push(await Task.findById(taskId).session(session));
            }
        }
        timeFrame.pocketsTasks = tasks;

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Task assigned successfully',
            timeFrame,
            task
        });
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        console.error('Error assigning task:', error);
        res.status(500).json({
            message: 'Error assigning task',
        });
    }

});

module.exports = router;