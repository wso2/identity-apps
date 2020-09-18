module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:import/typescript"
    ],
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module"
    },
    plugins: [ "import" ],
    env: {
        browser: true,
        jest: true,
        node: true,
        es6: true
    },
    rules: {
        "eol-last": "error",
        "quotes": [ "warn", "double" ],
        "max-len": [ "warn", { "code": 120 } ],
        "comma-dangle": [ "warn", "never" ],
        "sort-imports": [ "warn", {
            "ignoreCase": false,
            "ignoreDeclarationSort": true,
            "ignoreMemberSort": false
        } ],
        "import/order": [
            "warn",
            {
                "groups": [ "builtin", "external", "index", "sibling", "parent", "internal" ],
                "alphabetize": {
                    order: "asc",
                    caseInsensitive: true
                }
            }
        ],
        "sort-keys": [ "warn", "asc", { "caseSensitive": true, "natural": false, "minKeys": 2 } ],
        "object-curly-spacing": [ "warn", "always" ],
        "no-console": "warn",
        "no-duplicate-imports": "warn"    },
    overrides: [
        {
            files: [ "**/*.tsx", "**/*.ts" ],
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
            env: {
                browser: true,
                node: true,
                es6: true
            },
            rules: {
                "eol-last": "error",
                "@typescript-eslint/no-explicit-any": 0,
                "@typescript-eslint/explicit-function-return-type": 0,
                "@typescript-eslint/no-inferrable-types": "off",
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
