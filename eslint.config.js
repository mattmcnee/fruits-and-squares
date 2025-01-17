import reactRefresh from "eslint-plugin-react-refresh";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist", ".eslintrc.cjs"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      indent: ["error", 2],
      "no-tabs": "error",
      "space-infix-ops": ["error", { int32Hint: false }],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "newline-before-return": "error",
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
];
