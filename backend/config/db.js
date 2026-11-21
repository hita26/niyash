const mongoose = require('mongoose');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

let connectionPromise = null;

const NEW_ATLAS_URI = 'mongodb+srv://info_db_user:1QqS3OU0vWIMaNFo@niyansh.evdp376.mongodb.net/niyanshPharma?retryWrites=true&w=majority';

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
      let connStr = process.env.MONGODB_URI || process.env.MONGO_URI || NEW_ATLAS_URI;
      // Guarantee connection to the new MongoDB Atlas cluster across all deployment environments
      if (!connStr || !connStr.includes('niyansh.evdp376.mongodb.net')) {
        console.log('Switching connection string to new Atlas cluster (niyansh.evdp376.mongodb.net)...');
        connStr = NEW_ATLAS_URI;
      }
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

