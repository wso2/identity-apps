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

module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/typescript",
        "plugin:react-hooks/recommended"
    ],
    globals: {
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
        "react/prop-types": 1,
        "sort-keys": ["warn", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}],
        "object-curly-spacing": ["warn", "always"],
        "no-console": "warn",
        "no-duplicate-imports": "warn",
        "no-restricted-imports": ["warn", { "patterns": ["@wso2is/**/dist/**"] }],
        "semi": 1
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
                "no-undef": 1,
                "@typescript-eslint/no-explicit-any": 0,
                "@typescript-eslint/explicit-function-return-type": 0,
                "@typescript-eslint/no-inferrable-types": "off",
                "no-use-before-define": "off",
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
