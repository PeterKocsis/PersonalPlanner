const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const TimeFrameUnscheduledTasks = require('../models/frameTasksToSchedule');
const daySchedule = require('../models/daySchedule');
const { getTimeFramesFromDateRange, getWrapperTimeFrame, getNextTimeFrame, getPreviousTimeFrame } = require('../utilities/time-frame-helper');

const checkAuth = require('../middleware/check-auth');

router.get('', checkAuth, (req, res, next) => {
    const { startDate, endDate } = req.query;
    console.log('Received query parameters:', { startDate, endDate });

    // Validate query parameters
    if (!startDate || !endDate) {
        return res.status(400).json({
            message: 'Missing required query parameters: startDate and endDate',
        });
    }

    // Parse and validate dates
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
            message: 'Invalid date format. Use a valid ISO date string.',
        });
    }

    // Ensure startDate is before endDate
    if (start > end) {
        return res.status(400).json({
            message: 'startDate must be earlier than endDate',
        });
    }

    console.log('Received date range:', { startDate, endDate });

    try {
        // Fetch time frames within the specified date range
        const timeFrames = getTimeFramesFromDateRange(start, end);
        // Get day schedules for the time frames
        console.log('Time frames:', timeFrames);

        res.status(200).json({
            message: 'Time frames fetched successfully',
            timeFrames,
        });
    } catch (error) {
        console.error('Error fetching time frames:', error);
        res.status(500).json({
            message: 'Error fetching time frames',
        });
    }
});

router.get('/current', checkAuth, async (req, res, next) => {
    try {
        const currentDate = new Date();

        res.status(200).json({
            message: 'Current time frame fetched successfully',
            timeFrame: getWrapperTimeFrame(currentDate),
        });
    } catch (error) {
        console.error('Error fetching current time frame:', error);
        res.status(500).json({
            message: 'Error fetching current time frame',
        });
    }
}
);

router.get('/next', checkAuth, async (req, res, next) => {
    try {
        const { currentStartDate, currentEndDate } = req.query;
        console.log('Received query parameters for next time frame:', { currentStart: currentStartDate, currentEnd: currentEndDate });
        // Validate query parameters
        if (!currentStartDate || !currentEndDate) {
            return res.status(400).json({
                message: 'Missing required query parameters: currentStart and currentEnd',
            });
        }
        // Parse and validate dates
        const start = new Date(currentStartDate);
        const end = new Date(currentEndDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: 'Invalid date format. Use a valid ISO date string.',
            });
        }
        // Ensure startDate is before endDate
        if (start > end) {
            return res.status(400).json({
                message: 'currentStart must be earlier than currentEnd',
            });
        }
        console.log('Received date range for next time frame:', { currentStart: currentStartDate, currentEnd: currentEndDate });
        // Fetch the next time frame
        const nextTimeFrame = getNextTimeFrame(end);

        res.status(200).json({
            message: 'Next time frame fetched successfully',
            timeFrame: nextTimeFrame,
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
        console.log('Received query parameters for previous time frame:', { currentStart: currentStartDate, currentEnd: currentEndDate });
        // Validate query parameters
        if (!currentStartDate || !currentEndDate) {
            return res.status(400).json({
                message: 'Missing required query parameters: currentStart and currentEnd',
            });
        }
        // Parse and validate dates
        const start = new Date(currentStartDate);
        const end = new Date(currentEndDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: 'Invalid date format. Use a valid ISO date string.',
            });
        }
        // Ensure startDate is before endDate
        if (start > end) {
            return res.status(400).json({
                message: 'currentStart must be earlier than currentEnd',
            });
        }
        console.log('Received date range for previous time frame:', { currentStart: currentStartDate, currentEnd: currentEndDate });
        const previousTimeFrame = getPreviousTimeFrame(end);

        res.status(200).json({
            message: 'Previous time frame fetched successfully',
            timeFrame: previousTimeFrame,
        });
    } catch (error) {
        console.error('Error fetching previous time frame:', error);
        res.status(500).json({
            message: 'Error fetching previous time frame',
        });
    }
});

router.post('', checkAuth, async (req, res, next) => {
    const { startDate, endDate, index, } = req.body;

    if (!startDate || !endDate) {
        return res.status(400).json({
            message: 'Missing required fields: startDate and endDate',
        });
    }

    try {
        const newTimeFrame = new TimeFrame({
            index: index,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            ownerId: req.userData.userId,
        });

        const savedTimeFrame = await newTimeFrame.save();
        res.status(201).json({
            message: 'Time frame created successfully',
            timeFrame: savedTimeFrame,
        });
    } catch (error) {
        console.error('Error creating time frame:', error);
        res.status(500).json({
            message: 'Error creating time frame',
        });
    }
});

module.exports = router;