const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connections[0]?.readyState === 1) {
    console.log('MongoDB is already connected. Reusing active connection.');
    return;
  }

  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/niyanshPharma';
    console.log('Connecting to MongoDB database...');
    
    const conn = await mongoose.connect(connStr);
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
