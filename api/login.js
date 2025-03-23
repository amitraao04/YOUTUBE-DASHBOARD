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
  
  // Connect to database for each request in serverless environment
  await connectDB();
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    console.log('Request body:', req.body);
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    console.log('Login attempt for username:', username);
    
    // Find or create participant
    let participant = await Participant.findOne({ username: username.toLowerCase() });
    
    if (!participant) {
      participant = new Participant({
        username: username.toLowerCase(),
        subscribers: 0,
        subscriberList: []
      });
      await participant.save();
      console.log('New participant created:', username);
    }
    
    console.log('Login successful for:', username);
    res.status(200).json(participant);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};