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

import { PermissionObject, TreeNode } from "../models";

/**
  * A Util method to create an array of permission object with heirarchy.
  * 
  * @param permissioObject - Permission Object
  * @param pathComponents - Permission Path Array
  * @param permissionTreeArray - Permission Tree array for reference
  * 
  * @returns {TreeNode[]} - Permission array with tree structure
  */
export const generatePermissionTree = (permissioObject: PermissionObject, pathComponents: string[],
    permissionTreeArray: TreeNode[]): TreeNode[] => {

    const component = pathComponents.shift();
    let permissionComponent = permissionTreeArray.find((permission: TreeNode) => {
        return permission.name === component;
    });

    if (!permissionComponent) {
        permissionComponent = {
            key: permissioObject.resourcePath,
            name: component,
            title: permissioObject.displayName
        };
        permissionTreeArray.push(permissionComponent);
    }

    if (pathComponents.length) { 
        generatePermissionTree(permissioObject, pathComponents, 
            permissionComponent.children || (permissionComponent.children = []));
    }

    return permissionTreeArray;
};
