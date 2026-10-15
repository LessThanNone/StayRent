/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#E0E7FF', // indigo-100
          100: '#C7D2FE', // indigo-200
          200: '#A5B4FC', // indigo-300
          300: '#818CF8', // indigo-400 (light accent)
          400: '#6366F1', // indigo-500
          500: '#4F46E5', // indigo-600 — primary
          600: '#4338CA', // indigo-700
          700: '#3730A3', // indigo-800
          800: '#1E3A8A', // blue-900 — dark / hover
          900: '#1E2A6E',
        },
        ink:         '#1E293B',  // slate-800
        bodytext:    '#1E293B',
        mutedtext:   '#64748B',  // slate-500
        hairline:    '#E2E8F0',  // slate-200
        'surface-warm': '#F1F5F9', // slate-100
        'surface-alt':  '#EEF2FF', // indigo-50
      },
      fontFamily: {
        sans: ['Rubik', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      letterSpacing: {
        display:    '-0.04em',
        heading:    '-0.025em',
        subheading: '-0.015em',
        snug:       '-0.008em',
      },
      lineHeight: {
        display: '1.08',
        heading: '1.18',
        snug:    '1.35',
      },
      borderRadius: {
        'card': '12px',
        'pill': '9999px',
      },
      keyframes: {
        heroText: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroImage: {
          '0%':   { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'hero-text':  'heroText 0.8s cubic-bezier(0.32,0.72,0,1) forwards',
        'hero-image': 'heroImage 1s cubic-bezier(0.32,0.72,0,1) 0.15s forwards',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.32,0.72,0,1) forwards',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.32,0.72,0,1)',
        'snap':   'cubic-bezier(0.16,1,0.3,1)',
      },
      boxShadow: {
        // Indigo-tinted shadows — match brand hue
        'airbnb':       'rgba(79,70,229,0.03) 0 0 0 1px, rgba(79,70,229,0.05) 0 2px 6px, rgba(79,70,229,0.09) 0 4px 12px',
        'airbnb-hover': '0 8px 28px rgba(79,70,229,0.14)',
        'sticky-card':  '0 4px 20px rgba(79,70,229,0.12)',
        'btn':          '0 1px 2px rgba(79,70,229,0.16), 0 3px 10px rgba(79,70,229,0.10)',
        'btn-hover':    '0 4px 14px rgba(79,70,229,0.22)',
        'rukita-sm':    'rgba(79,70,229,0.06) 0 4px 14px 0, rgba(79,70,229,0.03) 0 1px 4px 0',
        'rukita-lg':    'rgba(79,70,229,0.10) 0 8px 28px -4px, rgba(79,70,229,0.06) 0 4px 8px -2px',
      },
    },
  },
  plugins: [],
};
