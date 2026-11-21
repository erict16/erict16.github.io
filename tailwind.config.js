/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './ui/**/*.{js,ts,jsx,tsx}'],
  // Only the base reset is used; the page styles are in app/globals.css.
  corePlugins: { container: false },
  theme: {},
};
