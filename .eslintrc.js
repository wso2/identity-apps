/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 *
 */

// Base ESLint Config which can be extended to be used in the development environment.

const LINE_PADDING_RULES = [
    1,
    // Add a new line after const, let, var declarations.
    { blankLine: "always", next: "*", prev: [ "const", "let", "var" ] },
    { blankLine: "any", next: [ "const", "let", "var" ], prev: [ "const", "let", "var" ] },
    // Add a new line after directive declarations like `use strict` etc.
    { blankLine: "always", next: "*", prev: "directive"  },
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

module.exports = {
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
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module"
    },
    plugins: ["import"],
    settings: {
        react: {
            version: "detect"
        }
    },
    env: {
        browser: true,
        jest: true,
        node: true,
        es6: true
    },
    root: true,
    rules: {
        "eol-last": "error",
        "quotes": ["warn", "double"],
        "max-len": ["warn", { "code": 120 }],
        "comma-dangle": ["warn", "never"],
        "sort-imports": ["warn", {
            "ignoreCase": false,
            "ignoreDeclarationSort": true,
            "ignoreMemberSort": false
        }],
        "react/jsx-first-prop-new-line": [ 1, "multiline" ],
        "react/jsx-max-props-per-line": [
            1,
            { maximum: 1, when: "multiline" },
        ],
        "indent": [ 1, 4, {
            SwitchCase: 1
        } ],
        "array-bracket-spacing": [ 1, "always" ],
        "no-unreachable": "error",
        "no-alert": 1,
        "lines-between-class-members": [ 1, "always", { "exceptAfterSingleLine": true } ],
        "import/order": [
            "warn",
            {
                "groups": [ "builtin", "external", "index", "sibling", "parent", "internal" ],
                "alphabetize": {
                    order: 'asc',
                    caseInsensitive: true
                }
            }
        ],
        "padding-line-between-statements": [
            ...LINE_PADDING_RULES
        ],
        "react/jsx-curly-spacing": [
            "warn",
            {
                when: "always",
                children: { "when": "always" },
                allowMultiline: true,
                spacing: { objectLiterals: "always" }
            }
        ],
        "no-unused-vars": 1,
        "react-hooks/exhaustive-deps": ["off"],
        "react/no-children-prop": 0,
        "react/display-name": 0,
        "react/jsx-wrap-multilines": [ "warn", {
            arrow: "parens",
            assignment: "parens",
            condition: "parens",
            declaration: "parens",
            logical: "parens",
            prop: "parens",
            return: "parens"
        } ],
        "react/prop-types": 1,
        "sort-keys": ["warn", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}],
        "object-curly-spacing": ["warn", "always"],
        "no-console": "warn",
        "no-duplicate-imports": "warn",
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
                    }
                ],
                patterns: [ "@wso2is/**/dist/**", "lodash/**", "lodash/fp/**" ]
            }
        ],
        "semi": 1,
        "jsx-quotes": [ "warn", "prefer-double" ]
    },
    overrides: [
        {
            files: ["**/*.tsx", "**/*.ts"],
            parser: "@typescript-eslint/parser",
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/eslint-recommended",
                "plugin:@typescript-eslint/recommended"
            ],
            parserOptions: {
                ecmaVersion: 9,
                sourceType: "module"
            },
            settings: {
                react: {
                    version: "detect"
                }
            },
            env: {
                browser: true,
                node: true,
                es6: true
            },
            rules: {
                "eol-last": "error",
                // `no-undef` is discouraged in Typescript projects.
                // https://github.com/typescript-eslint/typescript-eslint/issues/2477#issuecomment-686892459
                "no-undef": 0,
                "padding-line-between-statements": "off",
                "@typescript-eslint/padding-line-between-statements": [
                    ...LINE_PADDING_RULES
                ],
                "@typescript-eslint/no-explicit-any": 0,
                "@typescript-eslint/explicit-function-return-type": 0,
                "@typescript-eslint/no-inferrable-types": "off",
                "no-use-before-define": "off",
                "@typescript-eslint/ban-types": 1,
                "@typescript-eslint/no-empty-function": [ "error", { "allow": ["constructors"] } ],
                "@typescript-eslint/no-use-before-define": [
                    "warn",
                    {
                        functions: false,
                        classes: false,
                        variables: false,
                        typedefs: false
                    }
                ],
                // In development, error level is set to `warn`. This will be overridden
                // by the production env linting config.
                "no-debugger": 1
            }
        }
    ]
};
