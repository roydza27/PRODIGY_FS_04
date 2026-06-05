import mongoose from "mongoose";
import { config } from "dotenv";

import { MessageModel } from "../src/modules/messages/models/message.model";

config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI!);

  const roomId = "6a22bdcfb9b04b2bd3cacb75";
  const workspaceId = "6a2066be98fc706b98461421";
  const userId = "6a203bfa665249d6472bc802";

  await MessageModel.insertMany([
    {
      workspaceId,
      senderId: userId,
      roomId,
      type: "room",
      text: "Welcome to General",
    },
    {
      workspaceId,
      senderId: userId,
      roomId,
      type: "room",
      text: "Phase 4 testing message",
    },
    {
      workspaceId,
      senderId: userId,
      roomId,
      type: "room",
      text: "History should load newest first",
    },
  ]);

  console.log("Messages seeded");

  process.exit(0);
}

run();