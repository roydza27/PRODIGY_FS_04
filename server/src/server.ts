import http from "http";
import app from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const server = http.createServer(app);

server.listen(env.port, () => {
  logger.info(`Server running on http://localhost:${env.port}`);
});