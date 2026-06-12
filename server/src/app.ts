import cors from "cors";
import express from "express";
import { env } from "./config/env";
import authRouter from "./modules/auth/auth.routes";
import workspaceRouter from "./modules/workspaces/workspace.routes";
import conversationGlobalRouter from "./modules/conversations/conversation-global.routes";
import userRouter from "./modules/users/user.routes";
import { messageRoutes } from "./modules/messages";
import uploadRouter from "./modules/upload/upload.routes";
import path from "path";

const app = express();

app.use(
  cors({
    origin: [env.clientUrl, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
app.use("/api/conversations", conversationGlobalRouter);
app.use("/api/users", userRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRouter);

export default app;