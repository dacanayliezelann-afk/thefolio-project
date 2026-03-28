// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the environment variable, or fall back to a local string for development
    const atlasURI = process.env.MONGO_URI; 
    
    if (!atlasURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(atlasURI); 
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
