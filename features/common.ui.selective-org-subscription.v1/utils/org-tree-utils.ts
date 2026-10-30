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

import { OrganizationInterface } from "@wso2is/admin.organizations.v1/models/organizations";
import { OrgTreeViewItemInterface } from "../models/selective-org-subscription";

/**
 * Resolve the IDs of every organization whose immediate parent is the given organization.
 *
 * @param parentId - The parent organization ID.
 * @param flatOrganizationMap - Every organization discovered so far, keyed by ID.
 * @returns IDs of the immediate children.
 */
export const getChildrenOfOrganization = (
    parentId: string,
    flatOrganizationMap: Record<string, OrganizationInterface>
): string[] => {
    const children: string[] = [];

    Object.keys(flatOrganizationMap).forEach((orgId: string) => {
        if (flatOrganizationMap[orgId]?.parentId === parentId) {
            children.push(orgId);
        }
    });

    return children;
};

/**
 * Drop any node whose ID has already appeared elsewhere in the tree. A guard, not a correctness
 * mechanism: the tree view throws outright on duplicate IDs.
 *
 * @param nodes - The tree to clean.
 * @param seen - IDs already encountered, used across the recursion.
 * @returns The tree with duplicates removed.
 */
export const dedupeTree = (
    nodes: OrgTreeViewItemInterface[],
    seen: Set<string> = new Set<string>()
): OrgTreeViewItemInterface[] => {
    const result: OrgTreeViewItemInterface[] = [];

    nodes.forEach((node: OrgTreeViewItemInterface) => {
        if (seen.has(node.id)) {
            return;
        }

        seen.add(node.id);

        result.push(node.children?.length > 0
            ? { ...node, children: dedupeTree(node.children, seen) }
            : node);
    });

    return result;
};

/**
 * Replace the children of a node in the tree, recursing until the parent is found.
 *
 * @param nodes - The current tree.
 * @param parentId - ID of the node whose children should be replaced.
 * @param newChildren - The subtree to splice in.
 * @returns A new tree with the children replaced.
 */
export const updateTreeWithChildren = (
    nodes: OrgTreeViewItemInterface[],
    parentId: string,
    newChildren: OrgTreeViewItemInterface[]
): OrgTreeViewItemInterface[] => {
    return nodes.map((node: OrgTreeViewItemInterface) => {
        if (node.id === parentId) {
            return {
                ...node,
                children: newChildren
            };
        }

        if (node.children?.length > 0) {
            return {
                ...node,
                children: updateTreeWithChildren(node.children, parentId, newChildren)
            };
        }

        return node;
    });
};
