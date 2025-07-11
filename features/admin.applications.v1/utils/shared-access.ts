/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import {
    OrganizationInterface,
    OrganizationRoleInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { TreeViewBaseItemWithRoles } from "../models/shared-access";

export const computeInitialRoleSelections = (
    orgs: OrganizationInterface[],
    rootRoles: OrganizationRoleInterface[]
): Record<string, SelectedOrganizationRoleInterface[]> => {
    const roleMap: Record<string, SelectedOrganizationRoleInterface[]> = {};

    orgs.forEach((org: OrganizationInterface) => {
        const roles: SelectedOrganizationRoleInterface[] = rootRoles.map(
            (role: OrganizationRoleInterface) => ({
                audience: {
                    display: role.audience?.display,
                    type: role.audience?.type
                },
                displayName: role.displayName,
                id: role.displayName,
                selected: org.roles?.some(
                    (orgRole: OrganizationRoleInterface) => orgRole.displayName === role.displayName
                ) || false
            })
        );

        roleMap[org.id] = roles;
    });

    return roleMap;
};

export const computeChildRoleSelections = (
    parentId: string,
    children: OrganizationInterface[],
    roleSelections: Record<string, SelectedOrganizationRoleInterface[]>
): Record<string, SelectedOrganizationRoleInterface[]> => {
    const parentRoles: SelectedOrganizationRoleInterface[] = roleSelections[parentId];

    if (!parentRoles) return {};

    const selectedParentRoles: SelectedOrganizationRoleInterface[] =
        parentRoles.filter((role: SelectedOrganizationRoleInterface) => role.selected);

    const updated: Record<string, SelectedOrganizationRoleInterface[]> = {};

    children.forEach((childOrg: OrganizationInterface) => {
        updated[childOrg.id] = selectedParentRoles.map((role: SelectedOrganizationRoleInterface) => ({
            audience: {
                display: role.audience.display,
                type: role.audience.type
            },
            displayName: role.displayName,
            id: role.displayName,
            selected: childOrg.roles?.some(
                (orgRole: OrganizationRoleInterface) => orgRole.displayName === role.displayName
            ) || false
        }));
    });

    return updated;
};

export const getChildrenOfOrganization = (
    parentId: string,
    flatOrganizationMap: Record<string, OrganizationInterface>
): string[] => {
    const result: string[] = [];

    // Iterate the flatOrganizationMap to find orgs that have the given parentId
    Object.keys(flatOrganizationMap).forEach((orgId: string) => {
        const org: OrganizationInterface = flatOrganizationMap[orgId];

        if (org.parentId === parentId) {
            result.push(orgId);
        }
    });

    return result;
};

// This function updates the tree with new children for a given parent ID.
// It recursively traverses the tree and updates the children of the specified parent.
export const updateTreeWithChildren = (
    nodes: TreeViewBaseItemWithRoles[],
    parentId: string,
    newChildren: TreeViewBaseItemWithRoles[]
): TreeViewBaseItemWithRoles[] => {
    return nodes.map((node: TreeViewBaseItemWithRoles) => {
        if (node.id === parentId) {
            return {
                ...node,
                children: newChildren
            };
        }

        if (node.children && node.children.length > 0) {
            return {
                ...node,
                children: updateTreeWithChildren(node.children, parentId, newChildren)
            };
        }

        return node;
    });
};
