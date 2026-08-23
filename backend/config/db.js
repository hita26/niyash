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

    // If running in Vercel, attach native MongoClient to Vercel's database pool management
    if (process.env.VERCEL) {
      try {
        const { attachDatabasePool } = require('@vercel/functions');
        const client = mongoose.connection.getClient();
        if (client && attachDatabasePool) {
          attachDatabasePool(client);
          console.log('Successfully attached Mongoose MongoClient to Vercel Database Pool');
        }
      } catch (poolErr) {
        console.error('Warning: Failed to attach connection to Vercel Database Pool:', poolErr.message);
      }
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
