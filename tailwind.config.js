/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard Variable', 'sans-serif'],
      },
      screens: {
        xs: { min: '361px' }, // sm보다 작은 화면
      },
      colors: {
        primary: '#3B82F6',
        secondary: '#6391aa',
        tertiary: '#719cf7',
        notice: '#b5c2c9',
        negative: '#e11900',
        background: '#ffffff',
        black: '#000000',
        white: '#ffffff',
        modal: '#808080',
        'gray-100': '#ebecf0',
        'gray-200': '#a7a7a7',
        'gray-300': '#919191',
        'gray-400': '#515462',
        'card-orange': '#FFC5AB',
        'card-green': '#CDE8B5',
        'card-blue': '#A7C6FF',
        'card-yellow': '#F1F7B7',
        'card-skyblue': 'rgba(54, 162, 235, 0.2)',
        'card-pink': 'rgba(255, 99, 132, 0.2)',
        'card-lavender': 'rgba(153, 102, 255, 0.2)',
        'card-ivory': 'rgba(255, 206, 86, 0.2)',
      },
      fontSize: {
        xs: 10, // 0.625rem → 10px
        sm: 11, // 0.656rem → 11px
        base: 16, // 0.875rem → 14px
        lg: 18, // 1.166rem → 18px
        xl: 25, // 1.555rem → 25px
        '2xl': 33, // 2.072rem → 33px
        '3xl': 44, // 2.763rem → 44px
      },
      spacing: {
        1.5: 6, // 6px
        2.5: 10, // 10px
      },
      boxShadow: {
        custom: '0px 2px 5px rgba(0, 0, 0, 0.25)',
        profile: '0px 4px 4px rgba(0, 0, 0, 0.10)',
        pencil: '4px 4px 4px rgba(0, 0, 0, 0.15)',
        map: '0px -3px 4px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        button: 10, // 10px
        card: 15, // 15px
      },
    },
  },
  plugins: [],
};
