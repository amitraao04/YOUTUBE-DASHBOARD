const express = require('express');
const router = express.Router();
const Participant = require('../models/participant');

// Get all participants
router.get('/participants', async (req, res) => {
  try {
    const participants = await Participant.find().select('-__v');
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get participant by username
router.get('/participants/:username', async (req, res) => {
  try {
    const participant = await Participant.findOne({ 
      username: req.params.username.toLowerCase() 
    }).select('-__v');
    
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    res.json(participant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route (create user if doesn't exist)
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    // Find or create participant
    let participant = await Participant.findOne({ username: username.toLowerCase() });
    
    if (!participant) {
      participant = new Participant({
        username: username.toLowerCase(),
        subscribers: 0,
        subscriberList: []
      });
      await participant.save();
    }
    
    res.json(participant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add subscriber
router.post('/subscribers', async (req, res) => {
  try {
    const { username, subscriberUsername } = req.body;
    
    if (!username || !subscriberUsername) {
      return res.status(400).json({ message: 'Username and subscriber username are required' });
    }
    
    // Find participant
    const participant = await Participant.findOne({ username: username.toLowerCase() });
    
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    // Check if subscriber already exists
    if (participant.subscriberList.includes(subscriberUsername)) {
      return res.status(400).json({ message: 'This subscriber is already added by you' });
    }
    
    // Add subscriber
    participant.subscribers += 1;
    participant.subscriberList.push(subscriberUsername);
    await participant.save();
    
    res.json({ message: 'Subscriber added successfully', participant });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;