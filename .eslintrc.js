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
        node: true
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
        "react/no-children-prop": 0
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
                "react/display-name": 0
            }
        }
    ]
};
