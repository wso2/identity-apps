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
 */

module.exports = {
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
    testEnvironment: "jest-environment-jsdom-global",
    roots: [
        "src"
    ],
    testMatch: ["<rootDir>/**/?(*.)test.{ts,tsx}"],
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)?$": "babel-jest"
    },
    modulePaths: [
        "<rootDir>"
    ],
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json"
        }
    },
    transformIgnorePatterns: [
        "/node_modules/?(?!@wso2is)"
    ],
    testPathIgnorePatterns: [
        "<rootDir>/(build|docs|node_modules)/"
    ],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$"
            : "<rootDir>/test-configs/file-mock.js",
        "\\.(css|less)$": "<rootDir>/test-configs/style-mock.js",
        "\\.svg": "<rootDir>/test-configs/svgrMock.js"
    },
    setupFilesAfterEnv: [
        "<rootDir>/test-configs/setup-test.js"
    ],
    verbose: true
};
