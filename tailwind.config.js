/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/admin/**/*.{js,ts,jsx,tsx,mdx}", // Only apply Tailwind to the admin dashboard
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Important: We disable preflight (the CSS reset) to avoid breaking the retro desktop CSS
  corePlugins: {
    preflight: false,
  }
}
