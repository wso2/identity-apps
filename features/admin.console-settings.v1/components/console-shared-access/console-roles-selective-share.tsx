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
    OrganizationRoleInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
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
    useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useGetApplicationShare from "../../api/use-get-application-share";
import { ConsoleRolesOnboardingConstants } from "../../constants/console-roles-onboarding-constants";
import useConsoleRoles from "../../hooks/use-console-roles";
import useConsoleSettings from "../../hooks/use-console-settings";
import "./console-roles-selective-share.scss";

interface ConsoleRolesSelectiveShareProps extends IdentifiableComponentInterface {
    addedRoles: Record<string, SelectedOrganizationRoleInterface[]>;
    removedRoles: Record<string, SelectedOrganizationRoleInterface[]>;
    setAddedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    setRemovedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
}

interface TreeViewBaseItemWithRoles extends TreeViewBaseItem {
    roles?: RolesInterface[];
    parentId?: string;
}

const ConsoleRolesSelectiveShare = (props: ConsoleRolesSelectiveShareProps) => {
    const {
        [ "data-componentid" ]: componentId = "console-roles-selective-share-modal",
        addedRoles,
        removedRoles,
        setAddedRoles,
        setRemovedRoles
    } = props;

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { consoleId } = useConsoleSettings();

    const [ selectedOrgId, setSelectedOrgId ] = useState<string>();
    const [ readOnly, setReadOnly ] = useState<boolean>(true);
    const [ resolvedOrgs, setResolvedOrgs ] = useState<string[]>([]);
    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    const [ roleSelections, setRoleSelections ] = useState<Record<string, SelectedOrganizationRoleInterface[]>>({});

    const {
        data: originalTopLevelOrganizationTree,
        isLoading: isTopLevelOrganizationTreeFetchRequestLoading,
        error:  originalTopLevelOrganizationTreeFetchRequestError
    } = useGetApplicationShare(
        consoleId,
        !isEmpty(consoleId) && !isEmpty(organizationId),
        false,
        `parentId eq '${ organizationId }'`,
        null,
        100
    );

    const {
        data: originalOrganizationTree,
        isLoading: isOrganizationTreeFetchRequestLoading,
        error:  originalOrganizationTreeFetchRequestError
    } = useGetApplicationShare(
        consoleId,
        !isEmpty(consoleId) &&
        !isEmpty(selectedOrgId) &&
        !resolvedOrgs.includes(selectedOrgId),
        false,
        `parentId eq '${ selectedOrgId }'`
    );

    const {
        consoleRoles,
        consoleRolesFetchRequestError
    } = useConsoleRoles(true, null, null, null);

    // This will populate the top-level organization tree.
    useEffect(() => {
        if (originalTopLevelOrganizationTree?.organizations?.length > 0) {
            const topLevelOrgTree: TreeViewBaseItem[] =
                buildChildTree(originalTopLevelOrganizationTree?.organizations);

            if (topLevelOrgTree.length > 0) {
                // Add organizations which are already not in the organization tree.
                const existingOrgIds: string[] = organizationTree.map((item: TreeViewBaseItem) => item.id);

                const newOrgs: TreeViewBaseItem[] = topLevelOrgTree.filter(
                    (item: TreeViewBaseItem) => !existingOrgIds.includes(item.id)
                );

                const combinedOrgs: TreeViewBaseItem[] = [
                    ...organizationTree,
                    ...newOrgs
                ];

                setOrganizationTree(combinedOrgs);
                setSelectedOrgId(topLevelOrgTree[0].id);
            }
        }
    }, [ originalTopLevelOrganizationTree ]);

    // This will update the organization tree with the children of the selected organization.
    useEffect(() => {
        if (originalOrganizationTree?.organizations?.length > 0) {
            const childOrgTree: TreeViewBaseItemWithRoles[] = buildChildTree(originalOrganizationTree?.organizations);

            const updatedTree: TreeViewBaseItemWithRoles[] =
                updateTreeWithChildren(organizationTree, selectedOrgId, childOrgTree);

            setResolvedOrgs((prev: string[]) => [ ...prev, selectedOrgId ]);
            setOrganizationTree(updatedTree);

            // Compute role selections for the newly added children
            const childRoleMap: Record<string, SelectedOrganizationRoleInterface[]> = computeChildRoleSelections(
                selectedOrgId,
                originalOrganizationTree.organizations
            );

            setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                ...prev,
                ...childRoleMap
            }));
        }
    }, [ originalOrganizationTree ]);


    useEffect(() => {
        if (
            originalTopLevelOrganizationTree?.organizations?.length > 0 &&
            consoleRoles?.Resources?.length > 0
        ) {
            const computedRoleSelections: Record<string, SelectedOrganizationRoleInterface[]> =
                computeInitialRoleSelections(
                    originalTopLevelOrganizationTree.organizations,
                    consoleRoles.Resources
                );

            // Initialize the role selections with the top-level organization roles
            setRoleSelections(computedRoleSelections);
        }
    }, [ originalTopLevelOrganizationTree, consoleRoles ]);

    useEffect(() => {
        if (originalOrganizationTreeFetchRequestError || originalTopLevelOrganizationTreeFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.genericError.message")
                })
            );
        }
    }, [ originalOrganizationTreeFetchRequestError, originalTopLevelOrganizationTreeFetchRequestError ]);

    useEffect(() => {
        if (consoleRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("consoleSettings:sharedAccess.notifications.fetchConsoleRoles." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.fetchConsoleRoles.genericError.message")
                })
            );
        }
    }, [ consoleRolesFetchRequestError ]);

    const buildChildTree = (data: OrganizationInterface[]): TreeViewBaseItemWithRoles[] => {
        const nodeMap: Record<string, TreeViewBaseItemWithRoles> = {};

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
        });

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

        const recurse = (nodes: TreeViewBaseItemWithRoles[]) => {
            for (const node of nodes) {
                if (node.id === parentId && node.children) {
                    for (const child of node.children as TreeViewBaseItemWithRoles[]) {
                        result.push(child.id);
                        recurse([ child ]);
                    }
                } else if (node.children) {
                    recurse(node.children as TreeViewBaseItemWithRoles[]);
                }
            }
        };

        recurse(organizationTree);

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

    return (
        <>
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
            <Grid
                container
                xs={ 12 }
                className="roles-selective-share-container"
            >
                <Grid
                    xs={ 12 }
                    md={ 4 }
                    padding={ 1 }
                    className="roles-selective-share-left-panel"
                >
                    <RichTreeView
                        className="roles-selective-share-tree-view"
                        items={ organizationTree }
                        defaultSelectedItems={ selectedOrgId }
                        expansionTrigger="iconContainer"
                        onItemClick={ (_e: SyntheticEvent, itemId: string) => {
                            setSelectedOrgId(itemId);
                        } }
                        onItemExpansionToggle={ (_e: SyntheticEvent, itemId: string, expanded: boolean) => {
                            if (expanded && !resolvedOrgs.includes(itemId)) {
                                setSelectedOrgId(itemId);
                            }
                        } }
                        multiSelect={ false }
                    />
                </Grid>
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
                                                        const updatedRoles: SelectedOrganizationRoleInterface[] =
                                                        roleSelections[selectedOrgId].map(
                                                            (r: SelectedOrganizationRoleInterface) =>
                                                                r.displayName === role.displayName
                                                                    ? { ...r, selected: !r.selected }
                                                                    : r
                                                        );

                                                        setRoleSelections((prev:
                                                            Record<string, SelectedOrganizationRoleInterface[]>) => ({
                                                            ...prev,
                                                            [selectedOrgId]: updatedRoles
                                                        }));

                                                        if (checked) {
                                                            cascadeRoleAdditionToChildren(selectedOrgId, role);
                                                            resolveRoleAddition(selectedOrgId, role);
                                                        } else {
                                                            cascadeRoleRemovalToChildren(selectedOrgId, role);
                                                            resolveRoleRemoval(selectedOrgId, role);
                                                        }
                                                    } }
                                                    disabled={
                                                        role.displayName ===
                                                            ConsoleRolesOnboardingConstants.ADMINISTRATOR }
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

            </Grid>
        </>
    );
};

export default ConsoleRolesSelectiveShare;
