const express = require('express');
const router = express.Router();
const Space = require('../models/space');
const SpacePriority = require('../models/spacePriority');
const checkAuth = require('../middleware/check-auth');
const mongoose = require('mongoose');

router.post('', checkAuth, async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const space = req.body;
        console.log('Received displayName:', space);

        // Create a new space
        const newSpace = new Space({
            displayName: space.displayName,
            ownerID: req.userData.userId
        });

        // Find the user's SpacePriority document
        const spacePriority = await SpacePriority.findOne({ ownerID: req.userData.userId }).session(session);

        if (!spacePriority) {
            throw new Error('Space priority not found for the user');
        }

        console.log('Space priority:', spacePriority);

        // Add the new space ID to the space priority list
        spacePriority.spaceList.push(newSpace._id);

        // Save the updated SpacePriority document
        await spacePriority.save({ session });

        // Save the new space
        const savedSpace = await newSpace.save({ session });

        // Commit the transaction
        await session.commitTransaction();

        res.status(201).json({
            message: `Space created successfully with id: ${savedSpace._id}!`,
            newSpace: savedSpace
        });
    } catch (error) {
        // Abort the transaction in case of an error
        await session.abortTransaction();

        console.error('Error creating space or updating space priority:', error);
        res.status(500).json({
            message: 'Error creating space or updating space priority',
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

router.delete('/:id', checkAuth, async (req, res, next) => {
    console.log('Deleting space with ID:', req.params.id);
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await Space.deleteOne({ _id: req.params.id, ownerID: req.userData.userId }).session(session )
        userSpacePriority = await SpacePriority.findOne({ ownerID: req.userData.userId }).session(session);
        if (!userSpacePriority) {
            throw new Error('Space priority not found for the user');
        }
        console.log('Space priority:', userSpacePriority);
        const index = userSpacePriority.spaceList.indexOf(req.params.id);  
        if (index > -1) {
            userSpacePriority.spaceList.splice(index, 1);
        }
        await userSpacePriority.save({ session });
        await session.commitTransaction();
        console.log('Space priority updated successfully!');
        console.log('Space deleted successfully!');
        res.status(200).json({
            message: 'Space deleted successfully!'
        });
    } catch (error) {
        // Abort the transaction in case of an error
        await session.abortTransaction();

        console.error('Error deleting space or updating space priority:', error);
        res.status(500).json({
            message: 'Error deleting space or updating space priority',
            error: error.message
        });        
    } finally {
        session.endSession();
    }
});

router.get('', checkAuth, async (req, res, next) => {
    console.log('Fetching spaces for user:', req.userData.userId);
    //? Consider to remove space priority from here and use it in the front end
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        userSpaces =  await Space.find({ ownerID: req.userData.userId, excludedFromPrioList: false }).session(session)
        userSpacePriority = await SpacePriority.findOne({ ownerID: req.userData.userId }).session(session)

        if (!userSpaces || !userSpacePriority) {
            throw new Error('Unable to get spaces or space priority for the user');
        }

        const sortedSpaces = [];
        userSpacePriority.spaceList.forEach((spaceId) => {
            const space = userSpaces.find(space => space._id.toString() === spaceId.toString());
            if (space) {
                sortedSpaces.push(space);
            }
        });
        // console.log('Sorted spaces:', sortedSpaces);
        await session.commitTransaction();
        // console.log('Spaces fetched successfully!');

        res.status(200).json({
            message: 'Spaces fetched successfully!',
            spaces: sortedSpaces
        });
    } catch (error) {
        await session.abortTransaction();

        console.error('Error fetching spaces:', error);
        res.status(500).json({
            message: 'Error fetching spaces'
        });
    } finally {
        session.endSession();
    }
});

router.get('/inbox', checkAuth, async (req, res, next) => {
    console.log('Fetching inbox space for user:', req.userData.userId);

    try {
        const inboxSpace = await Space.findOne({
            ownerID: req.userData.userId,
            excludedFromPrioList: true
        });

        if (!inboxSpace) {
            return res.status(404).json({
                message: 'Inbox space not found'
            });
        }

        // console.log('Inbox space:', inboxSpace);
        res.status(200).json({
            message: 'Inbox space fetched successfully!',
            inboxSpace: inboxSpace
        });
    } catch (error) {
        console.error('Error fetching inbox space:', error);
        res.status(500).json({
            message: 'Error fetching inbox space',
            error: error.message
        });
    }
});

module.exports = router;