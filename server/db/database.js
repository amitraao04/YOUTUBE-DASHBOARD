// 

const mongoose = require('mongoose');

// Database connection URI (use MongoDB Atlas or local MongoDB)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://amitraao04:ZbsTr44Nh8vj8rGS@cluster0.m7ejh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };