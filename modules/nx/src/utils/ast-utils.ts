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

import { ChangeType, StringChange } from "@nrwl/devkit";
import { findNodes } from "@nrwl/workspace/src/utilities/typescript/find-nodes";
import * as ts from "typescript";

export function addImport(
    source: ts.SourceFile,
    statement: string
): StringChange[] {
    const allImports = findNodes(source, ts.SyntaxKind.ImportDeclaration);

    if (allImports.length > 0) {
        const lastImport = allImports[allImports.length - 1];

        return [
            {
                index: lastImport.end + 1,
                text: `\n${statement}\n`,
                type: ChangeType.Insert
            }
        ];
    } else {
        return [
            {
                index: 0,
                text: `\n${statement}\n`,
                type: ChangeType.Insert
            }
        ];
    }
}
