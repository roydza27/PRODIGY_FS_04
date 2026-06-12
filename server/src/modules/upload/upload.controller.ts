import { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Directory setup
// ---------------------------------------------------------------------------
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const UPLOAD_DIRS: Record<string, string> = {
  DOCUMENT: path.join(UPLOAD_ROOT, "documents"),
  FILE:     path.join(UPLOAD_ROOT, "files"),
  IMAGE:    path.join(UPLOAD_ROOT, "images"),
  VIDEO:    path.join(UPLOAD_ROOT, "videos"),
  AUDIO:    path.join(UPLOAD_ROOT, "audio"),
};

for (const dir of [UPLOAD_ROOT, ...Object.values(UPLOAD_DIRS)]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ---------------------------------------------------------------------------
// MIME-type allowlist — keyed by attachment type
// ---------------------------------------------------------------------------
const ALLOWED_MIMES: Record<string, string[]> = {
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ],
  FILE: [
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/vnd.rar",
    "application/x-7z-compressed",
    "application/octet-stream",
  ],
  IMAGE: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  VIDEO: [
    "video/mp4",
    "video/webm",
    "video/quicktime",       // .mov
    "video/x-matroska",     // .mkv (optional)
    "video/avi",
  ],
  AUDIO: [
    "audio/mpeg", 
    "audio/ogg", 
    "audio/wav", 
    "audio/webm",
    "audio/mp4",
    "audio/aac",
    "audio/x-m4a",
    "audio/flac"
  ],
};

// Flat set for fast O(1) lookup
const ALL_ALLOWED_MIMES = new Set(Object.values(ALLOWED_MIMES).flat());

// Subdir name map for URL construction
const TYPE_SUBDIR: Record<string, string> = {
  DOCUMENT: "documents",
  FILE:     "files",
  IMAGE:    "images",
  VIDEO:    "videos",
  AUDIO:    "audio",
};

// Blocked extensions (secondary safety layer)
const BLOCKED_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".ps1", ".msi",
  ".dll", ".so", ".dylib", ".vbs", ".js", ".jar",
  ".scr", ".pif", ".com", ".cpl",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
type AttachmentType = "DOCUMENT" | "FILE" | "IMAGE" | "VIDEO" | "AUDIO";

function getAttachmentType(mimeType: string): AttachmentType {
  for (const [type, mimes] of Object.entries(ALLOWED_MIMES)) {
    if (mimes.includes(mimeType)) return type as AttachmentType;
  }
  return "FILE";
}

function getUploadSubdir(attachmentType: AttachmentType): string {
  return UPLOAD_DIRS[attachmentType] ?? UPLOAD_ROOT;
}

// ---------------------------------------------------------------------------
// Multer storage — dynamic destination per mime type
// ---------------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const type = getAttachmentType(file.mimetype);
    cb(null, getUploadSubdir(type));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (BLOCKED_EXTENSIONS.has(ext)) {
    return cb(new Error(`File extension '${ext}' is not allowed.`));
  }

  if (!ALL_ALLOWED_MIMES.has(file.mimetype)) {
    return cb(
      new Error(
        `File type '${file.mimetype}' is not supported. ` +
        `Allowed: images (JPG, PNG, WEBP, GIF), ` +
        `videos (MP4, WEBM, MOV), ` +
        `audio (MP3, WAV, OGG, M4A), ` +
        `documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT) ` +
        `and archives (ZIP, RAR, 7Z).`
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB per file
    files: 10,
  },
}).array("files", 10);

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
export const uploadFiles = (req: Request, res: Response): void => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          success: false,
          error: "File too large. Maximum size is 50 MB per file.",
        });
        return;
      }
      res.status(400).json({ success: false, error: err.message });
      return;
    }

    if (err) {
      res.status(400).json({ success: false, error: (err as Error).message });
      return;
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ success: false, error: "No files uploaded." });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => {
      const type = getAttachmentType(file.mimetype);
      const subdir = TYPE_SUBDIR[type] ?? "files";

      return {
        id: file.filename,
        type,
        url: `/uploads/${subdir}/${file.filename}`,
        filename: file.originalname,
        filesize: file.size,
        mimeType: file.mimetype,
        // thumbnail, width, height, duration populated by future processing pipeline
      };
    });

    res.json({ success: true, data: uploadedFiles });
  });
};