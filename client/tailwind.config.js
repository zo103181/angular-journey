module.exports = {
  content: [
    "./src/**/*.{html,scss,ts}",
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
