// PostCSS is only used by Tailwind CSS v4 + NativeWind v5.
// Must stay `.mjs`: this package.json has no `"type": "module"`, and Expo 57
// does not discover `postcss.config.cjs`.
// @type {import('postcss-load-config').Config}
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
