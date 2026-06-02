import cors from "cors";
import express from "express";
import { env } from "./config/env";
import authRouter from "./modules/auth/auth.routes";

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

export default app;