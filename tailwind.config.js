module.exports = {
  important: true,
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/custom-forms")],
}

module.exports = {
  theme: {
    extend: {
      colors: {
        mediumslateblue: {
          '50':  '#f5f8fc',
          '100': '#6A80D9',
          '200': '#d3d8fa',
          '300': '#babcfa',
          '400': '#9a8ff9',
          '500': '#7761f9',
          '600': '#5b41f5',
          '700': '#6A80D9',
          '800': '#372ab6',
          '900': '#492DA7',
        },
        truegrey: {
          '50':  '#f8f8f8',
          '100': '#eaf0fc',
          '200': '#d3d8fa',
          '300': '#babcfa',
          '400': '#9a8ff9',
          '500': '#7761f9',
          '600': '#5b41f5',
          '700': '#4733e1',
          '800': '#2F2F2F',
          '900': '#2c248f',
        },
        rosybrown: {
          '50':  '#fafafa',
          '100': '#f8f7f4',
          '200': '#efe9e5',
          '300': '#e4d2cf',
          '400': '#d3a8a6',
          '500': '#ba7e76',
          '600': '#905850',
          '700': '#664340',
          '800': '#483334',
          '900': '#36292b',
        },
        lightslategray: {
          '50':  '#f6f7f7',
          '100': '#f0f0f0',
          '200': '#e2e4e4',
          '300': '#cfcfd2',
          '400': '#adadb5',
          '500': '#8a8695',
          '600': '#6d6277',
          '700': '#584c61',
          '800': '#473c4e',
          '900': '#39313f',
        },        
      }
    }
  }
}
