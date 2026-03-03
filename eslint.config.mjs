import { nextCoreWebVitalsConfig } from "@next/eslint-plugin-next";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: {
      "@next/next": nextCoreWebVitalsConfig,
    },
    rules: {
      ...nextCoreWebVitalsConfig.rules,
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    ignores: [".next/*", "node_modules/*"],
  },
];
