import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { homedir } from "os";
import { existsSync, readFileSync } from "fs";

export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    https: existsSync(`${homedir()}/.localhost_ssl/server.key`)
      ? {
          key: readFileSync(`${homedir()}/.localhost_ssl/server.key`),
          cert: readFileSync(`${homedir()}/.localhost_ssl/server.crt`),
        }
      : false,
  },
  optimizeDeps: {
    exclude: ["prettier"],
    include: ["rxjs/operators", "rxjs/webSocket"],
  },
});
