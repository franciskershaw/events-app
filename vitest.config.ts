import { resolve } from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/postcss.config.js",
        "**/tailwind.config.js",
        "**/vite.config.ts",
        "**/vitest.config.ts",
        "**/eslint.config.js",
        "**/prettier.config.cjs",
        // Entry point
        "**/main.tsx",
        // Other common exclusions
        "node_modules/**",
        "dist/**",
        "**/*.d.ts",
      ],
    },
    include: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
