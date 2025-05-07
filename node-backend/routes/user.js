const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SpacePriority = require('../models/spacePriority');
const mongoose = require('mongoose');

router.post('/signup', async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Hash the password
        const hash = await bcrypt.hash(req.body.password, 10);

        // Create the user
        const user = new User({
            email: req.body.email,
            password: hash
        });
        
        // Save the user within the transaction
        const savedUser = await user.save({ session });
        
        // Create the SpacePriority
        const spacePrio = new SpacePriority({
            spaceList: [],
            ownerID: savedUser._id
        });
        // Save the SpacePriority within the transaction
        await spacePrio.save({ session });

        // Commit the transaction
        await session.commitTransaction();

        res.status(201).json({
            message: 'User created successfully!',
            result: savedUser
        });
    } catch (err) {
        // Abort the transaction in case of an error
        await session.abortTransaction();

        console.error('Error creating user:', err);
        res.status(500).json({
            error: err
        });
    } finally {
        session.endSession();
    }
});

router.post('/login', async (req, res, next) => {
    let fetchedUser;
    try {
        fetchedUser = await User.findOne({ email: req.body.email })
        const hashMatch = bcrypt.compare(req.body.password, fetchedUser.password)
        if (hashMatch) {
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                'This is a secret phrase and should be much longer and more secure',
                { expiresIn: 3600 }
            );
            return res.status(200).json({
                token: token,
                expiresIn: 3600,
            });
        } else {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
});

module.exports = router;