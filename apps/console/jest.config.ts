/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

module.exports = {
    displayName: "console",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.json"
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
        "\\.(css|less|scss)$": "<rootDir>/test-configs/__mocks__/style-file.ts",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|md)$":
            "<rootDir>/test-configs/__mocks__/file.ts",
        "\\.svg": "<rootDir>/test-configs/__mocks__/svgr.ts",
        "^@unit-testing(.*)$": "<rootDir>/test-configs/utils",
        "^lodash-es/(.*)$": "<rootDir>/../../node_modules/lodash/$1",
        "^react($|/.+)": "<rootDir>/node_modules/react$1",
        "@wso2is/form": "<rootDir>/../../modules/form/dist",
        "@wso2is/forms": "<rootDir>/../../modules/forms/dist",
        "@wso2is/common": "<rootDir>/../../modules/common/dist",
        "@wso2is/dynamic-forms":  "<rootDir>/../../modules/dynamic-forms/dist",
        "@wso2is/react-components": "<rootDir>/../../modules/react-components/dist",
        "@oxygen-ui/react": "<rootDir>/node_modules/@oxygen-ui/react"
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
    testEnvironment: "jest-environment-jsdom-global",
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
        "/node_modules/?(?!@wso2is)",
        "/node_modules/(?!@oxygen-ui/react/)"
    ],
    verbose: true,
};
