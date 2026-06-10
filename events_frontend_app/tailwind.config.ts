import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#3B82F6",
          secondary: "#10B981",
          success: "#F59E0B",
          error: "#EF4444"
        },
        app: {
          background: "#f9fafb",
          surface: "#ffffff",
          text: "#111827"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
