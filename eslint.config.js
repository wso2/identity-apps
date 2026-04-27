/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

"use strict";

const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");
const importPlugin = require("eslint-plugin-import");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const tsdocPlugin = require("eslint-plugin-tsdoc");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const jsoncPlugin = require("eslint-plugin-jsonc");
const jsoncParser = require("jsonc-eslint-parser");
const testingLibraryPlugin = require("eslint-plugin-testing-library");
const jestDomPlugin = require("eslint-plugin-jest-dom");

const LINE_PADDING_RULES = [
    1,
    // Add a new line after const, let, var declarations.
    { blankLine: "always", next: "*", prev: [ "const", "let", "var" ] },
    { blankLine: "any", next: [ "const", "let", "var" ], prev: [ "const", "let", "var" ] },
    // Add a new line after directive declarations like `use strict` etc.
    { blankLine: "always", next: "*", prev: "directive" },
    { blankLine: "any", next: "directive", prev: "directive" },
    // Add a new line before return statements.
    { blankLine: "always", next: "return", prev: "*" },
    // Add a new line try blocks.
    { blankLine: "always", next: "try", prev: "*" },
    // Add a new line break statements.
    { blankLine: "always", next: "break", prev: "*" },
    // Add a new line continue statements.
    { blankLine: "always", next: "continue", prev: "*" },
    // Add a new line before exports.
    { blankLine: "always", next: "export", prev: "*" },
    { blankLine: "any", next: "export", prev: "export" },
    // Add a new line before for loops.
    { blankLine: "always", next: "for", prev: "*" },
    // Add a new line before classes.
    { blankLine: "always", next: "class", prev: "*" },
    // Add a new line after import statements.
    { blankLine: "always", next: "*", prev: "import" },
    { blankLine: "any", next: "import", prev: "import" }
];

