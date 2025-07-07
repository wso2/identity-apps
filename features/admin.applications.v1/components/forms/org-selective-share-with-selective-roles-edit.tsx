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

import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import Grid from "@oxygen-ui/react/Grid";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Typography from "@oxygen-ui/react/Typography";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationRoleInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ChangeEvent,
    Dispatch as ReactDispatch,
    ReactNode,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import "./roles-selective-share.scss";
import useGetApplicationShare from "../../api/use-get-application-share";
import { ApplicationInterface } from "../../models/application";
import InfiniteScroll from "react-infinite-scroll-component";
import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Button from "@oxygen-ui/react/Button";
import { AnimatePresence, motion } from "framer-motion";
import OrgRolePane from "./org-role-pane";
import Box from "@oxygen-ui/react/Box";
import { AnimatedAvatar } from "@wso2is/react-components";
import Checkbox from "@mui/material/Checkbox";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import useGetApplicationRolesByAudience from "@wso2is/admin.roles.v2/api/use-get-application-roles-by-audience";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";

interface OrgSelectiveShareWithAllRolesProps extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    addedOrgs: string[];
    removedOrgs: string[];
    selectedItems: string[];
    setAddedOrgs: ReactDispatch<SetStateAction<string[]>>;
    setRemovedOrgs: ReactDispatch<SetStateAction<string[]>>;
    setSelectedItems: ReactDispatch<SetStateAction<string[]>>;
    addedRoles: Record<string, SelectedOrganizationRoleInterface[]>;
    removedRoles: Record<string, SelectedOrganizationRoleInterface[]>;
    setAddedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    setRemovedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
}

interface TreeViewBaseItemWithRoles extends TreeViewBaseItem {
    roles?: RolesInterface[];
    parentId?: string;
}

