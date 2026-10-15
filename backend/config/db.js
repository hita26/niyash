const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  // If already connected (readyState 1), reuse active connection
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection attempt is in-flight, reuse the same promise
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/niyanshPharma';
      console.log('Connecting to MongoDB database...');
      
      const conn = await mongoose.connect(connStr);
      const host = conn.connection?.host || mongoose.connection?.host || 'MongoDB Atlas';
      console.log(`MongoDB Connected: ${host}`);

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

      return mongoose.connection;
    } catch (error) {
      console.error(`MongoDB connection error: ${error.message}`);
      throw error;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

module.exports = connectDB;

