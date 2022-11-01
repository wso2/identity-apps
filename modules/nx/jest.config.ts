/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

export default {
    coverageReporters: [ "html" ],
    displayName: "nx",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.spec.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js",
        "html"
    ],
    // TODO: Maintain the resolver on our side.
    resolver: "@nrwl/jest/plugins/resolver",
    testEnvironment: "jsdom",
    /**
     * manually set the exports names to load in common js, to mimic the behaviors of jest 27
     * before jest didn't fully support package exports and would load in common js code (typically via main field).
     * now jest 28+ will load in the browser esm code, but jest esm support is not fully supported.
     * In this case we will tell jest to load in the common js code regardless of environment.
     *
     * this can be removed via just overriding this setting in it's usage
     *
     * @example
     * module.exports = \{
     *   ...nxPreset,
     *   testEnvironmentOptions: \{\},
     * \}
     */
    testEnvironmentOptions: {
        customExportConditions: [
            "node",
            "require",
            "default"
        ]
    },
    testMatch: [
        "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    transform: {
        "^.+\\.[tj]s$": "ts-jest"
    }
};
