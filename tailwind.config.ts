import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // Enable dark mode based on class (can toggle dark mode by adding the `dark` class)
  
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['var(--font-satoshi)', 'sans-serif'],
        clash: ['var(--font-clash-display)', 'sans-serif'],
      },
      colors: {
        // Light Mode Colors
        light: {
          background: '#FFFFFF',   // Light background (White)
          'light-gray': '#F4F7FA', // Light Gray background
          'text-primary': '#212529', // Dark Gray text
          'text-secondary': '#6C757D', // Light Gray text
          primary: '#007BFF',      // Blue for Primary elements
          secondary: '#28A745',    // Green for Secondary elements
          warning: '#FFC107',      // Yellow for Warning
          danger: '#DC3545',       // Red for Danger
          'button-hover': '#0056b3', // Dark Blue for Button hover
        },

        // Dark Mode Colors
        dark: {
          background: '#121212',   // Charcoal background
          'dark-gray': '#1F1F1F',  // Dark Gray background
          'text-primary': '#E0E0E0', // Light Gray text
          'text-secondary': '#B0B0B0', // Medium Gray text
          primary: '#007BFF',      // Blue for Primary elements
          secondary: '#28A745',    // Green for Secondary elements
          warning: '#FFC107',      // Yellow for Warning
          danger: '#DC3545',       // Red for Danger
          'button-hover': '#0056b3', // Dark Blue for Button hover
        },

        // You can add these if you are using CSS custom properties (optional)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        // primary: {
        //   DEFAULT: 'hsl(var(--primary))',
        //   foreground: 'hsl(var(--primary-foreground))',
        // },
        // secondary: {
        //   DEFAULT: 'hsl(var(--secondary))',
        //   foreground: 'hsl(var(--secondary-foreground))',
        // },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      
      // Border radius configuration
      borderRadius: {
        lg: 'var(--radius)', // Use your custom variable for border radius
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  
  plugins: [require("tailwindcss-animate")], // Add animation plugin if needed
} satisfies Config;
