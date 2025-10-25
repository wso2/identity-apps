/**
 * Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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

const fs = require("fs");
const path = require("path");
const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const importPlugin = require("eslint-plugin-import");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const tsdocPlugin = require("eslint-plugin-tsdoc");
const headerPlugin = require("eslint-plugin-header");
const jsoncParser = require("jsonc-eslint-parser");
const { fixupPluginRules } = require("@eslint/compat");

// Base ESLint Config which can be extended to be used in the development environment.

const LICENSE_HEADER_PATTERN_OVERRIDE_FILE_NAME = "license-header-override.js";

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

/**
 * Check if an override license header file is defined , if so,
 * return that else return the default license header pattern.
 *
 * @example
 * Here's a simple example of overriding the license header pattern.:
 * ```
 * // create a `license-header-override.js` at the same level of `eslint.config.js`
 * module.exports = [
 *     " * New Company.",
       " * Copyright 2022.",
 * ];
 * ```
 *
 * @returns License Header Pattern.
 */
const getLicenseHeaderPattern = () => {

    const LICENSE_HEADER_DEFAULT_PATTERN = [
        "*",
        {
            pattern: " Copyright \\(c\\) \\b(2019|202[0-5])(?:-(202[0-5]))?, WSO2 LLC. \\(https://www.wso2.com\\).$",
            template: " * Copyright (c) {{year}}, WSO2 LLC. (https://www.wso2.com)."
        },
        " *",
        " * WSO2 LLC. licenses this file to you under the Apache License,",
        " * Version 2.0 (the \"License\"); you may not use this file except",
        " * in compliance with the License.",
        " * You may obtain a copy of the License at",
        " *",
        " *     http://www.apache.org/licenses/LICENSE-2.0",
        " *",
        " * Unless required by applicable law or agreed to in writing,",
        " * software distributed under the License is distributed on an",
        " * \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY",
        " * KIND, either express or implied. See the License for the",
        " * specific language governing permissions and limitations",
        " * under the License.",
        " "
    ];

    if (!fs.existsSync(path.resolve(__dirname, LICENSE_HEADER_PATTERN_OVERRIDE_FILE_NAME))) {
        return LICENSE_HEADER_DEFAULT_PATTERN;
    }

    return require(path.resolve(__dirname, LICENSE_HEADER_PATTERN_OVERRIDE_FILE_NAME));
};

