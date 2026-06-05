import cors from "cors";
import express from "express";
import { env } from "./config/env";
import authRouter from "./modules/auth/auth.routes";
import workspaceRouter from "./modules/workspaces/workspace.routes";
import { messageRoutes } from "./modules/messages";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/messages", messageRoutes);

export default app;