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

import { Tree, addProjectConfiguration, names } from "@nrwl/devkit";
import { Linter } from "@nrwl/linter";
import { applicationGenerator } from "@nrwl/react";

/**
 * Creates an application in the workspace for testing purposes.
 *
 * @param tree - File tree.
 * @param appName - Name of the application.
 * @param standaloneConfig - Should have standalone project.json?
 */
export async function createApp(
    tree: Tree,
    appName: string,
    standaloneConfig?: boolean
): Promise<any> {

    await applicationGenerator(tree, {
        e2eTestRunner: "none",
        linter: Linter.EsLint,
        name: appName,
        skipFormat: true,
        standaloneConfig,
        style: "css",
        unitTestRunner: "none"
    });
}

/**
 * Creates a library in the workspace for testing purposes.
 *
 * @param tree - File tree.
 * @param libName - Name of the library.
 * @param standaloneConfig - Should have standalone project.json?
 */
export async function createLib(
    tree: Tree,
    libName: string,
    standaloneConfig?: boolean
): Promise<any> {

    const { fileName } = names(libName);

    tree.write(`/libs/${fileName}/src/index.ts`, "import React from 'react';\n");

    addProjectConfiguration(
        tree,
        fileName,
        {
            projectType: "library",
            root: `libs/${fileName}`,
            sourceRoot: `libs/${fileName}/src`,
            tags: [],
            targets: {}
        },
        standaloneConfig
    );
}
