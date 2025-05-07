const express = require('express');
const router = express.Router();
const Space = require('../models/space');
const SpacePriority = require('../models/spacePriority');
const checkAuth = require('../middleware/check-auth');

router.post('', checkAuth, (req, res, next) => {
    const space = req.body;
    console.log('Received displayName:', space);
    const newSpace = new Space({
        displayName: space.displayName,
        ownerID: req.userData.userId
    });
    SpacePriority.findOne({ownerID: req.userData.userId}).then((spacePriority) => {
        console.log('Space priority:', spacePriority);
        spacePriority.spaceList.push(newSpace._id);
        spacePriority.save()
            .then(() => {
                newSpace.save()
                    .then((space) => {
                        res.status(201).json({
                            message: `Space created successfully with id: ${space._id}!`,
                            newSpace: space
                        });
                    })
                    .catch(error => {
                        console.error('Error creating space:', error);
                    });
                console.log('Space priority updated successfully!');
            })
            .catch(error => {
                console.error('Error updating space priority:', error);
            });
            
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    Space.deleteOne({ _id: req.params.id, ownerID: req.userData.userId })
        .then(() => {
            SpacePriority.findOne({ ownerID: req.userData.userId })
                .then((spacePriority) => {
                    const index = spacePriority.spaceList.indexOf(req.params.id);
                    if (index > -1) {
                        spacePriority[0].spaceList.splice(index, 1);
                    }
                    spacePriority.save()
                        .then(() => {
                            console.log('Space priority updated successfully!');
                        })
                        .catch(error => {
                            console.error('Error updating space priority:', error);
                        });
                })
                .catch(error => {
                    console.error('Error finding space priority:', error);
                });
            res.status(200).json({
                message: 'Space deleted successfully!'
            });
        })
        .catch(error => {
            console.error('Error deleting space:', error);
            res.status(500).json({
                message: 'Error deleting space'
            });
        });
});

router.get('', checkAuth, (req, res, next) => {
    Space.find({ ownerID: req.userData.userId })
        .then(spaces => {
            SpacePriority.findOne({ ownerID: req.userData.userId})
            .then((spacePriority) => {
                const sortedSpaces = [];
                spacePriority.spaceList.forEach((spaceId) => {
                    const space = spaces.find(space => space._id.toString() === spaceId.toString());
                    if (space) {
                        sortedSpaces.push(space);
                    }
                });
                console.log('Sorted spaces:', sortedSpaces);
                res.status(200).json({
                    message: 'Spaces fetched successfully!',
                    spaces: sortedSpaces
                });
            })
        })
        .catch(error => {
            console.error('Error fetching spaces:', error);
            res.status(500).json({
                message: 'Error fetching spaces'
            });
        });
});

module.exports = router;