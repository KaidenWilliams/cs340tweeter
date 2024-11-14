// tweeter-shared vite.config.js
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "tweeterShared",
      formats: ["es", "cjs"],
      fileName: (format) => `tweeter-shared.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  plugins: [dts()],
});
