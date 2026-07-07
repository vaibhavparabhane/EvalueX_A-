import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "edtech-navy": {
          DEFAULT: "#1A2332",
          foreground: "#FFFFFF",
        },
        "edtech-indigo": {
          DEFAULT: "#2F4B7C",
          foreground: "#FFFFFF",
        },
        "edtech-indigo-light": "#EEF2F8",
        "edtech-slate": "#8B93A7",
        "edtech-teal": {
          DEFAULT: "#1FA2A1",
          foreground: "#FFFFFF",
        },
        "edtech-teal-light": "#E6F4F1",
        "edtech-bg": "#F7F8FA",
        "edtech-charcoal": "#1F2933",
        "edtech-gray-dark": "#4B5563",
        "edtech-gray-muted": "#6B7280",
        "edtech-green": {
          DEFAULT: "#4CAF7D",
          foreground: "#FFFFFF",
        },
        "edtech-green-light": "#EAF7EE",
        "edtech-coral": {
          DEFAULT: "#E2654A",
          foreground: "#FFFFFF",
        },
        "edtech-coral-light": "#FDF0E8",
        "edtech-border": "#E4E7EB",
        "edtech-neutral-light": "#F1F2F4",
        crail: {
          DEFAULT: "#D97757",
          foreground: "#FAF9F5",
        },
        cream: {
          DEFAULT: "#FAF9F5",
          foreground: "#141413",
        },
        dark: {
          DEFAULT: "#141413",
          foreground: "#FAF9F5",
        },
        "light-gray": "#E8E6DC",
        "mid-gray": "#B0AEA5",
        "muted-blue": {
          DEFAULT: "#6A9BCC",
          foreground: "#FAF9F5",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
