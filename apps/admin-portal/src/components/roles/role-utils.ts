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

import { PermissionObject, Permission } from "../../models/permission"

/**
 * A Util method to create an array of permission object with heirarchy.
 * 
 * @param permObj - Permission Object
 * @param pathcomponents - Permission path array
 * @param permissionTreeArray - Empty array to start with
 * 
 * @returns {Permission[]} - Permission arra with tree structure
 */
export const addPath = (permObj: PermissionObject, pathcomponents: string[],
        permissionTreeArray: Permission[]): Permission[] => {

    const component = pathcomponents.shift()
    let comp = permissionTreeArray.find(item => item.name === component)

    if (!comp) {
        comp = {
            label: permObj.displayName,
            fullPath: permObj.resourcePath,
            isExpanded: true,
            isChecked: false,
            name: component
        }
        permissionTreeArray.push(comp)
    }
    if (pathcomponents.length) {
        addPath(permObj, pathcomponents, comp.children || (comp.children = []))
    }
    
    return permissionTreeArray;
}
