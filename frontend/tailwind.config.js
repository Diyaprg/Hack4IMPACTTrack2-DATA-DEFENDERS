/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:   { DEFAULT: '#0A0F1E', 800: '#0D1627', 700: '#111D33' },
        indigo: { DEFAULT: '#1B2A6B', light: '#2234A8' },
        threat: {
          critical: '#EF4444',
          high:     '#F97316',
          medium:   '#EAB308',
          low:      '#22C55E',
          normal:   '#3B82F6',
        },
        category: {
          investment_scam:     '#8B5CF6',
          voice_clone:         '#EC4899',
          fake_upi_refund:     '#F59E0B',
          phishing:            '#EF4444',
          mule_recruitment:    '#06B6D4',
          deepfake_celebrity:  '#6366F1',
          lottery_scam:        '#84CC16',
          unknown:             '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in':    'slideIn 0.3s ease-out',
        'fade-in':     'fadeIn 0.4s ease-out',
        'count-up':    'countUp 2s ease-out',
        'ticker':      'ticker 30s linear infinite',
      },
      keyframes: {
        slideIn:  { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        ticker:   { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(-100%)' } },
      },
    },
  },
  plugins: [],
}
