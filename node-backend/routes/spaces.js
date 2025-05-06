const express = require('express');
const router = express.Router();
const Space = require('../models/space');
const SpacePriority = require('../models/spacePriority');
const checkAuth = require('../middleware/check-auth');

router.post('', checkAuth, (req, res, next) => {
    const space = req.body;
    console.log('Received displayName:', space);
    const newSpace = new Space({
        displayName: space.displayName
    });
    SpacePriority.find().then((spacePriority) => {
        console.log('Space priority:', spacePriority);
        if (spacePriority.length === 0) {
            const newSpacePriority = new SpacePriority({
                spaceList: []
            });
            newSpacePriority.spaceList.push(newSpace._id);
            newSpacePriority.save()
                .then(() => {
                    console.log('Space priority created successfully!');
                })
                .catch(error => {
                    console.error('Error creating space priority:', error);
                });
        } else {
            spacePriority[0].spaceList.push(newSpace._id);
            spacePriority[0].save()
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
            
        }
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    Space.deleteOne({ _id: req.params.id })
        .then(() => {
            SpacePriority.find()
                .then((spacePriority) => {
                    const index = spacePriority[0].spaceList.indexOf(req.params.id);
                    if (index > -1) {
                        spacePriority[0].spaceList.splice(index, 1);
                    }
                    spacePriority[0].save()
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
    Space.find()
        .then(spaces => {
            SpacePriority.find()
            .then((spacePriority) => {
                const sortedSpaces = [];
                spacePriority[0].spaceList.forEach((spaceId) => {
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