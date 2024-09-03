// eslint.config.js

const { configs } = require("@eslint/js");

module.exports = [
  configs.recommended, // Utilise la configuration recommandée d'ESLint
  {
    files: ["**/*.js"],
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "never"],
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
    },

    ignores: ["build/**/*"],
  },
];
// const { configs } = require('@eslint/js');

// module.exports = configs.recommended;
