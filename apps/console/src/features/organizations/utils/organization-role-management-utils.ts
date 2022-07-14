/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import isEmpty from "lodash-es/isEmpty";
import {generatePermissionTree} from "../../roles/components/role-utils";
import {getOrganizationPermissions} from "../api";
import {PermissionObject, TreeNode} from "../models";

/**
 * Utility class for roles operations.
 */
export class OrganizationRoleManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
    }

    /**
     * Util function to join split permission string for given array location.
     *
     * @param permissionString permission string
     * @param joinLocation location to join the string
     */
    public static permissionJoining = (permissionString: string, joinLocation: number): string[] => {
        let permissionStringList = permissionString.split("/");
        const first = permissionStringList.splice(0, joinLocation);

        permissionStringList = [ first.join("/"), ...permissionString ];

        return permissionStringList;
    };

    /**
     * Retrieve all permissions from backend.
     *
     * @param {string[]} permissionsToSkip - Array of permissions to filter out.
     * @return {Promise<TreeNode[]>}
     */
    public static getAllOrganizationLevelPermissions = (permissionsToSkip?: string[]): Promise<TreeNode[]> => {
        return getOrganizationPermissions().then((response) => {
            if (response.status === 200 && response.data && response.data instanceof Array) {

                const permissionStringArray: PermissionObject[] = !isEmpty(permissionsToSkip)
                    ? response.data.filter((permission: { resourcePath: string; }) =>
                        !permissionsToSkip.includes(permission.resourcePath))
                    : response.data;

                let permissionTree: TreeNode[] = [];
                let isStartingWithTwoNodes: boolean = false;

                permissionTree = permissionStringArray.reduce((arr, path, index) => {

                    let nodes: TreeNode[] = [];

                    if (index === 0 && path.resourcePath.replace(/^\/|\/$/g, "").split("/").length == 2) {
                        isStartingWithTwoNodes = true;
                    }

                    if (isStartingWithTwoNodes) {
                        nodes = generatePermissionTree(
                            path,
                            OrganizationRoleManagementUtils.permissionJoining(
                                path.resourcePath.replace(/^\/|\/$/g, ""), 2
                            ),
                            arr
                        );
                    } else {
                        nodes = generatePermissionTree(
                            path,
                            path.resourcePath.replace(/^\/|\/$/g, "").split("/"),
                            arr
                        );
                    }

                    return nodes;
                }, []);

                return permissionTree;
            }
        });
    }

    /**
     * A Util method to create an array of permission object with heirarchy.
     *
     * @param permissioObject - Permission Object
     * @param pathComponents - Permission Path Array
     * @param permissionTreeArray - Permission Tree array for reference
     *
     * @returns {TreeNode[]} - Permission array with tree structure
     */
    public static generatePermissionTree(permissioObject: PermissionObject, pathComponents: string[],
        permissionTreeArray: TreeNode[]): TreeNode[] {

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
    }
}
