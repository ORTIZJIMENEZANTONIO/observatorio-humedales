import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D6B7E',
          light: '#1088A0',
          dark: '#094E5C',
          50: '#E6F4F7',
          100: '#B3DEE7',
          200: '#80C8D7',
          300: '#4DB2C7',
          400: '#269CBD',
          500: '#0D6B7E',
          600: '#0B5F70',
          700: '#095262',
          800: '#074554',
          900: '#053846',
        },
        secondary: {
          DEFAULT: '#4FC3F7',
          light: '#72D0F9',
          dark: '#2196F3',
        },
        eco: {
          DEFAULT: '#43A047',
          light: '#66BB6A',
          dark: '#2E7D32',
        },
        accent: {
          DEFAULT: '#F2A81D',
          light: '#F5BA45',
          dark: '#D99517',
        },
        alert: {
          DEFAULT: '#D9363E',
          light: '#E05A61',
          dark: '#BF2D34',
        },
        'slate-custom': {
          DEFAULT: '#5E6B78',
          light: '#7A8694',
          dark: '#4A5560',
        },
        surface: {
          DEFAULT: '#F7F8F4',
          warm: '#F5F3EE',
          cool: '#F0F4F8',
        },
        ink: {
          DEFAULT: '#1F2937',
          light: '#374151',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '0.75rem',
        badge: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
        panel: '0 2px 8px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
