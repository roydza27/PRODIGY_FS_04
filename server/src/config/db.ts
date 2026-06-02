import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
};