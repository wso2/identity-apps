# ESLint v9 Migration Guide

This document provides a comprehensive guide for the migration from ESLint v8 to ESLint v9 with the new flat configuration format in the identity-apps monorepo.

## Table of Contents

- [Overview](#overview)
- [What Changed](#what-changed)
- [Dependency Updates](#dependency-updates)
- [Configuration Format Changes](#configuration-format-changes)
- [Breaking Changes](#breaking-changes)
- [Migration Steps](#migration-steps)
- [Troubleshooting](#troubleshooting)
- [Developer Workflow](#developer-workflow)
- [Resources](#resources)

## Overview

ESLint v9 introduces a new flat configuration format that replaces the old `.eslintrc.js` format. This migration updates the entire identity-apps monorepo to use ESLint v9 with the new flat config system.

### Key Benefits

- **Simpler Configuration**: Flat config uses JavaScript arrays instead of cascading configs
- **Better Performance**: Improved caching and faster linting
- **TypeScript Native**: Better TypeScript support out of the box
- **Plugin Compatibility**: Modern plugin system with better compatibility

## What Changed

### Version Updates

| Package | Before | After |
|---------|--------|-------|
| `eslint` | 8.46.0 | 9.38.0 |
| `@typescript-eslint/eslint-plugin` | 6.5.0 | 8.18.2 |
| `@typescript-eslint/parser` | 6.5.0 | 8.18.2 |

### New Dependencies Added

- `@eslint/js` (^9.17.0) - ESLint's recommended configurations
- `@eslint/compat` (^1.2.4) - Compatibility layer for legacy plugins
- `@eslint/eslintrc` (^3.2.0) - Utilities for flat config

### Files Changed

- **Created**: 13 new `eslint.config.js` files (root + 12 modules/apps)
- **Removed**: 13 `.eslintignore` files (replaced by `ignores` property in config)
- **Updated**: 11 `package.json` files (dependency updates and script fixes)

## Dependency Updates

All packages in the monorepo have been updated with the new ESLint v9 dependencies:

```json
{
  "devDependencies": {
    "@eslint/compat": "^1.2.4",
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.17.0",
    "@typescript-eslint/eslint-plugin": "^8.18.2",
    "@typescript-eslint/parser": "^8.18.2",
    "eslint": "^9.17.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

## Configuration Format Changes

### Before: .eslintrc.js (Cascading Config)

```javascript
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module"
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        "no-console": "warn"
    }
};
```

### After: eslint.config.js (Flat Config)

```javascript
const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");

module.exports = [
    {
        ignores: ["**/dist/**", "**/node_modules/**"]
    },
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: "module"
            },
            globals: {
                window: "readonly",
                document: "readonly"
            }
        },
        plugins: {
            "@typescript-eslint": tseslint,
            react: reactPlugin
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            "no-console": "warn"
        }
    }
];
```

### Key Differences

1. **Array-based**: Flat config uses an array of configuration objects
2. **Explicit imports**: Plugins and parsers are explicitly imported
3. **languageOptions**: Replaces `env`, `parser`, and `parserOptions`
4. **ignores**: Replaces `.eslintignore` files
5. **No extends**: Rules are spread directly from config objects

## Breaking Changes

### 1. Removed Deprecated Rules

The following TypeScript ESLint rules were removed in v8:

- `@typescript-eslint/ban-types` → Use `@typescript-eslint/no-unsafe-function-type` instead
- `@typescript-eslint/padding-line-between-statements` → Use base ESLint `padding-line-between-statements` or `@stylistic/ts/padding-line-between-statements`

### 2. CLI Flag Changes

Deprecated CLI flags have been removed:

**Before:**
```bash
eslint --ext .js,.jsx,.ts,.tsx --resolve-plugins-relative-to . src/
```

**After:**
```bash
eslint src/
```

The `--ext` and `--resolve-plugins-relative-to` flags are no longer needed. ESLint v9 automatically detects file types based on the `files` patterns in the config.

### 3. Plugin Compatibility

Some plugins require the `@eslint/compat` compatibility layer:

```javascript
const { fixupPluginRules } = require("@eslint/compat");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

module.exports = [
    {
        plugins: {
            "react-hooks": fixupPluginRules(reactHooksPlugin)
        }
    }
];
```

### 4. Header Plugin Disabled

The `eslint-plugin-header` is currently disabled as it doesn't support flat config yet:

```javascript
// TODO: Re-enable after eslint-plugin-header supports ESLint v9 flat config
// "header/header": ["warn", "block", getLicenseHeaderPattern()]
```

## Migration Steps

### For New Modules

If you're adding a new module/app to the monorepo:

1. **Create `eslint.config.js`** in your module root:

```javascript
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

const baseConfig = require("../../eslint.config.js");

module.exports = [
    ...baseConfig,
    // Add module-specific overrides here if needed
];
```

2. **Update `package.json`** lint scripts:

```json
{
  "scripts": {
    "lint": "pnpm lint:all",
    "lint:all": "pnpm lint:targeted -- .",
    "lint:targeted": "eslint"
  }
}
```

Note: Do NOT include `--ext` or `--resolve-plugins-relative-to` flags.

### For Build Scripts

Build scripts and Node.js files are automatically configured with Node.js globals:

```javascript
// Files matching these patterns have Node.js globals:
// - **/scripts/**/*.js
// - **/*.config.js
// - **/*.config.cjs
```

## Troubleshooting

### Issue: "Cannot find module '@eslint/compat'"

**Solution:** Run `pnpm install` at the root to install all dependencies.

### Issue: "Invalid option '--ext'"

**Solution:** Remove the `--ext` flag from your lint scripts. ESLint v9 doesn't need it.

### Issue: "Rule 'X' not found in plugin"

**Solution:** The rule may have been deprecated. Check the [TypeScript ESLint v8 migration guide](https://typescript-eslint.io/blog/announcing-typescript-eslint-v8/) for alternatives.

### Issue: Plugin compatibility errors

**Solution:** Wrap the plugin with `fixupPluginRules()` from `@eslint/compat`:

```javascript
const { fixupPluginRules } = require("@eslint/compat");
const plugin = require("eslint-plugin-name");

plugins: {
    "plugin-name": fixupPluginRules(plugin)
}
```

### Issue: "'require' is not defined"

**Solution:** Add Node.js globals for config/script files in `eslint.config.js`:

```javascript
{
    files: ["**/scripts/**/*.js"],
    languageOptions: {
        globals: {
            require: "readonly",
            module: "readonly",
            __dirname: "readonly"
        }
    }
}
```

## Developer Workflow

### Running Lint

```bash
# Lint all packages
pnpm run lint

# Lint specific package
cd modules/core
pnpm run lint

# Lint specific files
npx eslint src/components/**/*.tsx

# Auto-fix issues
npx eslint src/ --fix
```

### IDE Integration

Most IDEs (VSCode, WebStorm, etc.) should automatically detect the new `eslint.config.js` format. If you have issues:

1. **Update your ESLint extension** to the latest version
2. **Restart your IDE** after installing dependencies
3. **Check ESLint output** in the IDE console for errors

### Pre-commit Hooks

If you use husky or lint-staged, no changes are needed. The hooks will use the new config automatically.

## Resources

### Official Documentation

- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)
- [Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files)
- [TypeScript ESLint v8 Announcement](https://typescript-eslint.io/blog/announcing-typescript-eslint-v8/)

### Helpful Links

- [ESLint v9 Release Notes](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/)
- [Plugin Compatibility List](https://github.com/eslint/eslint/issues/18093)
- [Configuration File Format](https://eslint.org/docs/latest/use/configure/configuration-files-new)

## Questions or Issues?

If you encounter any issues with the ESLint v9 migration:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the official [ESLint v9 migration guide](https://eslint.org/docs/latest/use/configure/migration-guide)
3. Open an issue in the identity-apps repository

---

**Migration completed:** October 2025  
**ESLint version:** 9.38.0  
**TypeScript ESLint version:** 8.18.2
