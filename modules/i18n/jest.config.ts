/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

module.exports = {
    displayName: "i18n",
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json"
        }
    },
    moduleDirectories: [
        "node_modules",
        "test-configs",
        __dirname
    ],
    moduleFileExtensions: [
        "js",
        "jsx",
        "ts",
        "tsx",
        "json",
        "node"
    ],
    moduleNameMapper: {
        "^@unit-testing(.*)$": "<rootDir>/test-configs/utils",
        "^lodash-es/(.*)$": "<rootDir>/../../node_modules/lodash/$1"
    },
    modulePaths: [
        "<rootDir>"
    ],
    roots: [
        "src"
    ],
    setupFilesAfterEnv: [
        "<rootDir>/test-configs/setup-test.ts"
    ],
    testMatch: [
        "<rootDir>/**/?(*.)test.{ts,tsx}"
    ],
    testPathIgnorePatterns: [
        "<rootDir>/(build|docs|node_modules)/"
    ],
    transform: {
        "^.+\\.(js|jsx)?$": "babel-jest",
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    transformIgnorePatterns: [
        "/node_modules/?(?!@wso2is)"
    ],
    verbose: true
};
