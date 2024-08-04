/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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
 * // create a `license-header-override.js` at the same level of `.eslintrc.js`
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
            pattern: " Copyright \\(c\\) \\b(2019|202[0-4])(?:-(202[0-4]))?, WSO2 LLC. \\(https://www.wso2.com\\).$",
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

module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/typescript",
        "plugin:react-hooks/recommended"
    ],
    globals: {
        JSX: false,
        // no-undef complains about globalThis @see {@link https://github.com/eslint/eslint/issues/11553}
        globalThis: false
    },
    overrides: [
        {
            env: {
                browser: true,
                es6: true,
                node: true
            },
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/eslint-recommended",
                "plugin:@typescript-eslint/recommended"
            ],
            files: [ "**/*.tsx", "**/*.ts" ],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                ecmaVersion: 9,
                sourceType: "module"
            },
            rules: {
                "@typescript-eslint/ban-types": 1,
                "@typescript-eslint/explicit-function-return-type": 0,
                // Temporary disable the no-empty-function rule.
                // Refer: https://github.com/wso2/product-is/issues/20659
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-explicit-any": 0,
                // Temporary disable the `no-extra-semi` rule.
                // Refer: https://github.com/wso2/product-is/issues/20659
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
                "@typescript-eslint/padding-line-between-statements": [ ...LINE_PADDING_RULES ],
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
                "eol-last": "error",
                // In development, error level is set to `warn`. This will be overridden
                // by the production env linting config.
                "no-debugger": 1,
                // Temporary disable the `no-extra-semi` rule.
                // Refer: https://github.com/wso2/product-is/issues/20659
                "no-extra-semi": 0,
                // `no-undef` is discouraged in Typescript projects.
                // https://github.com/typescript-eslint/typescript-eslint/issues/2477#issuecomment-686892459
                "no-undef": 0,
                "no-unsafe-optional-chaining": "off",
                "no-use-before-define": "off",
                "padding-line-between-statements": "off"
            },
            settings: {
                react: {
                    version: "detect"
                }
            }
        },
        {
            "files": "*.json",
            "parser": "jsonc-eslint-parser",
            "rules": {
                "header/header": "off",
                "max-len": "off",
                "semi": "off"
            }
        },
        {
            "files": [ "*.js" ],
            "rules": {
                "tsdoc/syntax": "off"
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module"
    },
    plugins: [
        "import",
        "eslint-plugin-tsdoc",
        "header"
    ],
    root: true,
    rules: {
        "array-bracket-spacing": [ 1, "always" ],
        "comma-dangle": [ "warn", "never" ],
        "eol-last": "error",
        "header/header": [
            "warn",
            "block",
            getLicenseHeaderPattern()
        ],
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
        // Temporary disable the `no-extra-semi` rule.
        // Refer: https://github.com/wso2/product-is/issues/20659
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
                    },
                    {
                        importNames: [ "hasRequiredScopes" ],
                        message: "Please use \"import { useRequiredScopes } from '@wso2is/access-control'\" instead. " +
                            "Refer documentation: https://github.com/wso2/identity-apps/blob/master/docs/write-code/" +
                            "PERFORMANCE.md#use-userequiredscopes-hook-instead-of-hasrequiredscopes-function",
                        name: "@wso2is/core/helpers"
                    }
                ],
                patterns: [
                    "@wso2is/**/dist/**",
                    "lodash/**",
                    "lodash/fp/**",
                    // prevents using absolute import paths such as "apps/console/src/**/*", "modules/react"
                    // TODO: show an error message in the editor when an absolute import is used[1]. Currently
                    // it's not working for some reason[2].
                    //
                    // [1] https://eslint.org/docs/latest/rules/no-restricted-imports#group
                    // [2] https://stackoverflow.com/q/68126222/8810941
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
};
