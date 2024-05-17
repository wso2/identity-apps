/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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
    /* eslint-disable sort-keys */
    moduleNameMapper: {
        "@oxygen-ui/react": "<rootDir>/node_modules/@oxygen-ui/react",
        "@wso2is/core/api": "<rootDir>/../modules/core/dist/src/api",
        "@wso2is/core/configs": "<rootDir>/../modules/core/dist/src/configs",
        "@wso2is/core/constants": "<rootDir>/../modules/core/dist/src/constants",
        "@wso2is/core/errors": "<rootDir>/../modules/core/dist/src/errors",
        "@wso2is/core/exceptions": "<rootDir>/../modules/core/dist/src/exceptions",
        "@wso2is/core/helpers": "<rootDir>/../modules/core/dist/src/helpers",
        "@wso2is/core/hooks": "<rootDir>/../modules/core/dist/src/hooks",
        "@wso2is/core/models": "<rootDir>/../modules/core/dist/src/models",
        "@wso2is/core/store": "<rootDir>/../modules/core/dist/src/store",
        "@wso2is/core/utils": "<rootDir>/../modules/core/dist/src/utils",
        "@wso2is/core/workers": "<rootDir>/../modules/core/dist/src/workers",
        "@wso2is/dynamic-forms":  "<rootDir>/../modules/dynamic-forms/dist",
        "@wso2is/forms": "<rootDir>/../modules/forms/dist",
        "@wso2is/form": "<rootDir>/../modules/form/dist",
        "@wso2is/react-components": "<rootDir>/../modules/react-components/dist",
        "\\.(css|less|scss)$": "<rootDir>/test-configs/__mocks__/style-file.ts",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|md)$":
            "<rootDir>/test-configs/__mocks__/file.ts",
        "\\.svg": "<rootDir>/test-configs/__mocks__/svgr.ts",
        "^lodash-es/(.*)$": "<rootDir>/../node_modules/lodash/$1",
        "^react($|/.+)": "<rootDir>/node_modules/react$1",
        "uuid": "<rootDir>/node_modules/uuid"
    },
    modulePaths: [
        "<rootDir>"
    ],
    roots: [
        "."
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
        "^.+\\.(ts|tsx)?$": [ "ts-jest", {
            tsconfig: "<rootDir>/tsconfig.json"
        } ]
    },
    transformIgnorePatterns: [
        "/node_modules/?(?!@wso2is)",
        "/node_modules/(?!@oxygen-ui/react/)"
    ],
    verbose: true
};
