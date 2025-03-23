const { connectDB } = require('../../db/database');
const Participant = require('../../models/participant');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Connect to database
  await connectDB();
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { username, subscriberUsername } = req.body;
    
    if (!username || !subscriberUsername) {
      return res.status(400).json({ message: 'Username and subscriber username are required' });
    }
    
    console.log(`Adding subscriber ${subscriberUsername} to ${username}`);
    
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
    
    console.log(`Subscriber ${subscriberUsername} added successfully to ${username}`);
    res.status(200).json({ message: 'Subscriber added successfully', participant });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};