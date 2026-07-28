import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error);
    process.exit(1);
  }
}
