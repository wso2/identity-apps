/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { RoleGroupsInterface } from "@wso2is/core/models";
import { I18n } from "@wso2is/i18n";
import { AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import { SCIMConfigs } from "../../admin.extensions.v1/configs/scim";
import { AppConstants } from "../../admin.core.v1";
import { UserBasicInterface } from "../../admin.users.v1/models/user";
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
     */
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
            .then((response: AxiosResponse) => response?.data?.totalResults === 0);
    };

    /**
     * Retrieve all permissions from backend.
     *
     * @param permissionsToSkip - Array of permissions to filter out.
     * @returns `Promise<TreeNode[]>`
     */
    public static getAllPermissions = (permissionsToSkip?: string[]): Promise<TreeNode[]> => {
        return getPermissionList()
            .then((response: AxiosResponse) => {
                if (response.status === 200 && response.data && response.data instanceof Array) {

                    const permissionStringArray: PermissionObject[] = !isEmpty(permissionsToSkip)
                        ? response.data.filter((permission: { resourcePath: string; }) =>
                            !permissionsToSkip.includes(permission.resourcePath))
                        : response.data;

                    let permissionTree: TreeNode[] = [];

                    permissionTree = permissionStringArray.reduce((arr: TreeNode[], path: PermissionObject) => {

                        let nodes: TreeNode[] = [];

                        nodes = generatePermissionTree(
                            path,
                            path.resourcePath.replace(/^\/|\/$/g, "").split("/"),
                            arr
                        );

                        return nodes;
                    },[]);

                    if (permissionTree[0]?.title !== AppConstants.PERMISSIONS_ROOT_NODE) {
                        return permissionTree[0]?.children;
                    }

                    return permissionTree;
                }
            });
    }

    /**
     * Get the display name from the name with userstore.
     *
     * @param nameWithUserstore - name with userstore
     * @returns - display name
     */
    public static getDisplayName = (nameWithUserstore: string): string =>
        nameWithUserstore?.split("/").length > 1
            ? nameWithUserstore?.split("/")[1]
            : nameWithUserstore;

    /**
     * Get the display name of the group.
     *
     * @param group - group
     * @returns - display name of the group
     */
    public static getGroupDisplayName = (group: RoleGroupsInterface): string => this.getDisplayName(group?.display);

    /**
     * Get the display name of the user.
     *
     * @param user - user
     * @returns - display name of the user
     */
    public static getUserUsername = (user: UserBasicInterface): string => this.getDisplayName(user?.userName);

    /**
     * Get the userstore from the name with userstore.
     *
     * @param nameWithUserstore - name with userstore
     * @returns - userstore
     */
    public static getUserStore = (nameWithUserstore: string): string =>
        nameWithUserstore?.split("/").length > 1
            ? nameWithUserstore?.split("/")[0]
            : I18n.instance.t("users:userstores.userstoreOptions.primary")

    /**
     * Get name to display of the user.
     *
     * @param user - user
     * @returns - name to display of the user
     */
    public static getNameToDisplayOfUser = (user: UserBasicInterface): string => {

        const resolvedGivenName: string = user.name?.givenName;
        const resolvedFamilyName: string = user.name?.familyName;
        const resolvedEmail: string = user.emails?.[0]?.toString();

        if (resolvedGivenName && resolvedFamilyName) {
            return `${ resolvedGivenName } ${ resolvedFamilyName }`;
        } else if (resolvedGivenName) {
            return resolvedGivenName;
        } else if (resolvedFamilyName) {
            return resolvedFamilyName;
        } else if(resolvedEmail) {
            return resolvedEmail;
        } else {
            return this.getUserUsername(user);
        }
    };

    /**
     * Get the user managed by.
     *
     * @param user - user
     * @returns - user managed by
     */
    public static getUserManagedBy = (user: UserBasicInterface): string => {
        const userIdp: string = user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType;

        if (!userIdp) {
            return null;
        }

        if (userIdp.split("/").length > 1) {
            return userIdp.split("/")[1];
        } else {
            return userIdp;
        }
    };

    /**
     * Groups the role groups by the identity provider ID.
     *
     * @param roleGroups - List of role groups.
     * @returns A map of role groups grouped by the identity provider ID.
     */
    public static getRoleGroupsGroupedByIdp = (
        roleGroups: RoleGroupsInterface[]
    ): Map<string, RoleGroupsInterface[]> => {
        const categorizedGroups: Map<string, RoleGroupsInterface[]> = new Map<string, RoleGroupsInterface[]>();

        if (roleGroups?.length > 0) {
            roleGroups.forEach((group: RoleGroupsInterface) => {
                const ref: string = group.$ref;
                let idpId: string;

                // Extract the identity provider ID from the $ref attribute.
                const match: RegExpMatchArray = ref.match(/identity-providers\/([^/]+)/);

                if (match) {
                    idpId = match[1];
                } else {
                    idpId = "LOCAL"; // A default category for groups not belonging to an identity provider.
                }

                if (!categorizedGroups[idpId]) {
                    categorizedGroups[idpId] = [];
                }

                categorizedGroups[idpId].push(group);
            });
        }

        return categorizedGroups;
    };
}
