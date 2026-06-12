import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { uploadFiles } from "./upload.controller";

const router = Router();

router.post("/", protect, uploadFiles);

export default router;