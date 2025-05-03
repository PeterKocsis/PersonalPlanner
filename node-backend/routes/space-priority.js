const express = require('express');
const router = express.Router();
const SpacePriority = require('../models/spacePriority');

router.put('', (req, res, next) => {
    const spacePrioList = req.body;
    console.log('Received space priority:', spacePrioList);
    SpacePriority.find()
        .then((spacePriorityDoc) => {
            if (spacePriorityDoc.length > 0) {
                spacePriorityDoc[0].spaceList = spacePrioList;
                spacePriorityDoc[0].save()
                    .then(() => {
                        res.status(200).json({
                            message: 'Space priority updated successfully!'
                        });
                    })
                    .catch(error => {
                        console.error('Error updating space priority:', error);
                        res.status(500).json({
                            message: 'Error updating space priority'
                        });
                    });
            } else {
                res.status(404).json({
                    message: 'Space priority not found'
                });
            }
        })
        .catch(error => {
            console.error('Error finding space priority:', error);
            res.status(500).json({
                message: 'Error finding space priority'
            });
        });
    
})

module.exports = router;