module.exports = [
    // ----- Global ignores (replaces all .eslintignore files) -----
    {
        ignores: [
            "**/node_modules/**",
            "**/target/**",
            "**/build/**",
            "**/dist/**",
            "**/lib/**",
            "**/libs/**",
            "**/js/**",
            "**/identity-apps-core/**/plugins/**",
            // App-specific ignores (previously in apps/.eslintignore)
            "apps/console/src/main/**",
            "apps/console/java/webapp/src/main/webapp/**",
            "apps/console/themes/**",
            "apps/console/src/public/auth-spa-*.min.js",
            "apps/console/src/public/startup-config.js",
            "apps/myaccount/src/main/**",
            "apps/myaccount/java/webapp/src/main/webapp/**",
            "apps/myaccount/themes/**",
            "apps/myaccount/src/public/auth-spa-*.min.js",
            "apps/myaccount/src/public/startup-config.js"
        ]
    },

    // ----- Base ESLint recommended (all files) -----
    js.configs.recommended,

    // ----- Global config for all JS/JSX/TS/TSX files -----
    {
        files: [ "**/*.{js,jsx,ts,tsx,mjs,cjs}" ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2020,
                ...globals.jest,
                ...globals.node,
                JSX: false,
                // no-undef complains about globalThis — see https://github.com/eslint/eslint/issues/11553
                globalThis: false
            },
            parserOptions: {
                ecmaVersion: 9,
                sourceType: "module"
            }
        },
        plugins: {
            "import": importPlugin,
            "jsx-a11y": jsxA11yPlugin,
            "tsdoc": tsdocPlugin
        },
        rules: {
            // General rules
            "array-bracket-spacing": [ 1, "always" ],
            "comma-dangle": [ "warn", "never" ],
            "eol-last": "error",
            // Import plugin — import/typescript equivalent rules
            "import/named": "off",
            "import/no-unresolved": "off",
            // Temporarily disabled due runtime incompatibilities in eslint-plugin-import.
            "import/order": "off",
            indent: [
                1,
                4,
                { SwitchCase: 1 }
            ],
            "jsx-quotes": [ "warn", "prefer-double" ],
            "lines-between-class-members": [
                1,
                "always",
                { exceptAfterSingleLine: true }
            ],
            "max-len": [
                "warn",
                { code: 120 }
            ],
            "no-alert": 1,
            "no-console": "warn",
            "no-debugger": 1,
            "no-duplicate-imports": "warn",
            "no-extra-semi": 0,
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            message: "Please use import foo from 'lodash-es/foo' instead.",
                            name: "lodash"
                        },
                        {
                            message: "Avoid using chain since it is non tree-shakable. Try out flow instead.",
                            name: "lodash-es/chain"
                        },
                        {
                            importNames: [ "chain" ],
                            message: "Avoid using chain since it is non tree-shakable. Try out flow instead.",
                            name: "lodash-es"
                        },
                        {
                            message: "Please use import foo from 'lodash-es/foo' instead.",
                            name: "lodash-es"
                        },
                        {
                            importNames: [ "Popup" ],
                            message: "Avoid using Popup from Semantic. Import from @wso2is/react-components instead.",
                            name: "semantic-ui-react"
                        },
                        {
                            message: "Please use import foo from '@oxygen-ui/react/foo' instead.",
                            name: "@oxygen-ui/react"
                        }
                    ],
                    patterns: [
                        "@wso2is/**/dist/**",
                        "lodash/**",
                        "lodash/fp/**",
                        // prevents using absolute import paths such as "apps/console/src/**/*", "modules/react"
                        "apps/**/*",
                        "modules/**/*",
                        "features/**/*"
                    ]
                }
            ],
            "no-trailing-spaces": "warn",
            "no-unreachable": "error",
            "no-unsafe-optional-chaining": "off",
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],
            "object-curly-spacing": [ "warn", "always" ],
            "padding-line-between-statements": [ ...LINE_PADDING_RULES ],
            "quotes": [ "warn", "double" ],
            "semi": 1,
            "sort-imports": [
                "warn",
                {
                    ignoreCase: false,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false
                }
            ],
            "sort-keys": [
                "warn",
                "asc",
                { caseSensitive: true, minKeys: 2, natural: false }
            ],
            "tsdoc/syntax": "warn"
        }
    },

    // ----- React hook files only -----
    {
        files: [ "**/*.{jsx,tsx}" ],
        plugins: {
            "react": reactPlugin,
            "react-hooks": reactHooksPlugin
        },
        rules: {
            "react-hooks/exhaustive-deps": "off",
            "react-hooks/rules-of-hooks": "error",
            "react/no-deprecated": "warn"
        },
        settings: {
            react: { version: "detect" }
        }
    },

    // ----- TypeScript files -----
    {
        files: [ "**/*.{ts,tsx}" ],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 9,
                sourceType: "module"
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin
        },
        rules: {
            // @typescript-eslint rules (recommended + custom, sorted alphabetically)
            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/ban-ts-comment": "warn",
            // Custom TypeScript rules (from the original .eslintrc.js override)
            "@typescript-eslint/explicit-function-return-type": 0,
            "@typescript-eslint/no-array-constructor": "error",
            "@typescript-eslint/no-duplicate-enum-values": "error",
            // Temporary disable the no-empty-function rule.
            // Refer: https://github.com/wso2/product-is/issues/20659
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-empty-object-type": "error",
            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-extra-non-null-assertion": "error",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-namespace": "error",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-this-alias": "error",
            "@typescript-eslint/no-unnecessary-type-constraint": "error",
            "@typescript-eslint/no-unsafe-declaration-merging": "error",
            "@typescript-eslint/no-unsafe-function-type": "error",
            "@typescript-eslint/no-unused-expressions": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/no-use-before-define": [
                "warn",
                {
                    classes: false,
                    functions: false,
                    typedefs: false,
                    variables: false
                }
            ],
            "@typescript-eslint/no-wrapper-object-types": "error",
            "@typescript-eslint/prefer-as-const": "error",
            "@typescript-eslint/prefer-namespace-keyword": "error",
            "@typescript-eslint/triple-slash-reference": "error",
            "@typescript-eslint/typedef": [
                "warn",
                {
                    "arrayDestructuring": false,
                    "arrowParameter": true,
                    "memberVariableDeclaration": true,
                    "objectDestructuring": false,
                    "parameter": true,
                    "propertyDeclaration": true,
                    "variableDeclaration": true,
                    "variableDeclarationIgnoreFunction": true
                }
            ],
            // Rules turned off since TypeScript handles them
            "constructor-super": "off",
            "eol-last": "error",
            "getter-return": "off",
            "no-const-assign": "off",
            "no-dupe-args": "off",
            "no-dupe-class-members": "off",
            "no-dupe-keys": "off",
            // Temporary disable the `no-extra-semi` rule.
            // Refer: https://github.com/wso2/product-is/issues/20659
            "no-extra-semi": 0,
            "no-func-assign": "off",
            "no-import-assign": "off",
            "no-new-symbol": "off",
            "no-obj-calls": "off",
            "no-redeclare": "off",
            "no-setter-return": "off",
            "no-this-before-super": "off",
            "no-undef": 0,
            "no-unreachable": "off",
            "no-unsafe-negation": "off",
            "no-unsafe-optional-chaining": "off",
            "no-unused-vars": "off",
            "no-use-before-define": "off",
            "no-with": "off",
            "padding-line-between-statements": [ ...LINE_PADDING_RULES ],
            "valid-typeof": "off"
        },
        settings: {
            react: { version: "detect" }
        }
    },

    // ----- JSON files: disable rules that don't apply -----
    {
        files: [ "**/*.json" ],
        languageOptions: { parser: jsoncParser },
        rules: {
            "max-len": "off",
            "semi": "off"
        }
    },

    // ----- JS files: disable tsdoc -----
    {
        files: [ "**/*.js" ],
        rules: {
            "tsdoc/syntax": "off"
        }
    },

    // ----- Module-specific overrides -----
    // Modules where @typescript-eslint/typedef is too strict
    {
        files: [
            "modules/forms/**/*.{ts,tsx}",
            "modules/react-components/**/*.{ts,tsx}",
            "modules/access-control/**/*.{ts,tsx}",
            "modules/validation/**/*.{ts,tsx}"
        ],
        rules: {
            "@typescript-eslint/typedef": "off"
        }
    },
    // i18n module has very long generated lines and loose typing
    {
        files: [ "modules/i18n/**/*.{ts,tsx}" ],
        rules: {
            "@typescript-eslint/typedef": "off",
            "max-len": "off",
            "tsdoc/syntax": "off"
        }
    },

    // ----- App-specific: testing plugins (console & myaccount) -----
    {
        files: [ "apps/console/**/*.{ts,tsx,js,jsx}", "apps/myaccount/**/*.{ts,tsx,js,jsx}" ],
        plugins: {
            "jest-dom": jestDomPlugin,
            "testing-library": testingLibraryPlugin
        },
        rules: {
            // testing-library/dom recommended rules
            ...testingLibraryPlugin.configs.dom.rules,
            // testing-library/react recommended rules
            ...testingLibraryPlugin.configs.react.rules,
            // jest-dom recommended rules
            ...jestDomPlugin.configs.recommended.rules
        }
    },

    // ----- App JSON files: disable formatting rules -----
    {
        files: [
            "apps/console/**/*.json",
            "apps/myaccount/**/*.json"
        ],
        languageOptions: { parser: jsoncParser },
        plugins: { "jsonc": jsoncPlugin },
        rules: {
            "max-len": "off",
            "semi": "off"
        }
    },

    // ----- deployment.config.json: enforce key/array sorting -----
    {
        files: [
            "apps/console/**/deployment.config.json",
            "apps/myaccount/**/deployment.config.json"
        ],
        languageOptions: { parser: jsoncParser },
        plugins: { "jsonc": jsoncPlugin },
        rules: {
            "jsonc/sort-array-values": [ "error", { order: { type: "asc" }, pathPattern: ".*" } ],
            "jsonc/sort-keys": "error",
            "max-len": "off",
            "semi": "off"
        }
    }
];
