import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("react-dom") || id.includes(`${"node_modules"}/react/`) || id.includes("\\node_modules\\react\\")) {
            return "react-vendor";
          }

          if (id.includes("@supabase")) {
            return "supabase";
          }

          return "vendor";
        }
      }
    }
  }
});
