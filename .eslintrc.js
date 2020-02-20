module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module",
    },
    settings: {
        react: {
            version: "detect"
        },
    },
    rules: {
        "eol-last": "error",
        "react/jsx-curly-spacing": [2, "always", {
            "allowMultiline": true,
            "spacing": {"objectLiterals": "always"}
        }]
    },
    overrides: [
        {
            files: ["**/*.tsx"],
            rules: {
                "react/prop-types": "off"
            }
        }
    ]
};
