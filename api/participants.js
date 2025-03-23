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
  
  // GET /api/participants
  if (req.method === 'GET' && !req.query.username) {
    try {
      const participants = await Participant.find().select('-__v');
      return res.status(200).json(participants);
    } catch (error) {
      console.error('Error fetching participants:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
  // GET /api/participants?username=xxx
  if (req.method === 'GET' && req.query.username) {
    try {
      const participant = await Participant.findOne({ 
        username: req.query.username.toLowerCase() 
      }).select('-__v');
      
      if (!participant) {
        return res.status(404).json({ message: 'Participant not found' });
      }
      
      return res.status(200).json(participant);
    } catch (error) {
      console.error('Error fetching participant:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};