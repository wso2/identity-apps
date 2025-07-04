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
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationRoleInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import useGetApplicationRolesByAudience from "@wso2is/admin.roles.v2/api/use-get-application-roles-by-audience";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import { AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatedAvatar } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ChangeEvent,
    Dispatch as ReactDispatch,
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
import { RoleShareType } from "../../constants/application-roles";
import { AnimatePresence, motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";

interface RolesSelectiveShareProps extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    addedRoles: Record<string, SelectedOrganizationRoleInterface[]>;
    removedRoles: Record<string, SelectedOrganizationRoleInterface[]>;
    setAddedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    setRemovedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    roleShareType: RoleShareType;
    selectedItems: string[];
    setSelectedItems: ReactDispatch<SetStateAction<string[]>>;
}

interface TreeViewBaseItemWithRoles extends TreeViewBaseItem {
    roles?: RolesInterface[];
    parentId?: string;
}

const RolesSelectiveShare = (props: RolesSelectiveShareProps) => {
    const {
        [ "data-componentid" ]: componentId = "roles-selective-share-modal",
        application,
        addedRoles,
        removedRoles,
        setAddedRoles,
        setRemovedRoles,
        selectedItems,
        setSelectedItems,
        roleShareType
    } = props;

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { isOrganizationManagementEnabled } = useGlobalVariables();

    const [ selectedOrgId, setSelectedOrgId ] = useState<string>();
    const [ readOnly, setReadOnly ] = useState<boolean>(true);
    const [ resolvedOrgs, setResolvedOrgs ] = useState<string[]>([]);
    // This will store the shared organization tree of the application with the roles.
    const [ applicationOrganizationTree, setApplicationOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    // This will store the organization tree of the current organization.
    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    // This will store the flat map of organizations to easily access them by ID.
    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});
    const [ roleSelections, setRoleSelections ] = useState<Record<string, SelectedOrganizationRoleInterface[]>>({});
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ nextPageLink, setNextPageLink ] = useState<string>();

    const applicationAudience: string = application?.associatedRoles?.allowedAudience ?? RoleAudienceTypes.ORGANIZATION;

    const isShareSelected: boolean = roleShareType === RoleShareType.SHARE_SELECTED;

    const {
        data: originalTopLevelApplicationOrganizationTree,
        isLoading: isTopLevelApplicationOrganizationTreeFetchRequestLoading,
        error:  originalTopLevelApplicationOrganizationTreeFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        !isEmpty(application?.id) &&
        !isEmpty(organizationId),
        false,
        `parentId eq '${ organizationId }'`,
        null,
        100
    );

    const {
        data: originalApplicationOrganizationTree,
        isLoading: isApplicationOrganizationTreeFetchRequestLoading,
        error:  originalApplicationOrganizationTreeFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        !isEmpty(application?.id) &&
        !isEmpty(selectedOrgId) &&
        !resolvedOrgs.includes(selectedOrgId),
        false,
        `parentId eq '${ selectedOrgId }'`,
        null,
        100
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
        "users,groups,permissions,associatedApplications",
        isShareSelected
    );

    const {
        data: originalTopLevelOrganizations,
        isLoading: isTopLevelOrganizationsFetchRequestLoading,
        isValidating: isTopLevelOrganizationsFetchRequestValidating,
        error: topLevelOrganizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled,
        null,
        15,
        null,
        null,
        false,
        false
    );

    const applicationRolesList: RolesV2Interface[] = useMemo(() => {
        if (originalApplicationRoles?.Resources?.length > 0) {
            return originalApplicationRoles.Resources;
        }
    }, [ originalApplicationRoles ]);

    // This will populate the top-level organization tree.
    useEffect(() => {
        if (originalTopLevelApplicationOrganizationTree?.organizations?.length > 0) {
            const topLevelOrgTree: TreeViewBaseItem[] =
                buildChildTree(originalTopLevelApplicationOrganizationTree?.organizations);

            if (topLevelOrgTree.length > 0) {
                // Add organizations which are already not in the organization tree.
                const existingOrgIds: string[] = applicationOrganizationTree.map((item: TreeViewBaseItem) => item.id);

                const newOrgs: TreeViewBaseItem[] = topLevelOrgTree.filter(
                    (item: TreeViewBaseItem) => !existingOrgIds.includes(item.id)
                );

                const combinedOrgs: TreeViewBaseItem[] = [
                    ...applicationOrganizationTree,
                    ...newOrgs
                ];

                setApplicationOrganizationTree(combinedOrgs);
                setSelectedOrgId(topLevelOrgTree[0].id);
            }
        }

        // If there are links in the top-level organization tree, set the next page link.
        // This is used for pagination.
        if (originalTopLevelApplicationOrganizationTree?.links?.length > 0) {
            const nextLink: OrganizationLinkInterface | undefined = originalTopLevelApplicationOrganizationTree
                .links.find((link: OrganizationLinkInterface) => link.rel === "next");

            if (nextLink) {
                setNextPageLink(nextLink.href);
                setIsNextPageAvailable(true);
            }
        }
    }, [ originalTopLevelApplicationOrganizationTree ]);

    useEffect(() => {
        if (
            originalTopLevelApplicationOrganizationTree?.organizations?.length > 0 &&
            applicationRolesList?.length > 0
        ) {
            const computedRoleSelections: Record<string, SelectedOrganizationRoleInterface[]> =
                computeInitialRoleSelections(
                    originalTopLevelApplicationOrganizationTree.organizations,
                    applicationRolesList
                );

            // Initialize the role selections with the top-level organization roles
            setRoleSelections(computedRoleSelections);
        }
    }, [ originalTopLevelApplicationOrganizationTree, applicationRolesList ]);

    // This will update the organization tree with the children of the selected organization.
    useEffect(() => {
        if (originalApplicationOrganizationTree?.organizations?.length > 0) {
            const childOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTree(originalApplicationOrganizationTree?.organizations);

            const updatedTree: TreeViewBaseItemWithRoles[] =
                updateTreeWithChildren(applicationOrganizationTree, selectedOrgId, childOrgTree);

            setResolvedOrgs((prev: string[]) => [ ...prev, selectedOrgId ]);
            setApplicationOrganizationTree(updatedTree);

            // Compute role selections for the newly added children
            const childRoleMap: Record<string, SelectedOrganizationRoleInterface[]> = computeChildRoleSelections(
                selectedOrgId,
                originalApplicationOrganizationTree.organizations
            );

            setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                ...prev,
                ...childRoleMap
            }));
        }
    }, [ originalApplicationOrganizationTree ]);

    useEffect(() => {
        if (originalTopLevelOrganizations?.organizations?.length > 0) {
            const topLevelOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTree(originalTopLevelOrganizations.organizations);

            setOrganizationTree(topLevelOrgTree);

            // Initialize the flat organization map with the top-level organizations
            const initialFlatMap: Record<string, OrganizationInterface> = {};

            originalTopLevelOrganizations.organizations.forEach((org: OrganizationInterface) => {
                initialFlatMap[org.id] = org;
            });
            setFlatOrganizationMap(initialFlatMap);
        }
    }, [ originalTopLevelOrganizations ]);


    useEffect(() => {
        if (originalApplicationOrganizationTreeFetchRequestError ||
            originalTopLevelApplicationOrganizationTreeFetchRequestError) {
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
    }, [
        originalApplicationOrganizationTreeFetchRequestError,
        originalTopLevelApplicationOrganizationTreeFetchRequestError
    ]);

    useEffect(() => {
        if (applicationRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("applications:edit.sections.sharedAccess.notifications.fetchConsoleRoles." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchConsoleRoles.genericError.message")
                })
            );
        }
    }, [ applicationRolesFetchRequestError ]);

    const buildChildTree = (data: OrganizationInterface[]): TreeViewBaseItemWithRoles[] => {
        const nodeMap: Record<string, TreeViewBaseItemWithRoles> = {};

        const tempFlatOrganizationMap: Record<string, OrganizationInterface> = {
            ...flatOrganizationMap
        };

        // Add all nodes from the top-level organization to nodeMap
        data.forEach((item: OrganizationInterface) => {
            nodeMap[item.id] = {
                children: item.hasChildren ? [
                    {
                        children: [],
                        id: `${item.name}-temp-child`,
                        label: "Loading..."
                    }
                ] : [],
                id: item.id,
                label: item.name,
                parentId: item.parentId,
                roles: item.roles || []
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

        // Recursively deselect children nodes
        children.forEach((childId: string) => {
            deselectChildrenNodes(childId);
        });
    };

    const resolveSelectedItems = (selectedItem: string, isSelected: boolean) => {
        if ((readOnly && isShareSelected)) {
            // If in read-only mode, we don't allow selection changes.
            return;
        }

        if (isSelected) {
            setSelectedItems((prev: string[]) => [ ...prev, selectedItem ]);
            selectParentNodes(selectedItem);
        }
        else {
            setSelectedItems((prev: string[]) => prev.filter((item: string) => item !== selectedItem));
            deselectChildrenNodes(selectedItem);
        }
    };

    const loadMoreOrganizations = (): void => {
        console.log("Loading more organizations...", nextPageLink);

    };

    return (
        <>
            <AnimatePresence mode="wait">
                {
                    isShareSelected && (
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
                                onClick={ () => setReadOnly(!readOnly) }
                            >
                                { readOnly
                                    ? "Manage Role Sharing"
                                    : "View Shared Roles"
                                }
                            </Button>
                        </motion.div>
                    )
                }
            </AnimatePresence>
            <Grid
                container
                xs={ 12 }
                className="roles-selective-share-container"
            >
                <Grid
                    xs={ 12 }
                    md={ isShareSelected ? 4 : 12 }
                    padding={ 1 }
                    className="roles-selective-share-left-panel"
                    id="scrollableOrgContainer"
                >
                    <InfiniteScroll
                        dataLength={ applicationOrganizationTree.length }
                        next={ loadMoreOrganizations }
                        hasMore={ isNextPageAvailable }
                        loader={ (<LinearProgress/>) }
                        scrollableTarget="scrollableOrgContainer"
                    >

                        <RichTreeView
                            className="roles-selective-share-tree-view"
                            items={ applicationOrganizationTree }
                            expansionTrigger="iconContainer"
                            selectedItems={ (readOnly && isShareSelected) ? [] : selectedItems }
                            onItemSelectionToggle={ (_e: SyntheticEvent, itemId: string, isSelected: boolean) =>
                                resolveSelectedItems(itemId, isSelected) }
                            onItemClick={ (_e: SyntheticEvent, itemId: string) => {
                                setSelectedOrgId(itemId);
                            } }
                            onItemExpansionToggle={ (_e: SyntheticEvent, itemId: string, expanded: boolean) => {
                                if (expanded && !resolvedOrgs.includes(itemId)) {
                                    setSelectedOrgId(itemId);
                                }
                            } }
                            selectionPropagation={ {
                                descendants: false,
                                parents: false
                            } }
                            multiSelect={ true }
                            checkboxSelection={ !readOnly || !isShareSelected }
                        />
                    </InfiniteScroll>
                </Grid>
                <AnimatePresence mode="wait">
                    {
                        isShareSelected && (
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
                        )
                    }
                </AnimatePresence>

            </Grid>
        </>
    );
};

export default RolesSelectiveShare;
