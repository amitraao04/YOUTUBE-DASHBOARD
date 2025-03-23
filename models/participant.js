const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subscribers: {
    type: Number,
    default: 0
  },
  subscriberList: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if model already exists to prevent model overwrite error in serverless environment
const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);

module.exports = Participant;