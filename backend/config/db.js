// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const atlasURI = "mongodb+srv://<db_username>:<db_password>@cluster0.0xqwwhe.mongodb.net/?appName=Cluster0";
    
    const conn = await mongoose.connect(atlasURI); 
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
