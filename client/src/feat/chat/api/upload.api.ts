import { api } from "@/services/api";
import type { IAttachment } from "@/feat/chat/types/message.types";

export interface UploadResult {
  success: boolean;
  data: IAttachment[];
}

/**
 * Uploads one or more files to the server.
 * Calls `onProgress` with a 0-100 percentage as data is transmitted.
 *
 * The server validates MIME types — unsupported types (images, video, audio
 * in this phase) will receive a 400 error which is thrown as an `Error`.
 */
export const uploadFiles = async (
  files: File[],
  onProgress?: (percentage: number) => void
): Promise<IAttachment[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const { data } = await api.post<UploadResult>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        const pct = Math.round((event.loaded * 100) / event.total);
        onProgress(pct);
      }
    },
  });

  if (!data.success) {
    throw new Error("Upload failed");
  }

  return data.data;
};
