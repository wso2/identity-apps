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
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Grid from "@oxygen-ui/react/Grid";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Typography from "@oxygen-ui/react/Typography";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";
import {
    OrganizationInterface,
    OrganizationLinkInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import isEmpty from "lodash-es/isEmpty";
import React, {
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
import "./roles-selective-share.scss";
import useGetApplicationShare from "../../api/use-get-application-share";
import { ApplicationInterface } from "../../models/application";
import { getChildrenOfOrganization, updateTreeWithChildren } from "../../utils/shared-access";

interface OrgSelectiveShareWithAllRolesProps extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    addedOrgs: string[];
    removedOrgs: string[];
    selectedItems: string[];
    setAddedOrgs: ReactDispatch<SetStateAction<string[]>>;
    setRemovedOrgs: ReactDispatch<SetStateAction<string[]>>;
    setSelectedItems: ReactDispatch<SetStateAction<string[]>>;
}

interface TreeViewBaseItemWithRoles extends TreeViewBaseItem {
    roles?: RolesInterface[];
    parentId?: string;
}

const OrgSelectiveShareWithAllRoles = (props: OrgSelectiveShareWithAllRolesProps) => {
    const {
        [ "data-componentid" ]: componentId = "org-selective-share-with-all-roles",
        application,
        addedOrgs,
        removedOrgs,
        setAddedOrgs,
        setRemovedOrgs,
        selectedItems,
        setSelectedItems
    } = props;

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { isOrganizationManagementEnabled } = useGlobalVariables();

    // This will store the organization tree of the current organization.
    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    // This will store the flat map of organizations to easily access them by ID.
    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ nextPageLink, setNextPageLink ] = useState<string>();
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ expandedOrgId, setExpandedOrgId ] = useState<string>();
    const [ expandedItems, setExpandedItems ] = useState<string[]>([]);

    const {
        data: originalApplicationOrganizationTree,
        isLoading: isApplicationOrganizationTreeFetchRequestLoading,
        error:  originalApplicationOrganizationTreeFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        !isEmpty(application?.id),
        true,
        null,
        null,
        null,
        null,
        null,
        "sharingMode"
    );

    const {
        data: originalTopLevelOrganizations,
        error: topLevelOrganizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled,
        null,
        15,
        !isEmpty(afterCursor) ? afterCursor : null,
        null,
        false,
        false
    );

    const {
        data: originalOrganizations,
        error: organizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled && !isEmpty(expandedOrgId),
        `parentId eq '${ expandedOrgId }'`,
        null,
        null,
        null,
        false,
        false
    );

    // Get the shared organizations of the application
    useEffect(() => {
        if (originalApplicationOrganizationTree?.organizations?.length > 0) {
            const applicationOrgIds: string[] = originalApplicationOrganizationTree.organizations
                .map((org: OrganizationInterface) => org.id);

            // Set the flat map of application roles
            const applicationRolesMap: Record<string, OrganizationInterface> = {};

            originalApplicationOrganizationTree.organizations?.forEach((org: OrganizationInterface) => {
                applicationRolesMap[org.id] = org;
            });

            setSelectedItems(applicationOrgIds);
        } else {
            setSelectedItems([]);
        }
    }, [ originalApplicationOrganizationTree ]);

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
                setNextPageLink(undefined);
                setIsNextPageAvailable(false);
            }
        } else {
            setIsNextPageAvailable(false);
        }
    }, [ originalTopLevelOrganizations ]);

    // This will update the organization tree with the children of the selected organization.
    useEffect(() => {
        if (originalOrganizations?.organizations?.length > 0) {
            const childOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTree(originalOrganizations?.organizations);

            const updatedTree: TreeViewBaseItemWithRoles[] =
                updateTreeWithChildren(organizationTree, expandedOrgId, childOrgTree);

            setOrganizationTree(updatedTree);
        }
    }, [ originalOrganizations ]);

    useEffect(() => {
        if (originalApplicationOrganizationTreeFetchRequestError) {
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
    }, [ originalApplicationOrganizationTreeFetchRequestError ]);

    useEffect(() => {
        if (topLevelOrganizationsFetchRequestError || organizationsFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("consoleSettings:sharedAccess.notifications" +
                        ".fetchOrgTree.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications" +
                        ".fetchOrgTree.error.message")
                })
            );
        }
    }, [ topLevelOrganizationsFetchRequestError, organizationsFetchRequestError ]);

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
                parentId: item.parentId ?? expandedOrgId ?? organizationId
            };

            // Add the organization to the flat map
            if (!tempFlatOrganizationMap[item.id]) {
                tempFlatOrganizationMap[item.id] = {
                    hasChildren: item.hasChildren,
                    id: item.id,
                    name: item.name,
                    parentId: item.parentId ?? expandedOrgId ?? organizationId,
                    ref: item.ref,
                    status: item.status
                };
            }
        });

        setFlatOrganizationMap(tempFlatOrganizationMap);

        return data.map((item: OrganizationInterface) => nodeMap[item.id]);
    };

    const selectParentNodes = (selectedItemId: string): void => {
        // Get the seleted node from the flatOrganizationMap
        const selectedOrg: OrganizationInterface | undefined = flatOrganizationMap[selectedItemId];

        if (!selectedOrg) {
            return;
        }

        // Get the parent node of the selected organization from the flatOrganizationMap
        const parentNode: OrganizationInterface | undefined = flatOrganizationMap[selectedOrg.parentId];

        if (!parentNode) {
            return;
        }

        // If the parent node is not selected, select it
        if (!selectedItems.includes(parentNode.id)) {
            setSelectedItems((prev: string[]) => [ ...prev, parentNode.id ]);
            selectParentNodes(parentNode.id);

            // add the selected organization to the addedOrgs list if it is not already there
            if (!addedOrgs.includes(parentNode.id)) {
                setAddedOrgs((addedOrgs: string[]) => [ ...addedOrgs, parentNode.id ]);
            }
        }
    };

    const deselectChildrenNodes = (selectedItemId: string): void => {
        // Get the seleted node and its children nodes
        const selectedOrg: OrganizationInterface | undefined = flatOrganizationMap[selectedItemId];

        // If the selected organization does not have children, return
        if (!selectedOrg || !selectedOrg.hasChildren) {
            return;
        }

        const children: string[] = getChildrenOfOrganization(selectedItemId, flatOrganizationMap);

        // Deselect all children nodes
        setSelectedItems((prev: string[]) => prev.filter((item: string) => !children.includes(item)));

        // add the deselected organization to the removedOrgs list if it is not already there
        if (!removedOrgs.includes(selectedItemId)) {
            setRemovedOrgs((prev: string[]) => [ ...prev, selectedItemId ]);
        }

        // Recursively deselect children nodes
        children.forEach((childId: string) => {
            deselectChildrenNodes(childId);
        });
    };

    const resolveSelectedItems = (selectedItem: string, isSelected: boolean) => {
        if (isSelected) {
            // Add the selected item to the selectedItems list if it is not already there
            if (!selectedItems.includes(selectedItem)) {
                setSelectedItems((prev: string[]) => [ ...prev, selectedItem ]);
            }
            // Add to addedOrgs list if the organization is not already in the list
            if (!addedOrgs.includes(selectedItem)) {
                setAddedOrgs((prev: string[]) => [ ...prev, selectedItem ]);
            }
            // remove the organization from the removedOrgs list if it exists
            setRemovedOrgs((prev: string[]) => prev.filter((item: string) => item !== selectedItem));
            // Select the parent nodes of the selected item
            selectParentNodes(selectedItem);
        } else {
            // Remove the selected item from the selectedItems list
            setSelectedItems((prev: string[]) => prev.filter((item: string) => item !== selectedItem));
            // Add to removedOrgs list if the organization is not already in the list
            if (!removedOrgs.includes(selectedItem)) {
                setRemovedOrgs((prev: string[]) => [ ...prev, selectedItem ]);
            }
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
        <Grid
            container
            xs={ 12 }
            className="roles-selective-share-container"
        >
            {
                isApplicationOrganizationTreeFetchRequestLoading ? (
                    <Grid
                        container
                        xs={ 12 }
                        padding={ 1 }
                        className="roles-selective-share-all-roles"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CircularProgress size={ 30 } />
                    </Grid>
                ) : (
                    <Grid
                        xs={ 12 }
                        padding={ 1 }
                        className="roles-selective-share-all-roles"
                        id="scrollableOrgContainer"
                    >
                        <InfiniteScroll
                            dataLength={ organizationTree.length }
                            next={ loadMoreOrganizations }
                            hasMore={ isNextPageAvailable }
                            loader={ (<LinearProgress/>) }
                            scrollableTarget="scrollableOrgContainer"
                        >
                            {
                                organizationTree.length > 0 ? (
                                    <RichTreeView
                                        data-componentid={ `${ componentId }-tree-view` }
                                        className="roles-selective-share-tree-view"
                                        items={ organizationTree }
                                        expandedItems={ expandedItems }
                                        selectedItems={ selectedItems }
                                        onItemSelectionToggle={ (
                                            _e: SyntheticEvent,
                                            itemId: string,
                                            isSelected: boolean
                                        ) =>
                                            resolveSelectedItems(itemId, isSelected) }
                                        onItemExpansionToggle={ (
                                            _e: SyntheticEvent,
                                            itemId: string,
                                            expanded: boolean
                                        ) => {
                                            if (expanded) {
                                                setExpandedOrgId(itemId);
                                                setExpandedItems((prev: string[]) => [ ...prev, itemId ]);
                                            } else {
                                                setExpandedItems((prev: string[]) =>
                                                    prev.filter((id: string) => id !== itemId));
                                                collapseChildNodes(itemId);
                                            }
                                        } }
                                        selectionPropagation={ {
                                            descendants: false,
                                            parents: false
                                        } }
                                        checkboxSelection={ true }
                                        multiSelect={ true }
                                    />
                                ) : (
                                    <Box
                                        data-componentid={ `${ componentId }-no-orgs` }
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                        alignItems="center"
                                        height="100%"
                                    >
                                        <Typography variant="body1">
                                            { t("organizations:placeholders.emptyList.subtitles.0") }
                                        </Typography>
                                    </Box>
                                )
                            }
                        </InfiniteScroll>
                    </Grid>
                )
            }
        </Grid>
    );
};

export default OrgSelectiveShareWithAllRoles;
