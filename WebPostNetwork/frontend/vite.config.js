import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: path.resolve(__dirname, "../wwwroot"),
        emptyOutDir: true, // очищает wwwroot перед сборкой
    },
    server: {
        port: 5173,
        proxy: {
            "/api": "https://localhost:44373"
        }
    }
});
