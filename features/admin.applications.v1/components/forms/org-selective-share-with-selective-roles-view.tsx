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
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Grid from "@oxygen-ui/react/Grid";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Typography from "@oxygen-ui/react/Typography";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationRoleInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatedAvatar } from "@wso2is/react-components";
import { AnimatePresence } from "framer-motion";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ReactNode,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState } from "react";
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
}

interface TreeViewBaseItemWithRoles extends TreeViewBaseItem {
    roles?: RolesInterface[];
    parentId?: string;
}

const OrgSelectiveShareWithSelectiveRolesView = (props: OrgSelectiveShareWithAllRolesProps) => {
    const {
        [ "data-componentid" ]: componentId = "org-selective-share-with-selective-roles-view",
        application
    } = props;

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    // This will store the organization tree of the current organization.
    const [ applicationOrganizationTree, setApplicationOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ nextPageLink, setNextPageLink ] = useState<string>();
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ expandedOrgId, setExpandedOrgId ] = useState<string>();
    const [ expandedItems, setExpandedItems ] = useState<string[]>([]);
    const [ roleSelections, setRoleSelections ] = useState<Record<string, OrganizationRoleInterface[]>>({});
    const [ selectedOrgId, setSelectedOrgId ] = useState<string>(organizationId);
    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});

    // We are fetching the application organization tree in the read-only mode.
    // Used in 1st level with pagination
    const {
        data: originalTopLevelApplicationOrganizations,
        isLoading: isTopLevelApplicationOrganizationsFetchRequestLoading,
        error:  originalTopLevelApplicationOrganizationsFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        true,
        false,
        null,
        null,
        15,
        null,
        !isEmpty(afterCursor) ? afterCursor : null
    );

    const {
        data: originalApplicationOrganizations,
        error:  originalApplicationOrganizationsFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        !isEmpty(expandedOrgId),
        false,
        `parentId eq '${ expandedOrgId }'`
    );

    const isLoading: boolean = useMemo((): boolean => (isTopLevelApplicationOrganizationsFetchRequestLoading),
        [ isTopLevelApplicationOrganizationsFetchRequestLoading ]);

    // Get the shared organizations of the application
    useEffect(() => {
        if (originalTopLevelApplicationOrganizations?.organizations?.length > 0) {
            const applicationOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTreeWithRoles(originalTopLevelApplicationOrganizations.organizations);

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

            // If there are links in the top-level organizations, set the next page link.
            // This is used for pagination.
            if (originalTopLevelApplicationOrganizations?.links?.length > 0) {
                const nextLink: OrganizationLinkInterface | undefined = originalTopLevelApplicationOrganizations
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

            // Set the first organization as the selected initial organization.
            setSelectedOrgId(applicationOrgTree[0].id);

            // Initialize the flat organization map with the top-level organizations
            const initialFlatMap: Record<string, OrganizationInterface> = {};

            // Set the top-level organizations in the flat organization map.
            originalTopLevelApplicationOrganizations.organizations.forEach((org: OrganizationInterface) => {
                initialFlatMap[org.id] = {
                    ...org,
                    parentId: organizationId
                };
            });
            setFlatOrganizationMap(initialFlatMap);
        }
    }, [ originalTopLevelApplicationOrganizations ]);

    // This will update the application organization tree with the children of the selected organization.
    useEffect(() => {
        if (originalApplicationOrganizations?.organizations?.length > 0) {
            const childOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTreeWithRoles(originalApplicationOrganizations?.organizations);

            const updatedTree: TreeViewBaseItemWithRoles[] =
                updateTreeWithChildren(applicationOrganizationTree, expandedOrgId, childOrgTree);

            setApplicationOrganizationTree(updatedTree);
        }
    }, [ originalApplicationOrganizations ]);

    useEffect(() => {
        if (originalTopLevelApplicationOrganizationsFetchRequestError ||
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
        originalApplicationOrganizationsFetchRequestError
    ]);

    const buildChildTreeWithRoles = (
        data: OrganizationInterface[]
    ): TreeViewBaseItemWithRoles[] => {
        const nodeMap: Record<string, TreeViewBaseItemWithRoles> = {};
        const orgRolesMap: Record<string, OrganizationRoleInterface[]> = {
            ...roleSelections
        };
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
                parentId: item.parentId ?? expandedOrgId
            };

            orgRolesMap[item.id] = item.roles;

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

        // Update the role selections state with the orgRolesMap
        setRoleSelections(orgRolesMap);

        return data.map((item: OrganizationInterface) => nodeMap[item.id]);
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

    const resolveRoleSelectionPane = (): ReactNode => {
        if (isEmpty(selectedOrgId)) {
            return (
                <Alert
                    severity="info"
                    data-componentid={ `${ componentId }-org-not-selected-alert` }
                >
                    { t("applications:edit.sections.sharedAccess" +
                        ".selectAnOrganizationToViewRoles") }
                </Alert>
            );
        }

        if (isEmpty(roleSelections[selectedOrgId])) {
            return (
                <Alert
                    severity="info"
                    data-componentid={ `${ componentId }-no-roles-alert` }
                >
                    { t("applications:edit.sections.sharedAccess" +
                        ".noRolesAvailableForOrg") }
                </Alert>
            );
        }

        return roleSelections[selectedOrgId]
            .map((role: SelectedOrganizationRoleInterface, index: number) => (
                <Box
                    key={ `role-${index}` }
                    className="role-item"
                    data-componentid={
                        `${ componentId }-role-${ role.displayName }` }
                >
                    <AnimatedAvatar
                        name={ role.displayName }
                        size="mini"
                        data-componentid={
                            `${ componentId }-item-avatar` }
                    />
                    <Typography
                        variant="body1"
                        className="role-label"
                        data-componentid={
                            `${ componentId }-role-label` }
                    >
                        { role.displayName }
                    </Typography>
                </Box>
            ));
    };

    return (
        <>
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
                            {
                                applicationOrganizationTree.length > 0 ? (
                                    <>
                                        <Grid
                                            xs={ 12 }
                                            md={ 4 }
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
                                                    data-componentid={ `${ componentId }-tree-view` }
                                                    className="roles-selective-share-tree-view"
                                                    items={ applicationOrganizationTree }
                                                    expandedItems={ expandedItems }
                                                    onItemExpansionToggle={ (
                                                        _e: SyntheticEvent,
                                                        itemId: string,
                                                        expanded: boolean
                                                    ) => {
                                                        if (expanded) {
                                                            setExpandedOrgId(itemId);
                                                            setExpandedItems((prev: string[]) => [
                                                                ...prev,
                                                                itemId
                                                            ]);
                                                        } else  {
                                                            setExpandedItems((prev: string[]) =>
                                                                prev.filter((id: string) => id !== itemId));
                                                            collapseChildNodes(itemId);
                                                        }
                                                    } }
                                                    onItemClick={ (_e: SyntheticEvent, itemId: string) => {
                                                        setSelectedOrgId(itemId);
                                                    } }
                                                    checkboxSelection={ false }
                                                />
                                            </InfiniteScroll>
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
                                                    { resolveRoleSelectionPane() }
                                                </Box>
                                            </Grid>
                                        </AnimatePresence>
                                    </>

                                ) : (
                                    <Alert
                                        severity="info"
                                        data-componentid={ `${ componentId }-no-orgs-alert` }
                                    >
                                        { t("applications:edit.sections.sharedAccess.noSharedOrgs") }
                                    </Alert>
                                )
                            }
                        </>
                    )
                }
            </Grid>
        </>
    );
};

export default OrgSelectiveShareWithSelectiveRolesView;
