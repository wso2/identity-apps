module.exports = {
    extends: ["eslint:recommended", "plugin:react/recommended"],
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
        jest: true,
        node: true,
        es6: true
    },
    rules: {
        "eol-last": "error",
        "quotes": ["warn", "double"],
        "max-len": ["warn", { "code": 120 }],
        "react/jsx-curly-spacing": [
            2,
            "always",
            {
                allowMultiline: true,
                spacing: { objectLiterals: "always" }
            }
        ],
        "react/no-children-prop": 0,
        "sort-keys": ["warn", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}],
        "object-curly-spacing": ["warn", "always"],
        "no-console": "warn",
    },
    overrides: [
        {
            files: ["**/*.tsx", "**/*.ts"],
            parser: "@typescript-eslint/parser",
            extends: [
                "eslint:recommended",
                "plugin:react/recommended",
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
                "react/jsx-curly-spacing": [
                    2,
                    "always",
                    {
                        allowMultiline: true,
                        spacing: { objectLiterals: "always" }
                    }
                ],
                "react/no-children-prop": 0,
                "react/prop-types": "off",
                "@typescript-eslint/no-explicit-any": 0,
                "@typescript-eslint/explicit-function-return-type": 0,
                "react/display-name": 0,
                "no-use-before-define": "off",
                "@typescript-eslint/no-use-before-define": [
                    "warn",
                    {
                        functions: false,
                        classes: false,
                        variables: false,
                        typedefs: false
                    }
                ]
            }
        }
    ]
};
