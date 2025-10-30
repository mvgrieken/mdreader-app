import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ============================================
      // COLORS - MDReader Design System
      // ============================================
      colors: {
        // Primary Colors (Blue - Trust & Intelligence)
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          DEFAULT: '#2563EB', // Default interactive
        },
        
        // Secondary Colors (Indigo - Sophistication)
        secondary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#4F46E5',
        },
        
        // Accent Colors (Emerald - Success & Growth)
        accent: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          DEFAULT: '#059669',
        },
        
        // Neutral Colors (Slate - Professional Gray)
        neutral: {
          50: '#F8FAFC',  // Backgrounds
          100: '#F1F5F9',
          200: '#E2E8F0',  // Borders
          300: '#CBD5E1',
          400: '#94A3B8',  // Placeholders
          500: '#64748B',  // Disabled
          600: '#475569',  // Secondary text
          700: '#334155',  // Body text
          800: '#1E293B',  // Headings
          900: '#0F172A',  // Dark backgrounds
        },
        
        // Semantic Colors
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          700: '#047857',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          700: '#B91C1C',
        },
        info: {
          50: '#EFF6FF',
          500: '#3B82F6',
          700: '#1D4ED8',
        },
      },
      
      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        serif: ['Merriweather', 'Georgia', 'Times New Roman', 'serif'],
      },
      
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.5rem' }],
        xl: ['1.25rem', { lineHeight: '1.5rem' }],
        '2xl': ['1.5rem', { lineHeight: '1.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      
      // ============================================
      // SPACING SYSTEM (4px base unit)
      // ============================================
      spacing: {
        0: '0px',
        1: '0.25rem',  // 4px
        2: '0.5rem',   // 8px
        3: '0.75rem',  // 12px
        4: '1rem',     // 16px
        5: '1.25rem',  // 20px
        6: '1.5rem',   // 24px
        7: '1.75rem',  // 28px
        8: '2rem',     // 32px
        10: '2.5rem',  // 40px
        12: '3rem',    // 48px
        16: '4rem',    // 64px
        20: '5rem',    // 80px
        24: '6rem',    // 96px
        32: '8rem',    // 128px
      },
      
      // ============================================
      // CONTAINER WIDTHS
      // ============================================
      maxWidth: {
        container: '1200px',
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1536px',
      },
      
      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        none: '0px',
        sm: '0.125rem',  // 2px
        base: '0.25rem', // 4px
        md: '0.375rem',  // 6px
        lg: '0.5rem',    // 8px
        xl: '0.75rem',   // 12px
        '2xl': '1rem',   // 16px
        '3xl': '1.5rem', // 24px
        full: '9999px',
      },
      
      // ============================================
      // SHADOWS
      // ============================================
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      
      // ============================================
      // TRANSITIONS
      // ============================================
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '500ms',
      },
      
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      // ============================================
      // Z-INDEX SCALE
      // ============================================
      zIndex: {
        base: '0',
        dropdown: '10',
        sticky: '20',
        fixed: '30',
        modal: '40',
        popover: '50',
        tooltip: '60',
        toast: '70',
      },
      
      // ============================================
      // ANIMATION KEYFRAMES
      // ============================================
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      animation: {
        'fade-in': 'fade-in 0.2s ease-in-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-in-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-in-out',
        'scale-in': 'scale-in 0.2s ease-in-out',
      },
    },
  },
  plugins: [],
}

export default config
