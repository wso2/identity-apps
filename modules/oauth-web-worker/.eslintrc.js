module.exports = {
	env: {
		browser: true,
		es6: true,
		jest: true,
		node: true
	},
	extends: ["eslint:recommended", "plugin:import/typescript"],
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
			files: ["**/*.tsx", "**/*.ts"],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				ecmaVersion: 9,
				sourceType: "module"
			},
			rules: {
				"@typescript-eslint/explicit-function-return-type": 0,
				"@typescript-eslint/no-explicit-any": 0,
				"@typescript-eslint/no-inferrable-types": "off",
				"@typescript-eslint/no-use-before-define": [
					"warn",
					{
						classes: false,
						functions: false,
						typedefs: false,
						variables: false
					}
				],
				"eol-last": "error",
				"no-use-before-define": "off"
			}
		}
	],
	parserOptions: {
		ecmaVersion: 9,
		sourceType: "module"
	},
	plugins: ["import"],
	rules: {
		"comma-dangle": ["warn", "never"],
		"eol-last": "error",
		"import/order": [
			"warn",
			{
				alphabetize: {
					caseInsensitive: true,
					order: "asc"
				},
				groups: ["builtin", "external", "index", "sibling", "parent", "internal"]
			}
		],
		"max-len": [
			"warn",
			{
				code: 120
			}
		],
		"no-console": "warn",
		"no-duplicate-imports": "warn",
		"no-restricted-imports": [
			"warn",
			{
				patterns: ["@wso2is/**/dist/**"]
			}
		],
		"object-curly-spacing": ["warn", "always"],
		quotes: ["warn", "double"],
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
		]
	}
};
