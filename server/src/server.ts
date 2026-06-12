import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { setupSocket } from "./sockets/socket.server";

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    // Initialize Socket.IO
    setupSocket(server);

    server.listen(env.port, () => {
      const host = env.nodeEnv === "production" ? "Server" : `http://localhost:${env.port}`;
      logger.info(`${host} running on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

void startServer();