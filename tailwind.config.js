/** G Developments tokens — from the official brand guidelines (Lunar Jetman / LJHATCH). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        g: {
          black: '#000000',      // PANTONE Process Black U (solid)
          ink: '#0A0A0A',        // near-black surface
          graphite: '#4E4A47',   // Process Black U, HTML value from the guidelines
          75: '#404040',         // 75% tint
          50: '#808080',         // 50% tint
          25: '#BFBFBF',         // 25% tint
          paper: '#F4F4F4',      // stationery off-white
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        text: ['var(--font-text)'],
      },
      letterSpacing: { brand: '-0.045em', tightish: '-0.02em', label: '0.18em' },
    },
  },
  plugins: [],
};
