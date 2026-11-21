module.exports = {
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
  plugins: [
    require.resolve('@trivago/prettier-plugin-sort-imports'),
    require.resolve('prettier-plugin-astro'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
  singleQuote: true,
  tailwindStylesheet: './src/styles/global.css',
  trailingComma: 'all',
};
