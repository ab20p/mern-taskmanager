import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://ab2025:ab2025@cluster0.yq3hqxh.mongodb.net/taskify`);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Error ❌", error.message);
    process.exit(1);
  }
};

export default connectDB;
