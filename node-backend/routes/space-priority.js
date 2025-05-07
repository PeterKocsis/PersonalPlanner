const express = require('express');
const router = express.Router();
const SpacePriority = require('../models/spacePriority');
const checkAuth = require('../middleware/check-auth');

router.put('', checkAuth, async (req, res, next) => {
    const spacePrioList = req.body;
    console.log('Received space priority:', spacePrioList);

    try {
        const spacePriorityDoc = await SpacePriority.findOne({ ownerID: req.userData.userId });

        if (!spacePriorityDoc) {
            return res.status(404).json({
                message: 'Space priority not found'
            });
        }

        spacePriorityDoc.spaceList = spacePrioList;

        await spacePriorityDoc.save();

        res.status(200).json({
            message: 'Space priority updated successfully!'
        });
    } catch (error) {
        console.error('Error updating space priority:', error);
        res.status(500).json({
            message: 'Error updating space priority'
        });
    }
});

module.exports = router;