import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is required in .env");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log("Connected to MongoDB Atlas successfully");
  } catch (error) {
    console.error("CRITICAL: MongoDB connection failed!");
    console.error("Error Detail:", error.message);
    console.error("Check your IP Whitelist in MongoDB Atlas and the URI in your .env file.");
    // Don't exit immediately in dev, let the logs be seen
  }
};

export default connectDb;
