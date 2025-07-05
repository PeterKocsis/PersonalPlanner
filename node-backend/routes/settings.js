const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Settings = require('../models/settings');
const { createAvailabilitySettings } = require('../utilities/availability-helper');

router.get('', checkAuth, async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    console.log('Fetching settings for user:', userId);
    
    const settings = await Settings.findOne({ ownerId: userId });
    
    if (!settings) {
      return res.status(404).json({
        message: 'Settings not found for this user',
      });
    }
    
    console.log('Fetched settings:', settings.settings.frameSettings.availability.dailyAvailabilities[0].timeSlots);
    res.status(200).json({
      message: 'Settings fetched successfully',
      settings: settings.settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({
      message: error.message || 'Error fetching settings',
    });
  }
});

router.put('', checkAuth, async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    console.log('Updating settings for user:', userId);
    
    const { settings } = req.body;

    console.log('Received settings data', settings);
    
    if (!settings) {
      return res.status(400).json({
        message: 'Settings data is required',
      });
    }
    
    const storedSettings = await Settings.findOne({ ownerId: userId });
    if (!storedSettings) {
      return res.status(404).json({
        message: 'Settings not found for this user',
      });
    }
    const updatedAvailability = createAvailabilitySettings(settings.frameSettings.availability);
    const updatedSettings = {
      ...storedSettings.settings,
      frameSettings: {
        ...storedSettings.settings.frameSettings,
        availability: updatedAvailability,
        balances: settings.frameSettings.balances,
      },
    };

    await storedSettings.set('settings', updatedSettings);
    await storedSettings.save();
    
    res.status(200).json({
      message: 'Settings updated successfully',
      settings: storedSettings.settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({
      message: error.message || 'Error updating settings',
    });
  }
});

module.exports = router;