import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { homedir } from "os";
import { readFileSync } from "fs";

export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    https:
      process.env.NODE_ENV === "development"
        ? {
            key: readFileSync(homedir() + "/.localhost_ssl/server.key"),
            cert: readFileSync(homedir() + "/.localhost_ssl/server.crt"),
          }
        : false,
  },
  optimizeDeps: {
    exclude: ["prettier"],
    include: ["rxjs/operators", "rxjs/webSocket"],
  },
  alias: [{ find: /^@\//, replacement: "/src/" }],
});
