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
    Dispatch as ReactDispatch,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import "./roles-selective-share.scss";
import useGetApplicationShare from "../../api/use-get-application-share";
import { ApplicationInterface } from "../../models/application";
import InfiniteScroll from "react-infinite-scroll-component";
import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";

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

    const [ selectedOrgId, setSelectedOrgId ] = useState<string>();
    const [ resolvedOrgs, setResolvedOrgs ] = useState<string[]>([]);
    // This will store the shared organization tree of the application with the roles.
    const [ applicationOrganizationTree, setApplicationOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    // This will store the organization tree of the current organization.
    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    // This will store the flat map of organizations to easily access them by ID.
    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ nextPageLink, setNextPageLink ] = useState<string>();
    const [ afterCursor, setAfterCursor ] = useState<string>();


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
        `id eq d04f6218-3b51-4073-b5b0-ef859755c0fe`,
        null,
        100
    );

    const {
        data: originalTopLevelOrganizations,
        isLoading: isTopLevelOrganizationsFetchRequestLoading,
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

    // Get the shared organizations of the application
    useEffect(() => {
        if (originalTopLevelApplicationOrganizationTree?.organizations?.length > 0) {
            const applicationOrgIds: string[] = originalTopLevelApplicationOrganizationTree.organizations
                .map((org: OrganizationInterface) => org.id);

            setSelectedItems(applicationOrgIds);
        }
    }, [ originalTopLevelApplicationOrganizationTree ]);

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
                setIsNextPageAvailable(false);
            }
        } else {
            setIsNextPageAvailable(false);
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
        if (topLevelOrganizationsFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchTopLevelOrgs.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchTopLevelOrgs.genericError.message")
                })
            );
        }
    }, [ topLevelOrganizationsFetchRequestError ]);

    const buildChildTree = (data: OrganizationInterface[]): TreeViewBaseItemWithRoles[] => {
        const nodeMap: Record<string, TreeViewBaseItemWithRoles> = {};

        const tempFlatOrganizationMap: Record<string, OrganizationInterface> = {
            ...flatOrganizationMap
        };

        // Add all nodes from the top-level organization to nodeMap
        data.forEach((item: OrganizationInterface) => {
            if (item.status !== "ACTIVE") {
                return;
            }

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
                parentId: item.parentId
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

    return (
        <>
            <Grid
                container
                xs={ 12 }
                className="roles-selective-share-container"
            >
                <Grid
                    xs={ 12 }
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
                            items={ organizationTree }
                            expansionTrigger="iconContainer"
                            selectedItems={ selectedItems }
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
                            checkboxSelection={ true }
                        />
                    </InfiniteScroll>
                </Grid>
            </Grid>
        </>
    );
};

export default OrgSelectiveShareWithAllRoles;
