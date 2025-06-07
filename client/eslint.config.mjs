import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended"
  ),
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"]
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"]
        },
        {
          selector: "enum",
          format: ["PascalCase"]
        }
      ],

      // React specific rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/self-closing-comp": "error",
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true
        }
      ],

      // Import rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ],
      "import/no-duplicates": "error",
      "import/no-unresolved": "error",

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "max-lines-per-function": ["error", { max: 50 }],
      "complexity": ["error", { max: 10 }],
      "max-params": ["error", { max: 3 }],
      "max-nested-callbacks": ["error", { max: 3 }],
      "max-lines": ["error", { max: 300 }],
      "max-statements": ["error", { max: 20 }],
      "max-depth": ["error", { max: 3 }],
      "max-len": ["error", { code: 100, ignoreUrls: true }],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "single", { avoidEscape: true }],
      "comma-dangle": ["error", "always-multiline"],
      "arrow-parens": ["error", "always"],
      "arrow-body-style": ["error", "as-needed"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "computed-property-spacing": ["error", "never"],
      "space-in-parens": ["error", "never"],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always"
        }
      ],
      "space-before-blocks": ["error", "always"],
      "keyword-spacing": ["error", { before: true, after: true }],
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "comma-spacing": ["error", { before: false, after: true }],
      "semi-spacing": ["error", { before: false, after: true }],
      "space-infix-ops": "error",
      "space-unary-ops": ["error", { words: true, nonwords: false }],
      "spaced-comment": ["error", "always"],
      "no-multi-spaces": "error",
      "no-whitespace-before-property": "error",
      "no-spaced-func": "error",
      "no-unneeded-ternary": "error",
      "no-nested-ternary": "error",
      "no-unused-private-class-members": "error",
      "no-constant-condition": "error",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-empty": "error",
      "no-empty-character-class": "error",
      "no-ex-assign": "error",
      "no-extra-boolean-cast": "error",
      "no-extra-semi": "error",
      "no-func-assign": "error",
      "no-inner-declarations": "error",
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-obj-calls": "error",
      "no-regex-spaces": "error",
      "no-sparse-arrays": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "use-isnan": "error",
      "valid-jsdoc": "error",
      "valid-typeof": "error"
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true
        }
      }
    }
  }
];

export default eslintConfig;
