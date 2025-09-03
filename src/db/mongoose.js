import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export async function initMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing");
  await mongoose.connect(uri, {
    autoIndex: true,
  });
}