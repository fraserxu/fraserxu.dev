module.exports = () => ({
  plugins: [
    require('tailwindcss'),
    require('postcss-nesting'),
    process.env.NODE_ENV === 'production' &&
      require('@fullhuman/postcss-purgecss')({
        content: ['./src/**/*.js'],
        defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
        whitelistPatternsChildren: [/^markdown$/, /^token/, /^pre/, /^code/],
      }),
  ],
})
