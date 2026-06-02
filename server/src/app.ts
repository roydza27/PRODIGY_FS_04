import express from "express";
import cors from "cors";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

export default app;