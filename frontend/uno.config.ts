import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  theme: {
    colors: {
      lime: {
        50: '#f8ffe0',
        100: '#f0ffb3',
        200: '#e5ff80',
        300: '#d9ff4d',
        400: '#B9F500',
        500: '#a6dd00',
        600: '#8bc34a',
        700: '#689f38',
        800: '#4a7c2e',
        900: '#33691e',
      },
      surface: {
        light: '#FAFAFA',
        dark: '#1A1A2E',
      },
    },
  },
  shortcuts: {
    'glass': 'bg-white/55 backdrop-blur-20 backdrop-saturate-180 border border-white/30 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]',
    'glass-dark': 'bg-gray-900/40 backdrop-blur-20 backdrop-saturate-180 border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]',
    'glass-input': 'bg-white/40 backdrop-blur-10 border border-white/30 rounded-2xl px-5 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-lime-400/50 focus:bg-white/60 transition-all duration-300',
    'glass-input-dark': 'bg-gray-800/40 backdrop-blur-10 border border-white/10 rounded-2xl px-5 py-3 text-gray-100 placeholder-gray-500 outline-none focus:ring-2 focus:ring-lime-400/30 focus:bg-gray-800/60 transition-all duration-300',
    'btn-primary': 'bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_4px_16px_rgba(185,245,0,0.3)] hover:shadow-[0_6px_24px_rgba(185,245,0,0.45)] active:scale-97',
  },
})
