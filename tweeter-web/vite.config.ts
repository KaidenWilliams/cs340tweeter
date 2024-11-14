import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import viteCommonJs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(), viteCommonJs()],
  server: { open: true },
  build: {
    rollupOptions: {
      external: ["tweeter-shared"],
    },
  },
});
