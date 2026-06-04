import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // 👇 This tricks Vite into routing "radix-ui" imports to your local base file
      "radix-ui": path.resolve(__dirname, "./src/shared/components/ui/radix-wrapper.ts"),
    },
  },
});