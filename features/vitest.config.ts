/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import path from "path";
import { createIdentityAppsVitestConfig } from "../modules/unit-testing/vitest.config";

export default createIdentityAppsVitestConfig({
    aliases: [
        {
            find: /^@wso2is\/((?:admin|common)\.[^/]+\.v\d+)$/,
            replacement: `${ path.resolve(__dirname) }/$1/index.ts`
        },
        {
            find: /^@wso2is\/((?:admin|common)\.[^/]+\.v\d+)\/(.*)$/,
            replacement: `${ path.resolve(__dirname) }/$1/$2`
        },
        {
            find: "react-markdown",
            replacement: path.resolve(__dirname, "../modules/unit-testing/__mocks__/empty-mock.ts")
        },
        {
            find: "rehype-attr",
            replacement: path.resolve(__dirname, "../modules/unit-testing/__mocks__/empty-mock.ts")
        },
        {
            find: "uuid",
            replacement: path.resolve(__dirname, "node_modules/uuid")
        }
    ],
    displayName: "features",
    include: [
        "**/?(*.)test.{ts,tsx}"
    ],
    projectRoot: __dirname,
    setupFiles: [
        "../modules/unit-testing/setup-test.ts"
    ]
});
