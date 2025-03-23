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

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;