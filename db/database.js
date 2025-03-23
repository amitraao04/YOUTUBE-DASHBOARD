const mongoose = require('mongoose');

// Database connection URI (use environment variable)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://amitraao04:ZbsTr44Nh8vj8rGS@cluster0.m7ejh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Cached connection for serverless environment
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log('MongoDB connected successfully');
        return mongoose;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = { connectDB };