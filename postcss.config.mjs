/** @type {import('postcss').Config} */
const config = {
  plugins: {
      '@tailwindcss/postcss': {}, // Usa el paquete correcto para Tailwind CSS
      autoprefixer: {}, // Asegúrate de incluir autoprefixer
  },
};

export default config;