module.exports = () => ({
  plugins: [
    require('tailwindcss'),
    require('postcss-nesting'),
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.js'],
      defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
    }),
  ],
})
