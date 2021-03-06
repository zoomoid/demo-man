module.exports = {
  root: true,

  env: {
    node: true,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-underscore-dangle": "off",
    quotes: ["error", "double"],
  },

  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 11,
  },

  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "@vue/typescript",
  ]
};
