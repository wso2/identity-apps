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
import { fileURLToPath } from "url";
import { defineConfig, type UserConfig } from "vitest/config";

interface AliasInterface {
    find: string | RegExp;
    replacement: string;
}

export interface IdentityAppsVitestConfigOptionsInterface {
    aliases?: AliasInterface[];
    displayName: string;
    include?: string[];
    projectRoot: string;
    setupFiles?: string[];
}

const unitTestingConfigDirectory: string = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot: string = path.resolve(unitTestingConfigDirectory, "../..");
const unitTestingRoot: string = path.resolve(workspaceRoot, "modules/unit-testing");

const resolveWorkspacePath = (...segments: string[]): string => {
    return path.resolve(workspaceRoot, ...segments);
};

const createSourcePackageAliases = (packageName: string, sourceEntry: string): AliasInterface[] => [
    {
        find: new RegExp(`^${ packageName.replace("/", "\\/") }$`),
        replacement: resolveWorkspacePath(sourceEntry)
    },
    {
        find: new RegExp(`^${ packageName.replace("/", "\\/") }\\/src$`),
        replacement: resolveWorkspacePath(path.dirname(sourceEntry))
    },
    {
        find: new RegExp(`^${ packageName.replace("/", "\\/") }\\/src\\/(.*)$`),
        replacement: `${ resolveWorkspacePath(path.dirname(sourceEntry)) }/$1`
    }
];

const createCommonAliases = (projectRoot: string): AliasInterface[] => [
    {
        find: "@oxygen-ui/react",
        replacement: path.resolve(projectRoot, "node_modules/@oxygen-ui/react")
    },
    {
        find: "@oxygen-ui/react-icons",
        replacement: path.resolve(projectRoot, "node_modules/@oxygen-ui/react-icons")
    },
    {
        find: /^react-i18next$/,
        replacement: path.resolve(unitTestingRoot, "__mocks__/react-i18next.ts")
    },
    ...createSourcePackageAliases("@wso2is/access-control", "modules/access-control/src/index.ts"),
    ...createSourcePackageAliases("@wso2is/core", "modules/core/src/index.ts"),
    ...createSourcePackageAliases("@wso2is/forms", "modules/forms/src/index.ts"),
    ...createSourcePackageAliases("@wso2is/i18n", "modules/i18n/src/index.ts"),
    ...createSourcePackageAliases("@wso2is/react-components", "modules/react-components/src/index.ts"),
    ...createSourcePackageAliases("@wso2is/theme", "modules/theme/src/index.js"),
    ...createSourcePackageAliases("@wso2is/validation", "modules/validation/src/index.ts"),
    {
        find: /^@wso2is\/core\/(api|configs|constants|errors|exceptions|helpers|hooks|models|store|utils|workers)$/,
        replacement: `${ resolveWorkspacePath("modules/core/src") }/$1`
    },
    {
        find: /^@wso2is\/core\/(api|configs|constants|errors|exceptions|helpers|hooks|models|store|utils|workers)\/(.*)$/,
        replacement: `${ resolveWorkspacePath("modules/core/src") }/$1/$2`
    },
    {
        find: /^@wso2is\/core\/dist\/types\/exceptions\/identity-apps-api-exception$/,
        replacement: resolveWorkspacePath("modules/core/src/exceptions/identity-apps-api-exception.ts")
    },
    {
        find: /^@wso2is\/core\/dist\/types\/store\/actions\/types\/global$/,
        replacement: resolveWorkspacePath("modules/core/src/store/actions/types/global.ts")
    },
    {
        find: /^@wso2is\/forms\/legacy$/,
        replacement: resolveWorkspacePath("modules/forms/src/legacy/index.ts")
    },
    {
        find: /^lodash-es\/(.*)$/,
        replacement: `${resolveWorkspacePath("node_modules/lodash")}/$1`
    },
    {
        find: /^.*\.(css|less|scss)$/,
        replacement: path.resolve(unitTestingRoot, "__mocks__/style-file.ts")
    },
    {
        find: /^.*\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|md)$/,
        replacement: path.resolve(unitTestingRoot, "__mocks__/file.ts")
    },
    {
        find: /^.*\.svg$/,
        replacement: path.resolve(unitTestingRoot, "__mocks__/svgr.ts")
    }
];

export const createIdentityAppsVitestConfig = (
    options: IdentityAppsVitestConfigOptionsInterface
): UserConfig => {
    const setupFiles: string[] = [
        path.resolve(unitTestingRoot, "vitest-setup.ts"),
        ...(options.setupFiles ?? [])
    ];

    return defineConfig({
        resolve: {
            alias: [
                ...createCommonAliases(options.projectRoot),
                ...(options.aliases ?? [])
            ]
        },
        test: {
            coverage: {
                provider: "v8",
                reporter: [
                    "text",
                    "lcov"
                ],
                reportsDirectory: path.resolve(options.projectRoot, "coverage")
            },
            environment: "jsdom",
            environmentOptions: {
                jsdom: {
                    url: "http://localhost"
                }
            },
            exclude: [
                "**/build/**",
                "**/coverage/**",
                "**/dist/**",
                "**/docs/**",
                "**/node_modules/**"
            ],
            globals: true,
            include: options.include ?? [
                "**/?(*.)test.{ts,tsx}"
            ],
            name: options.displayName,
            passWithNoTests: true,
            root: options.projectRoot,
            server: {
                deps: {
                    inline: [
                        /@mui\/x-tree-view/,
                        /^@wso2is\//
                    ]
                }
            },
            setupFiles
        }
    });
};
