const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are no longer necessary in Mongoose 6+, 
      // but keeping them doesn't hurt for older version compatibility 
      // if you ever switch versions. For Mongoose 7+ (which we are using),
      // defaults are fine.
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;