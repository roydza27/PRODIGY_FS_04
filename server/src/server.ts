import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`);
  });
};

void startServer();