import path from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: "http://localhost:5173",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      // Make sure to bundle these dependencies
      external: [],
    },
  },
  optimizeDeps: {
    include: ["zod"], // Explicitly include zod in the dependency optimization
  },
});
