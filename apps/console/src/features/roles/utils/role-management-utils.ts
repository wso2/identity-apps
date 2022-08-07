/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { getPermissionList, searchRoleList } from "../api";
import { generatePermissionTree } from "../components/role-utils";
import { PermissionObject, SearchRoleInterface, TreeNode } from "../models";

/**
 * Utility class for roles operations.
 */
export class RoleManagementUtils {

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
     * Util method to validate if the provided role name exists in the system.
     *
     * @param roleName - new role name user entered.
     */
    public static validateRoleName = (roleName: string): Promise<boolean> => {
        const searchData: SearchRoleInterface = {
            filter: "displayName eq " + roleName,
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
            ],
            startIndex: 1
        };

        return searchRoleList(searchData)
            .then((response) => {
                return response?.data?.totalResults === 0;
            });
    };

    /**
     * Retrieve all permissions from backend.
     *
     * @param {string[]} permissionsToSkip - Array of permissions to filter out.
     * @return {Promise<TreeNode[]>}
     */
    public static getAllPermissions = (permissionsToSkip?: string[], tenantDomain?: string): Promise<TreeNode[]> => {
        return getPermissionList().then((response) => {
            if (response.status === 200 && response.data && response.data instanceof Array) {

                const permissionStringArray: PermissionObject[] = !isEmpty(permissionsToSkip)
                    ? response.data.filter((permission: { resourcePath: string; }) => 
                        !permissionsToSkip.includes(permission.resourcePath))
                    : response.data;

                let permissionTree: TreeNode[] = [];

                permissionTree = permissionStringArray.reduce((arr, path) => {

                    let nodes: TreeNode[] = [];

                    nodes = generatePermissionTree(
                        path,
                        path.resourcePath.replace(/^\/|\/$/g, "").split("/"),
                        arr
                    );
                    
                    return nodes;
                },[]);

                if (tenantDomain !== "carbon.super"
                    && permissionTree[0]?.key?.toString().replace(/^\/|\/$/g, "").split("/").length == 2) {
                    return permissionTree[0]?.children;
                }
                
                return permissionTree;
            }
        });
    }
}
