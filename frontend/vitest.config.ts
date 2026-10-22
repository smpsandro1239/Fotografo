import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Configuração de testes do frontend (vitest + jsdom + Testing Library)
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.spec.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**", "src/hooks/**", "src/components/**"],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
