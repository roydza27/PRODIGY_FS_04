import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { setupSocket } from "./sockets/socket.server";

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  // Initialize Socket.IO
  setupSocket(server);

  server.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`);
  });
};

void startServer();