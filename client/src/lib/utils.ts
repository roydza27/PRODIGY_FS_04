import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const baseUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanUrl = url.replace(/^\/+/, "");
  return `${cleanBase}/${cleanUrl}`;
}