module.exports = [
    // Ignore patterns
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/coverage/**",
            "**/tmp/**",
            "**/*.min.js"
        ]
    },

    // Base JavaScript configuration
    {
        files: ["**/*.js", "**/*.jsx"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                browser: true,
                es6: true,
                jest: true,
                node: true,
                JSX: false,
                globalThis: false
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": fixupPluginRules(reactHooksPlugin),
            import: importPlugin,
            // header: fixupPluginRules(headerPlugin), // TODO: Re-enable after eslint-plugin-header supports ESLint v9 flat config
            tsdoc: tsdocPlugin
        },
        rules: {
            ...js.configs.recommended.rules,
            "array-bracket-spacing": [ 1, "always" ],
            "comma-dangle": [ "warn", "never" ],
            "eol-last": "error",
            // "header/header": [ // TODO: Re-enable after eslint-plugin-header supports ESLint v9 flat config
            //     "warn",
            //     "block",
            //     getLicenseHeaderPattern()
            // ],
            "import/order": [
                "warn",
                {
                    alphabetize: {
                        caseInsensitive: true,
                        order: "asc"
                    },
                    groups: [ "builtin", "external", "index", "sibling", "parent", "internal" ]
                }
            ],
            indent: [
                1,
                4,
                {
                    SwitchCase: 1
                }
            ],
            "jsx-quotes": [ "warn", "prefer-double" ],
            "lines-between-class-members": [
                1,
                "always",
                {
                    exceptAfterSingleLine: true
                }
            ],
            "max-len": [
                "warn",
                {
                    code: 120
                }
            ],
            "no-alert": 1,
            "no-console": "warn",
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
                            message: "Avoid using Popup from Semantic. Instead import it from @wso2is/react-components.",
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
                        "apps/**/*",
                        "modules/**/*",
                        "features/**/*"
                    ]
                }
            ],
            "no-trailing-spaces": "warn",
            "no-unreachable": "error",
            "no-unsafe-optional-chaining": "off",
            "object-curly-spacing": [ "warn", "always" ],
            "padding-line-between-statements": [ ...LINE_PADDING_RULES ],
            quotes: [ "warn", "double" ],
            "react-hooks/exhaustive-deps": [ "off" ],
            "react/display-name": 0,
            "react/jsx-curly-spacing": [
                "warn",
                {
                    allowMultiline: true,
                    children: {
                        when: "always"
                    },
                    spacing: {
                        objectLiterals: "always"
                    },
                    when: "always"
                }
            ],
            "react/jsx-first-prop-new-line": [ 1, "multiline" ],
            "react/jsx-max-props-per-line": [
                1,
                {
                    maximum: 1,
                    when: "multiline"
                }
            ],
            "react/jsx-wrap-multilines": [
                "warn",
                {
                    arrow: "parens",
                    assignment: "parens",
                    condition: "parens",
                    declaration: "parens",
                    logical: "parens",
                    prop: "parens",
                    return: "parens"
                }
            ],
            "react/no-children-prop": 0,
            "react/no-danger": 2,
            "react/prop-types": 1,
            semi: 1,
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
                {
                    caseSensitive: true,
                    minKeys: 2,
                    natural: false
                }
            ],
            "tsdoc/syntax": "warn"
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },

    // TypeScript configuration
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                browser: true,
                es6: true,
                node: true,
                jest: true,
                JSX: false,
                globalThis: false
            }
        },
        plugins: {
            "@typescript-eslint": tseslint,
            react: reactPlugin,
            "react-hooks": fixupPluginRules(reactHooksPlugin),
            import: importPlugin,
            // header: fixupPluginRules(headerPlugin), // TODO: Re-enable after eslint-plugin-header supports ESLint v9 flat config
            tsdoc: tsdocPlugin
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            // Note: @typescript-eslint/ban-types was removed in TypeScript ESLint v8
            // Use @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-wrapper-object-types instead if needed
            "@typescript-eslint/explicit-function-return-type": 0,
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-extra-semi": 0,
            "@typescript-eslint/no-inferrable-types": "off",
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
            // Note: @typescript-eslint/padding-line-between-statements was removed in TypeScript ESLint v8
            // Use @stylistic/ts/padding-line-between-statements if needed, or configure via Prettier/formatter
            "padding-line-between-statements": [ ...LINE_PADDING_RULES ],
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
            "array-bracket-spacing": [ 1, "always" ],
            "comma-dangle": [ "warn", "never" ],
            "eol-last": "error",
            // "header/header": [ // TODO: Re-enable after eslint-plugin-header supports ESLint v9 flat config
            //     "warn",
            //     "block",
            //     getLicenseHeaderPattern()
            // ],
            "import/order": [
                "warn",
                {
                    alphabetize: {
                        caseInsensitive: true,
                        order: "asc"
                    },
                    groups: [ "builtin", "external", "index", "sibling", "parent", "internal" ]
                }
            ],
            indent: [
                1,
                4,
                {
                    SwitchCase: 1
                }
            ],
            "jsx-quotes": [ "warn", "prefer-double" ],
            "lines-between-class-members": [
                1,
                "always",
                {
                    exceptAfterSingleLine: true
                }
            ],
            "max-len": [
                "warn",
                {
                    code: 120
                }
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
                            message: "Avoid using Popup from Semantic. Instead import it from @wso2is/react-components.",
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
                        "apps/**/*",
                        "modules/**/*",
                        "features/**/*"
                    ]
                }
            ],
            "no-trailing-spaces": "warn",
            "no-undef": 0,
            "no-unreachable": "error",
            "no-unsafe-optional-chaining": "off",
            "no-use-before-define": "off",
            "object-curly-spacing": [ "warn", "always" ],
            "padding-line-between-statements": "off",
            quotes: [ "warn", "double" ],
            "react-hooks/exhaustive-deps": [ "off" ],
            "react/display-name": 0,
            "react/jsx-curly-spacing": [
                "warn",
                {
                    allowMultiline: true,
                    children: {
                        when: "always"
                    },
                    spacing: {
                        objectLiterals: "always"
                    },
                    when: "always"
                }
            ],
            "react/jsx-first-prop-new-line": [ 1, "multiline" ],
            "react/jsx-max-props-per-line": [
                1,
                {
                    maximum: 1,
                    when: "multiline"
                }
            ],
            "react/jsx-wrap-multilines": [
                "warn",
                {
                    arrow: "parens",
                    assignment: "parens",
                    condition: "parens",
                    declaration: "parens",
                    logical: "parens",
                    prop: "parens",
                    return: "parens"
                }
            ],
            "react/no-children-prop": 0,
            "react/no-danger": 2,
            "react/prop-types": 1,
            semi: 1,
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
                {
                    caseSensitive: true,
                    minKeys: 2,
                    natural: false
                }
            ],
            "tsdoc/syntax": "warn"
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },

    // JSON configuration
    {
        files: ["**/*.json"],
        languageOptions: {
            parser: jsoncParser
        },
        rules: {
            // "header/header": "off", // TODO: Re-enable after eslint-plugin-header supports ESLint v9 flat config
            "max-len": "off",
            "semi": "off"
        }
    },

    // JavaScript-specific overrides
    {
        files: ["**/*.js"],
        rules: {
            "tsdoc/syntax": "off"
        }
    },

    // ESLint config files  
    {
        files: ["**/eslint.config.js", "**/.eslintrc.js"],
        languageOptions: {
            globals: {
                module: "readonly",
                require: "readonly",
                __dirname: "readonly",
                process: "readonly"
            }
        }
    },
    
    // Node.js scripts (build scripts, config files, etc.)
    {
        files: ["**/scripts/**/*.js", "**/scripts/**/*.cjs", "**/*.config.js", "**/*.config.cjs"],
        languageOptions: {
            globals: {
                module: "readonly",
                require: "readonly",
                __dirname: "readonly",
                process: "readonly",
                console: "readonly",
                Buffer: "readonly",
                __filename: "readonly"
            }
        }
    }
];