const OrgSelectiveShareWithSelectiveRolesEdit = (props: OrgSelectiveShareWithAllRolesProps) => {
    const {
        [ "data-componentid" ]: componentId = "org-selective-share-with-selective-roles-edit",
        application,
        addedOrgs,
        removedOrgs,
        setAddedOrgs,
        setRemovedOrgs,
        setAddedRoles,
        setRemovedRoles,
        selectedItems,
        setSelectedItems
    } = props;

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { isOrganizationManagementEnabled } = useGlobalVariables();

    // This will store the organization tree of the current organization.
    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    const [ applicationOrganizationTree, setApplicationOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    // This will store the flat map of organizations to easily access them by ID.
    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ nextPageLink, setNextPageLink ] = useState<string>();
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ expandedOrgId, setExpandedOrgId ] = useState<string>();
    const [ resolvedOrgs, setResolvedOrgs ] = useState<string[]>([]);
    const [ roleSelections, setRoleSelections ] = useState<Record<string, SelectedOrganizationRoleInterface[]>>({});
    const [ readOnly, setReadOnly ] = useState<boolean>(true);
    const [ expandedItems, setExpandedItems ] = React.useState<string[]>([]);
    const [ selectedOrgId, setSelectedOrgId ] = useState<string>(organizationId);

    const applicationAudience: string = application?.associatedRoles?.allowedAudience ?? RoleAudienceTypes.ORGANIZATION;

    // Fetch the complete list of shared organizations.
    const {
        data: totalSharedApplicationOrganizations,
        error:  totalSharedApplicationOrganizationsFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        readOnly,
        true,
        null
    );

    // We are fetching the application organization tree in the read-only mode.
    // Used in 1st level with pagination
    const {
        data: originalTopLevelApplicationOrganizations,
        isLoading: isTopLevelApplicationOrganizationsFetchRequestLoading,
        error:  originalTopLevelApplicationOrganizationsFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        readOnly,
        false,
        null,
        null,
        15,
        null,
        !isEmpty(afterCursor) ? afterCursor : null
    );

    const {
        data: originalApplicationOrganizations,
        isLoading: isApplicationOrganizationsFetchRequestLoading,
        error:  originalApplicationOrganizationsFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        readOnly,
        false,
        `parentId eq '${ expandedOrgId }'`
    );

    // In the edit mode, we will fetch the organization whole organization tree.
    // This will be used to select the organizations to share the application with.
    const {
        data: originalTopLevelOrganizations,
        isLoading: isTopLevelOrganizationsFetchRequestLoading,
        error: topLevelOrganizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled && !readOnly,
        null,
        15,
        !isEmpty(afterCursor) ? afterCursor : null,
        null,
        false,
        false
    );

    // Used for subsquent requests to fetch the children of the selected organization.
    const {
        data: originalOrganizations,
        error: organizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled && !readOnly,
        `parentId eq '${ expandedOrgId }'`,
        null,
        null,
        null,
        false,
        false
    );

    const {
        data: originalApplicationRoles,
        isLoading: isApplicationRolesFetchRequestLoading,
        error: applicationRolesFetchRequestError
    } = useGetApplicationRolesByAudience(
        applicationAudience,
        application?.id,
        null,
        null,
        null,
        null,
        "users,groups,permissions,associatedApplications"
    );

    const applicationRolesList: RolesV2Interface[] = useMemo(() => {
        if (originalApplicationRoles?.Resources?.length > 0) {
            return originalApplicationRoles.Resources;
        }
    }, [ originalApplicationRoles ]);

    const isLoading: boolean = useMemo(() => {
        return isTopLevelApplicationOrganizationsFetchRequestLoading || isTopLevelOrganizationsFetchRequestLoading;
    }, [
        isTopLevelApplicationOrganizationsFetchRequestLoading,
        isTopLevelOrganizationsFetchRequestLoading
    ]);

    useEffect(() => {
        if (totalSharedApplicationOrganizations?.organizations?.length > 0) {
            const applicationOrgIds: string[] = totalSharedApplicationOrganizations?.organizations
                .map((org: OrganizationInterface) => org.id);

            setSelectedItems(applicationOrgIds);
        }

    }, [ totalSharedApplicationOrganizations ]);

    // Get the shared organizations of the application
    useEffect(() => {
        if (originalTopLevelApplicationOrganizations?.organizations?.length > 0) {
            const applicationOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTree(originalTopLevelApplicationOrganizations.organizations, false);

            setApplicationOrganizationTree((prev: TreeViewBaseItemWithRoles[]) => {
                // If the application organization tree is empty, set the application orgs as the initial tree
                if (prev.length === 0) {
                    return applicationOrgTree;
                }

                // If the application organization tree already has items, merge the
                // application orgs with the existing tree.
                const existingOrgIds: string[] = prev.map((item: TreeViewBaseItemWithRoles) => item.id);
                const newOrgs: TreeViewBaseItemWithRoles[] = applicationOrgTree.filter(
                    (item: TreeViewBaseItemWithRoles) => !existingOrgIds.includes(item.id)
                );

                // If there are no new organizations, return the existing tree.
                if (newOrgs.length === 0) {
                    return prev;
                }

                // Otherwise, return the merged tree.
                return [
                    ...prev,
                    ...newOrgs
                ];
            });

            setSelectedOrgId(applicationOrgTree[0].id);
        }
    }, [ originalTopLevelApplicationOrganizations ]);

    useEffect(() => {
        if (originalTopLevelOrganizations?.organizations?.length > 0) {
            const topLevelOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTree(originalTopLevelOrganizations.organizations);

            setOrganizationTree((prev: TreeViewBaseItemWithRoles[]) => {
                // If the organization tree is empty, set the top-level organizations as the initial tree.
                if (prev.length === 0) {
                    return topLevelOrgTree;
                }

                // If the organization tree already has items, merge the top-level organizations with the existing tree.
                const existingOrgIds: string[] = prev.map((item: TreeViewBaseItemWithRoles) => item.id);
                const newOrgs: TreeViewBaseItemWithRoles[] = topLevelOrgTree.filter(
                    (item: TreeViewBaseItemWithRoles) => !existingOrgIds.includes(item.id)
                );

                // If there are no new organizations, return the existing tree.
                if (newOrgs.length === 0) {
                    return prev;
                }

                // Otherwise, return the merged tree.
                return [
                    ...prev,
                    ...newOrgs
                ];
            });

            // Initialize the flat organization map with the top-level organizations
            const initialFlatMap: Record<string, OrganizationInterface> = {
                ...flatOrganizationMap
            };

            originalTopLevelOrganizations.organizations.forEach((org: OrganizationInterface) => {
                initialFlatMap[org.id] = org;
            });

            setFlatOrganizationMap(initialFlatMap);
            setSelectedOrgId(topLevelOrgTree[0].id);
        }

        // If there are links in the top-level organization tree, set the next page link.
        // This is used for pagination.
        if (originalTopLevelOrganizations?.links?.length > 0) {
            const nextLink: OrganizationLinkInterface | undefined = originalTopLevelOrganizations
                .links.find((link: OrganizationLinkInterface) => link.rel === "next");

            if (nextLink) {
                setNextPageLink(nextLink.href);
                setIsNextPageAvailable(true);
            } else {
                setIsNextPageAvailable(false);
            }
        } else {
            setIsNextPageAvailable(false);
        }
    }, [ originalTopLevelOrganizations ]);

    // This will update the organization tree with the children of the selected organization.
    useEffect(() => {
        if (originalOrganizations) {
            setResolvedOrgs((prev: string[]) => [ ...prev, expandedOrgId ]);
        }

        if (originalOrganizations?.organizations?.length > 0) {
            const childOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTree(originalOrganizations?.organizations);

            const updatedTree: TreeViewBaseItemWithRoles[] =
                updateTreeWithChildren(organizationTree, expandedOrgId, childOrgTree);

            setOrganizationTree(updatedTree);
        }
    }, [ originalOrganizations ]);

    // This will update the application organization tree with the children of the selected organization.
    useEffect(() => {
        if (originalApplicationOrganizations) {
            setResolvedOrgs((prev: string[]) => [ ...prev, expandedOrgId ]);
        }

        if (originalApplicationOrganizations?.organizations?.length > 0) {
            const childOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTree(originalApplicationOrganizations?.organizations, false);

            const updatedTree: TreeViewBaseItemWithRoles[] =
                updateTreeWithChildren(applicationOrganizationTree, expandedOrgId, childOrgTree);

            setApplicationOrganizationTree(updatedTree);

            // Compute role selections for the newly added children
            const childRoleMap: Record<string, SelectedOrganizationRoleInterface[]> = computeChildRoleSelections(
                selectedOrgId,
                originalApplicationOrganizations.organizations
            );

            setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                ...prev,
                ...childRoleMap
            }));
        }
    }, [ originalApplicationOrganizations ]);

    useEffect(() => {
        if (
            originalTopLevelApplicationOrganizations?.organizations?.length > 0 &&
            applicationRolesList?.length > 0
        ) {
            const computedRoleSelections: Record<string, SelectedOrganizationRoleInterface[]> =
                computeInitialRoleSelections(
                    originalTopLevelApplicationOrganizations.organizations,
                    applicationRolesList
                );

            // Initialize the role selections with the top-level organization roles
            setRoleSelections(computedRoleSelections);
        }
    }, [ originalTopLevelApplicationOrganizations, applicationRolesList ]);

    useEffect(() => {
        if (originalTopLevelApplicationOrganizationsFetchRequestError ||
            totalSharedApplicationOrganizationsFetchRequestError ||
            originalApplicationOrganizationsFetchRequestError
        ) {
            dispatch(
                addAlert({
                    description: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchApplicationOrgTree.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchApplicationOrgTree.genericError.message")
                })
            );
        }
    }, [
        originalTopLevelApplicationOrganizationsFetchRequestError,
        totalSharedApplicationOrganizationsFetchRequestError,
        originalApplicationOrganizationsFetchRequestError
    ]);

    useEffect(() => {
        if (topLevelOrganizationsFetchRequestError || organizationsFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchOrgTree.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchOrgTree.genericError.message")
                })
            );
        }
    }, [ topLevelOrganizationsFetchRequestError, organizationsFetchRequestError ]);

    const buildChildTree = (
        data: OrganizationInterface[],
        buildOrgTree: boolean = true
    ): TreeViewBaseItemWithRoles[] => {
        const nodeMap: Record<string, TreeViewBaseItemWithRoles> = {};

        const tempFlatOrganizationMap: Record<string, OrganizationInterface> = {
            ...flatOrganizationMap
        };

        // Add all nodes from the top-level organization to nodeMap
        data.forEach((item: OrganizationInterface) => {
            if (buildOrgTree && item.status !== "ACTIVE") {
                return;
            }

            nodeMap[item.id] = {
                children: item.hasChildren || item.name === "XYZ Builders" ? [
                    {
                        children: [],
                        id: `${item.name}-temp-child`,
                        label: "Loading..."
                    }
                ] : [],
                id: item.id,
                label: item.name,
                parentId: item.parentId ?? expandedOrgId
            };

            // Add the organization to the flat map
            if (!tempFlatOrganizationMap[item.id]) {
                tempFlatOrganizationMap[item.id] = {
                    hasChildren: item.hasChildren,
                    id: item.id,
                    name: item.name,
                    parentId: item.parentId,
                    ref: item.ref,
                    status: item.status
                };
            }
        });

        setFlatOrganizationMap(tempFlatOrganizationMap);

        return data.map((item: OrganizationInterface) => nodeMap[item.id]);
    };

    // This function updates the tree with new children for a given parent ID.
    // It recursively traverses the tree and updates the children of the specified parent.
    const updateTreeWithChildren = (
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

    const getChildrenOfOrganization = (parentId: string): string[] => {
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

    const selectParentNodes = (selectedItemId: string): void => {
        // If selectedItemId is equal to the organizationId, that means we are at the root level
        // and we don't need to select any parent nodes.
        if (selectedItemId === organizationId) {
            return;
        }

        // Get the seleted node and its parent node
        const selectedOrg: OrganizationInterface | undefined = flatOrganizationMap[selectedItemId];

        if (!selectedOrg) {
            return;
        }

        const parentNode: OrganizationInterface | undefined = flatOrganizationMap[selectedOrg.parentId];

        if (!parentNode) {
            return;
        }

        // If the parent node is not selected, select it
        if (!selectedItems.includes(parentNode.id)) {
            setSelectedItems((prev: string[]) => [ ...prev, parentNode.id ]);
            selectParentNodes(parentNode.id);

            // add the selected organization to the addedOrgs list
            setAddedOrgs((addedOrgs: string[]) => [ ...addedOrgs, parentNode.id ]);
        }
    };

    const deselectChildrenNodes = (selectedItemId: string): void => {
        // Get the seleted node and its children nodes
        const selectedOrg: OrganizationInterface | undefined = flatOrganizationMap[selectedItemId];

        // If the selected organization does not have children, we don't need to deselect anything.
        if (!selectedOrg || !selectedOrg.hasChildren) {
            return;
        }

        const children: string[] = getChildrenOfOrganization(selectedItemId);

        // Deselect all children nodes
        setSelectedItems((prev: string[]) => prev.filter((item: string) => !children.includes(item)));

        // add the deselected organization to the removedOrgs list
        setRemovedOrgs((prev: string[]) => [ ...prev, selectedItemId ]);

        // Recursively deselect children nodes
        children.forEach((childId: string) => {
            deselectChildrenNodes(childId);
        });
    };

    const resolveSelectedItems = (selectedItem: string, isSelected: boolean) => {
        if (isSelected) {
            setSelectedItems((prev: string[]) => [ ...prev, selectedItem ]);
            setAddedOrgs((addedOrgs: string[]) => [ ...addedOrgs, selectedItem ]);
            // remove the organization from the removedOrgs list if it exists
            setRemovedOrgs((prev: string[]) => prev.filter((item: string) => item !== selectedItem));
            // Select the parent nodes of the selected item
            selectParentNodes(selectedItem);
        }
        else {
            setSelectedItems((prev: string[]) => prev.filter((item: string) => item !== selectedItem));
            setRemovedOrgs((removedOrgs: string[]) => [ ...removedOrgs, selectedItem ]);
            // remove the organization from the addedOrgs list if it exists
            setAddedOrgs((prev: string[]) => prev.filter((item: string) => item !== selectedItem));
            // Deselect all children nodes of the selected item
            deselectChildrenNodes(selectedItem);
        }
    };

    const loadMoreOrganizations = (): void => {
        const cursorFragments: string[] = nextPageLink?.split("after=");

        if (cursorFragments.length < 2) {
            setIsNextPageAvailable(false);

            return;
        }

        setAfterCursor(cursorFragments[1]);
    };

    const cascadeRoleRemovalToChildren = (parentId: string, removedRole: SelectedOrganizationRoleInterface) => {
        const children: string[] = getChildrenOfOrganization(parentId);

        children.forEach((childId: string) => {
            const childRoles: SelectedOrganizationRoleInterface[] = roleSelections[childId];

            if (childRoles) {
                const updatedRoles: SelectedOrganizationRoleInterface[] = childRoles.filter(
                    (role: SelectedOrganizationRoleInterface) => role.displayName !== removedRole.displayName);

                setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                    ...prev,
                    [childId]: updatedRoles
                }));

                // Recursive cleanup down the tree
                cascadeRoleRemovalToChildren(childId, removedRole);
            }
        });
    };

    const cascadeRoleAdditionToChildren = (parentId: string, addedRole: SelectedOrganizationRoleInterface) => {
        const children: string[] = getChildrenOfOrganization(parentId);

        children.forEach((childId: string) => {
            const existingRoles: SelectedOrganizationRoleInterface[] = roleSelections[childId] || [];

            const alreadyHasRole: boolean = existingRoles.some(
                (role: SelectedOrganizationRoleInterface) => role.displayName === addedRole.displayName
            );

            if (!alreadyHasRole) {
                const updatedRoles: SelectedOrganizationRoleInterface[] = [
                    ...existingRoles,
                    {
                        ...addedRole,
                        selected: false
                    }
                ];

                setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                    ...prev,
                    [childId]: updatedRoles
                }));
            }
        });
    };

    const resolveRoleAddition = (orgId: string, addedRole: SelectedOrganizationRoleInterface) => {
        // Add to the addedRoles map
        setAddedRoles((prev: Record<string, SelectedOrganizationRoleInterface[]>) => {
            const updatedRoles: SelectedOrganizationRoleInterface[] = prev[orgId] || [];
            const alreadyExists: boolean = updatedRoles.some(
                (role: SelectedOrganizationRoleInterface) => role.displayName === addedRole.displayName
            );

            if (!alreadyExists) {
                return {
                    ...prev,
                    [orgId]: [ ...updatedRoles, addedRole ]
                };
            }

            return prev;
        });

        // Remove the roles from removedRoles map if it exists
        setRemovedRoles((prev: Record<string, SelectedOrganizationRoleInterface[]>) => {
            const updatedRoles: SelectedOrganizationRoleInterface[] = prev[orgId] || [];
            const filteredRoles: SelectedOrganizationRoleInterface[] = updatedRoles.filter(
                (role: SelectedOrganizationRoleInterface) => role.displayName !== addedRole.displayName
            );

            return {
                ...prev,
                [orgId]: filteredRoles
            };
        });
    };

    const resolveRoleRemoval = (orgId: string, removedRole: SelectedOrganizationRoleInterface) => {
        // Add to the removedRoles map
        setRemovedRoles((prev: Record<string, SelectedOrganizationRoleInterface[]>) => {
            const updatedRoles: SelectedOrganizationRoleInterface[] = prev[orgId] || [];
            const alreadyExists: boolean = updatedRoles.some(
                (role: SelectedOrganizationRoleInterface) => role.displayName === removedRole.displayName
            );

            if (!alreadyExists) {
                return {
                    ...prev,
                    [orgId]: [ ...updatedRoles, removedRole ]
                };
            }

            return prev;
        });

        // Remove the roles from addedRoles map if it exists
        setAddedRoles((prev: Record<string, SelectedOrganizationRoleInterface[]>) => {
            const updatedRoles: SelectedOrganizationRoleInterface[] = prev[orgId] || [];
            const filteredRoles: SelectedOrganizationRoleInterface[] = updatedRoles.filter(
                (role: SelectedOrganizationRoleInterface) => role.displayName !== removedRole.displayName
            );

            return {
                ...prev,
                [orgId]: filteredRoles
            };
        });
    };

    const computeInitialRoleSelections = (
        orgs: OrganizationInterface[],
        rootRoles: OrganizationRoleInterface[]
    ): Record<string, SelectedOrganizationRoleInterface[]> => {
        const roleMap: Record<string, SelectedOrganizationRoleInterface[]> = {};

        orgs.forEach((org: OrganizationInterface) => {
            const roles: SelectedOrganizationRoleInterface[] = rootRoles.map(
                (role: OrganizationRoleInterface) => ({
                    ...role,
                    selected: org.roles?.some(
                        (orgRole: OrganizationRoleInterface) => orgRole.displayName === role.displayName
                    ) || false
                })
            );

            roleMap[org.id] = roles;
        });

        return roleMap;
    };

    const computeChildRoleSelections = (
        parentId: string,
        children: OrganizationInterface[]
    ): Record<string, SelectedOrganizationRoleInterface[]> => {
        const parentRoles: SelectedOrganizationRoleInterface[] = roleSelections[parentId];

        if (!parentRoles) return {};

        const selectedParentRoles: SelectedOrganizationRoleInterface[] =
            parentRoles.filter((role: SelectedOrganizationRoleInterface) => role.selected);

        const updated: Record<string, SelectedOrganizationRoleInterface[]> = {};

        children.forEach((childOrg: OrganizationInterface) => {
            updated[childOrg.id] = selectedParentRoles.map((role: SelectedOrganizationRoleInterface) => ({
                ...role,
                selected: childOrg.roles?.some(
                    (orgRole: OrganizationRoleInterface) => orgRole.displayName === role.displayName
                ) || false
            }));
        });

        return updated;
    };

    const resolveLeftPaneTreeView = (): ReactNode => {
        // In the read-only mode, we only need to show the organizations which app is shared to.
        if (readOnly) {
            return (
                <InfiniteScroll
                    dataLength={ applicationOrganizationTree.length }
                    next={ loadMoreOrganizations }
                    hasMore={ isNextPageAvailable }
                    loader={ (<LinearProgress/>) }
                    scrollableTarget="scrollableOrgContainer"
                >

                    <RichTreeView
                        data-componentid={ `${ componentId }-tree-view` }
                        className="roles-selective-share-tree-view"
                        items={ applicationOrganizationTree }
                        expansionTrigger="iconContainer"
                        onItemExpansionToggle={ (_e: SyntheticEvent, itemId: string, expanded: boolean) => {
                            if (expanded) {
                                setExpandedOrgId(itemId);
                            }
                        } }
                        onItemClick={ (_e: SyntheticEvent, itemId: string) => {
                            setSelectedOrgId(itemId);
                        } }
                        checkboxSelection={ false }
                        expandedItems={ expandedItems }
                        onExpandedItemsChange={ (_event: SyntheticEvent, items: string[]) => setExpandedItems(items) }
                    />
                </InfiniteScroll>
            );
        }

        return (
            <InfiniteScroll
                dataLength={ organizationTree.length }
                next={ loadMoreOrganizations }
                hasMore={ isNextPageAvailable }
                loader={ (<LinearProgress/>) }
                scrollableTarget="scrollableOrgContainer"
            >

                <RichTreeView
                    data-componentid={ `${ componentId }-tree-view` }
                    className="roles-selective-share-tree-view"
                    items={ readOnly ? [] : organizationTree }
                    expansionTrigger="iconContainer"
                    selectedItems={ selectedItems }
                    onItemSelectionToggle={ (
                        _e: SyntheticEvent,
                        itemId: string,
                        isSelected: boolean
                    ) =>
                        resolveSelectedItems(itemId, isSelected) }
                    onItemExpansionToggle={ (_e: SyntheticEvent, itemId: string, expanded: boolean) => {
                        if (expanded) {
                            setExpandedOrgId(itemId);
                        }
                    } }
                    onItemClick={ (_e: SyntheticEvent, itemId: string) => {
                        setSelectedOrgId(itemId);
                    } }
                    selectionPropagation={ {
                        descendants: false,
                        parents: false
                    } }
                    multiSelect={ true }
                    checkboxSelection={ true }
                    expandedItems={ expandedItems }
                    onExpandedItemsChange={ (_event: SyntheticEvent, items: string[]) => setExpandedItems(items) }
                />
            </InfiniteScroll>
        );
    };

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key="selected-orgs-block"
                    initial={ { height: 0, opacity: 0 } }
                    animate={ { height: "auto", opacity: 1 } }
                    exit={ { height: 0, opacity: 0 } }
                    transition={ { duration: 0.3 } }
                >
                    <Button
                        variant="text"
                        size="small"
                        onClick={ () => {
                            setExpandedItems([]);
                            setExpandedOrgId(undefined);
                            setResolvedOrgs([]);
                            setReadOnly(!readOnly);
                        } }
                    >
                        { readOnly
                            ? "Manage Role Sharing"
                            : "View Shared Roles"
                        }
                    </Button>
                </motion.div>
            </AnimatePresence>
            <Grid
                container
                xs={ 12 }
                className="roles-selective-share-container"
            >
                {
                    isLoading ? (
                        <Grid
                            container
                            xs={ 12 }
                            padding={ 1 }
                            className="roles-selective-share-left-panel"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <CircularProgress size={ 30 } />
                        </Grid>
                    ) : (
                        <>
                            <Grid
                                xs={ 12 }
                                md={ 4 }
                                padding={ 1 }
                                className="roles-selective-share-left-panel"
                                id="scrollableOrgContainer"
                            >
                                { resolveLeftPaneTreeView() }
                            </Grid>
                            <AnimatePresence mode="wait">
                                <Grid
                                    xs={ 12 }
                                    md={ 8 }
                                    paddingX={ 2 }
                                    paddingY={ 1 }
                                    className="roles-selective-share-right-panel"
                                >
                                    <Box
                                        className="role-list-container"
                                    >
                                        { !isEmpty(roleSelections[selectedOrgId]) &&
                                            roleSelections[selectedOrgId]
                                                .filter((role: SelectedOrganizationRoleInterface) =>
                                                    readOnly ? role.selected : true)
                                                .map((role: SelectedOrganizationRoleInterface, index: number) => (
                                                    <Box
                                                        key={ `role-${index}` }
                                                        className="role-item"
                                                        data-componentid={ `${componentId}-role-${index}` }
                                                    >
                                                        { readOnly
                                                            ? (
                                                                <AnimatedAvatar
                                                                    name={ role.displayName }
                                                                    size="mini"
                                                                    data-componentid={ `${ componentId }-item-avatar` }
                                                                />
                                                            )
                                                            : (
                                                                <Checkbox
                                                                    className="role-checkbox"
                                                                    checked={ role.selected }
                                                                    onChange={ (
                                                                        _e: ChangeEvent<HTMLInputElement>,
                                                                        checked: boolean
                                                                    ) => {
                                                                        const updatedRoles:
                                                                        SelectedOrganizationRoleInterface[] =
                                                                        roleSelections[selectedOrgId].map(
                                                                            (r: SelectedOrganizationRoleInterface) =>
                                                                                r.displayName === role.displayName
                                                                                    ? { ...r, selected: !r.selected }
                                                                                    : r
                                                                        );

                                                                        setRoleSelections((prev:
                                                                            Record<string,
                                                                            SelectedOrganizationRoleInterface[]>) => ({
                                                                            ...prev,
                                                                            [selectedOrgId]: updatedRoles
                                                                        }));

                                                                        if (checked) {
                                                                            cascadeRoleAdditionToChildren(
                                                                                selectedOrgId, role);
                                                                            resolveRoleAddition(selectedOrgId, role);
                                                                        } else {
                                                                            cascadeRoleRemovalToChildren(
                                                                                selectedOrgId, role);
                                                                            resolveRoleRemoval(selectedOrgId, role);
                                                                        }
                                                                    } }
                                                                />
                                                            ) }
                                                        <Typography
                                                            variant="body1"
                                                            className="role-label"
                                                        >
                                                            { role.displayName }
                                                        </Typography>
                                                    </Box>
                                                ))
                                        }
                                    </Box>

                                </Grid>
                            </AnimatePresence>
                        </>
                    )
                }
            </Grid>
        </>
    );
};

export default OrgSelectiveShareWithSelectiveRolesEdit;
