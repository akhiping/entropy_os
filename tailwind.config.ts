import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background (deep space theme)
        'bg-void': '#000000',
        'bg-deep': '#0A0A0F',
        'bg-surface': '#141419',
        'bg-elevated': '#1C1C24',
        
        // Accent System
        'accent-energy': '#00FFA3',
        'accent-plasma': '#FF006E',
        'accent-void': '#8B5CF6',
        'accent-solar': '#FFB800',
        'accent-frost': '#00E0FF',
        
        // Semantic
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255, 255, 255, 0.7)',
        'text-tertiary': 'rgba(255, 255, 255, 0.4)',
        'border-default': 'rgba(255, 255, 255, 0.1)',
        'border-bright': 'rgba(255, 255, 255, 0.2)',
      },
      fontSize: {
        'xs': '11px',
        'sm': '13px',
        'base': '15px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '42px',
        'hero': '56px',
        'display': '72px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '10px',
        'lg': '20px',
        'xl': '40px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'border-rotate': 'border-rotate 4s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'slide-in-bottom': 'slide-in-bottom 0.3s ease-out forwards',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', filter: 'blur(20px)' },
          '50%': { opacity: '1', filter: 'blur(30px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'border-rotate': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-bottom': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(0, 255, 163, 0.3)',
        'glow-md': '0 0 40px rgba(0, 255, 163, 0.4)',
        'glow-lg': '0 0 60px rgba(0, 255, 163, 0.6)',
        'glow-plasma': '0 0 40px rgba(255, 0, 110, 0.4)',
        'glow-void': '0 0 40px rgba(139, 92, 246, 0.4)',
        'glow-frost': '0 0 40px rgba(0, 224, 255, 0.4)',
        'glow-solar': '0 0 40px rgba(255, 184, 0, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.5)',
        'dramatic': '0 20px 80px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'node-repo': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'node-doc': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'node-task': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'node-ai': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(268, 82%, 35%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(289, 100%, 34%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(240, 100%, 25%, 0.3) 0px, transparent 50%)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
