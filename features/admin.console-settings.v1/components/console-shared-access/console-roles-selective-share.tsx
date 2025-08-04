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
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Grid from "@oxygen-ui/react/Grid";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Typography from "@oxygen-ui/react/Typography";
import useGetApplicationShare from "@wso2is/admin.applications.v1/api/use-get-application-share";
import {
    computeChildRoleSelections,
    computeInitialRoleSelections,
    getChildrenOfOrganization,
    updateTreeWithChildren
} from "@wso2is/admin.applications.v1/utils/shared-access";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    OrganizationInterface,
    OrganizationLinkInterface,
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
    useState
} from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { ConsoleRolesOnboardingConstants } from "../../constants/console-roles-onboarding-constants";
import useConsoleRoles from "../../hooks/use-console-roles";
import useConsoleSettings from "../../hooks/use-console-settings";
import "./console-roles-selective-share.scss";

interface ConsoleRolesSelectiveShareProps extends IdentifiableComponentInterface {
    setAddedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    setRemovedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    readOnly: boolean;
    setReadOnly: ReactDispatch<SetStateAction<boolean>>;
}

interface TreeViewBaseItemWithRoles extends TreeViewBaseItem {
    roles?: RolesInterface[];
    parentId?: string;
}

const ConsoleRolesSelectiveShare = (props: ConsoleRolesSelectiveShareProps) => {
    const {
        [ "data-componentid" ]: componentId = "console-roles-selective-share-modal",
        setAddedRoles,
        setRemovedRoles,
        readOnly,
        setReadOnly
    } = props;

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { consoleId } = useConsoleSettings();

    const [ selectedOrgId, setSelectedOrgId ] = useState<string>();
    const [ expandedOrgId, setExpandedOrgId ] = useState<string>();
    const [ expandedItems, setExpandedItems ] = useState<string[]>([]);
    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    const [ roleSelections, setRoleSelections ] = useState<Record<string, SelectedOrganizationRoleInterface[]>>({});
    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ nextPageLink, setNextPageLink ] = useState<string>();
    const [ afterCursor, setAfterCursor ] = useState<string>();

    const {
        data: originalTopLevelOrganizationTree,
        mutate: mutateOriginalTopLevelOrganizationTree,
        error:  originalTopLevelOrganizationTreeFetchRequestError
    } = useGetApplicationShare(
        consoleId,
        !isEmpty(consoleId) && !isEmpty(organizationId),
        false,
        `parentId eq '${ organizationId }'`,
        null,
        15,
        null,
        afterCursor
    );

    const {
        data: originalOrganizationTree,
        error:  originalOrganizationTreeFetchRequestError
    } = useGetApplicationShare(
        consoleId,
        !isEmpty(consoleId) &&
        !isEmpty(expandedOrgId),
        false,
        `parentId eq '${ expandedOrgId }'`
    );

    const {
        consoleRoles,
        consoleRolesFetchRequestError
    } = useConsoleRoles(true, 100, null, null);

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

            // Initialize the flat organization map with the top-level organizations
            const initialFlatMap: Record<string, OrganizationInterface> = {};

            // Set the top-level organizations in the flat organization map.
            originalTopLevelOrganizationTree.organizations.forEach((org: OrganizationInterface) => {
                initialFlatMap[org.id] = {
                    ...org,
                    parentId: organizationId
                };
            });
            setFlatOrganizationMap(initialFlatMap);
        }

        // If there are links in the top-level organization tree, set the next page link.
        // This is used for pagination.
        if (originalTopLevelOrganizationTree?.links?.length > 0) {
            const nextLink: OrganizationLinkInterface | undefined = originalTopLevelOrganizationTree
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
    }, [ originalTopLevelOrganizationTree ]);

    // This will update the organization tree with the children of the selected organization.
    useEffect(() => {
        if (originalOrganizationTree?.organizations?.length > 0) {
            const childOrgTree: TreeViewBaseItemWithRoles[] = buildChildTree(originalOrganizationTree?.organizations);

            const updatedTree: TreeViewBaseItemWithRoles[] =
                updateTreeWithChildren(organizationTree, expandedOrgId, childOrgTree);

            setOrganizationTree(updatedTree);

            // Compute role selections for the newly added children
            const childRoleMap: Record<string, SelectedOrganizationRoleInterface[]> = computeChildRoleSelections(
                expandedOrgId,
                originalOrganizationTree.organizations,
                roleSelections
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

            // Update the role selections with the top-level organization roles
            setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                ...prev,
                ...computedRoleSelections
            }));
        }
    }, [ originalTopLevelOrganizationTree, consoleRoles ]);

    useEffect(() => {
        if (originalOrganizationTreeFetchRequestError || originalTopLevelOrganizationTreeFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.error.message")
                })
            );
        }
    }, [ originalOrganizationTreeFetchRequestError, originalTopLevelOrganizationTreeFetchRequestError ]);

    useEffect(() => {
        if (consoleRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("consoleSettings:sharedAccess.notifications.fetchRoles." +
                        "error.description"),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.fetchRoles.error.message")
                })
            );
        }
    }, [ consoleRolesFetchRequestError ]);

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
                    parentId: item.parentId ?? expandedOrgId,
                    ref: item.ref,
                    status: item.status
                };
            }
        });

        // Update the flat organization map state
        setFlatOrganizationMap(tempFlatOrganizationMap);

        return data.map((item: OrganizationInterface) => nodeMap[item.id]);
    };

    const cascadeRoleRemovalToChildren = (parentId: string, removedRole: SelectedOrganizationRoleInterface) => {
        const children: string[] = getChildrenOfOrganization(parentId, flatOrganizationMap);

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
        const children: string[] = getChildrenOfOrganization(parentId, flatOrganizationMap);

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

    // This function loads more organizations when the user scrolls to the bottom of the organization tree.
    // It checks if there is a next page link and updates the after cursor for pagination.
    const loadMoreOrganizations = (): void => {
        const cursorFragments: string[] = nextPageLink?.split("after=");

        if (cursorFragments.length < 2) {
            setIsNextPageAvailable(false);

            return;
        }

        setAfterCursor(cursorFragments[1]);
    };

    /**
     * This function collapses all child nodes of a given parent node.
     * It removes the child nodes from the expanded items and recursively collapses
     * any further child nodes.
     *
     * @param parentId - The ID of the parent node whose children need to be collapsed.
     */
    const collapseChildNodes = (parentId: string): void => {
        // Find children of the parent node
        const children: string[] = getChildrenOfOrganization(parentId, flatOrganizationMap);

        // If there are no children, return
        if (children?.length > 0) {
            // Recursively collapse child nodes
            children.forEach((childId: string) => {
                // Remove the child from the expanded items
                setExpandedItems((prev: string[]) => prev.filter((id: string) => id !== childId));

                // Recursively collapse child nodes
                collapseChildNodes(childId);
            });
        }
    };

    return (
        <>
            <Alert
                severity="info"
            >
                Sharing roles will take some time to effect.
            </Alert>
            <Grid
                marginTop={ 1 }
                justifySelf="flex-end"
            >

                <Button
                    data-componentid={ `${ componentId }-refresh-button` }
                    variant="text"
                    size="small"
                    onClick={ () => mutateOriginalTopLevelOrganizationTree() }
                    startIcon={ <Icon size="small" name="refresh" /> }
                >
                    Refresh
                </Button>
                <Button
                    data-componentid={ `${ componentId }-edit-button` }
                    variant="text"
                    size="small"
                    onClick={ () => setReadOnly(!readOnly) }
                    startIcon= {
                        readOnly
                            ? <Icon size="small" name="edit" />
                            : <Icon size="small" name="eye"  />
                    }
                >
                    { readOnly
                        ? t("applications:edit.sections.sharedAccess.manageRoleSharing")
                        : t("applications:edit.sections.sharedAccess.viewRoleSharing")
                    }
                </Button>
            </Grid>
            <Grid
                container
                xs={ 12 }
            >
                <Grid
                    xs={ 12 }
                    md={ 4 }
                    padding={ 1 }
                    className="roles-selective-share-left-panel"
                    id="scrollableOrgContainer"
                >
                    <InfiniteScroll
                        dataLength={ organizationTree.length }
                        next={ loadMoreOrganizations }
                        hasMore={ isNextPageAvailable }
                        loader={ (<LinearProgress/>) }
                        scrollableTarget="scrollableOrgContainer"
                    >

                        <RichTreeView
                            className="roles-selective-share-tree-view"
                            data-componentid={ `${ componentId }-organization-tree-view` }
                            items={ organizationTree }
                            defaultSelectedItems={ selectedOrgId }
                            expandedItems={ expandedItems }
                            onItemClick={ (_e: SyntheticEvent, itemId: string) => {
                                setSelectedOrgId(itemId);
                            } }
                            onItemExpansionToggle={ (_e: SyntheticEvent, itemId: string, expanded: boolean) => {
                                if (expanded) {
                                    setExpandedOrgId(itemId);
                                    setExpandedItems((prev: string[]) => [ ...prev, itemId ]);
                                } else {
                                    setExpandedItems((prev: string[]) => prev.filter((id: string) => id !== itemId));
                                    collapseChildNodes(itemId);
                                }
                            } }
                            multiSelect={ false }
                        />
                    </InfiniteScroll>
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
                                        data-componentid={ `${ componentId }-role-${ role.displayName }` }
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
                                                    data-componentid={
                                                        `${ componentId }-role-${ role.displayName }-checkbox` }
                                                    checked={ role.displayName ===
                                                        ConsoleRolesOnboardingConstants.ADMINISTRATOR
                                                        ? true
                                                        : role.selected }
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
                                            data-componentid={ `${ componentId }-role-${ role.displayName }-label` }
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
