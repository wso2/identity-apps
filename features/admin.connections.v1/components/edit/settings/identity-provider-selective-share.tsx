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

import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Code from "@oxygen-ui/react/Code";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";
import {
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationListInterface
} from "@wso2is/admin.organizations.v1/models";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, LinkButton } from "@wso2is/react-components";
import { CustomTreeItem } from "@wso2is/common.ui.shared-access.v1/components/custom-tree-item";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ChangeEvent,
    FunctionComponent,
    Dispatch as ReactDispatch,
    ReactElement,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useGetIdVPShare from "../../../api/use-get-idp-share";
import { IdPSharingPolicy } from "../../../models/identity-provider-sharing";
import "./identity-provider-selective-share.scss";

/**
 * Proptypes for the identity provider selective share component.
 */
interface IdentityProviderSelectiveShareProps extends IdentifiableComponentInterface {
    /**
     * ID of the identity provider being shared.
     */
    identityProviderId: string;
    /**
     * IDs of the organizations currently selected (checked) for sharing.
     */
    selectedItems: string[];
    setSelectedItems: ReactDispatch<SetStateAction<string[]>>;
    /**
     * IDs of the organizations newly selected in this editing session.
     */
    addedOrgs: string[];
    setAddedOrgs: ReactDispatch<SetStateAction<string[]>>;
    /**
     * IDs of the organizations deselected in this editing session.
     */
    removedOrgs: string[];
    setRemovedOrgs: ReactDispatch<SetStateAction<string[]>>;
    /**
     * Map of organization ID to whether the identity provider should be shared with its future
     * child organizations (maps to the SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN policy).
     */
    shouldShareWithFutureChildOrgsMap: Record<string, boolean>;
    setShouldShareWithFutureChildOrgsMap: ReactDispatch<SetStateAction<Record<string, boolean>>>;
}

type TreeViewBaseItemWithParent = TreeViewBaseItem & { parentId?: string };

/**
 * Component that renders an organization tree for selectively sharing an identity provider.
 *
 * This mirrors the organization selection experience of user/application sharing but omits all
 * role sharing, since identity provider sharing does not support roles.
 *
 * @param props - Props injected to the component.
 * @returns The identity provider selective share component.
 */
const IdentityProviderSelectiveShare: FunctionComponent<IdentityProviderSelectiveShareProps> = (
    props: IdentityProviderSelectiveShareProps
): ReactElement => {
    const {
        [ "data-componentid" ]: componentId = "identity-provider-selective-share",
        identityProviderId,
        selectedItems,
        setSelectedItems,
        addedOrgs,
        setAddedOrgs,
        removedOrgs,
        setRemovedOrgs,
        shouldShareWithFutureChildOrgsMap,
        setShouldShareWithFutureChildOrgsMap
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { isOrganizationManagementEnabled } = useGlobalVariables();

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItemWithParent[]>([]);
    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});
    const [ expandedItems, setExpandedItems ] = useState<string[]>([]);
    const [ expandedOrgId, setExpandedOrgId ] = useState<string>();
    const [ selectedOrgId, setSelectedOrgId ] = useState<string>();
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ nextPageLink, setNextPageLink ] = useState<string>();
    const [ hideLeftPanel, setHideLeftPanel ] = useState<boolean>(false);

    // Fetch all the organizations the identity provider is already shared with (to pre-tick).
    const {
        data: sharedOrganizations,
        isLoading: isSharedOrganizationsFetchRequestLoading,
        error: sharedOrganizationsFetchRequestError
    } = useGetIdVPShare(
        identityProviderId,
        !isEmpty(identityProviderId),
        true,
        null
    );

    // Fetch the top-level organizations of the current organization.
    const {
        data: topLevelOrganizations,
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

    // Fetch the child organizations of the currently expanded organization.
    const {
        data: childOrganizations,
        error: childOrganizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled && !isEmpty(expandedOrgId),
        `parentId eq '${ expandedOrgId }'`,
        null,
        null,
        null,
        false,
        false
    );

    // Fetch the sharing details of the selected organization (to resolve its future-children policy).
    const {
        data: selectedSharedOrganization
    } = useGetIdVPShare(
        identityProviderId,
        !isEmpty(identityProviderId) && !isEmpty(selectedOrgId),
        true,
        `id eq '${ selectedOrgId }'`,
        1,
        null,
        null,
        "sharingMode"
    );

    const isLoading: boolean = isSharedOrganizationsFetchRequestLoading;

    /**
     * Build a tree from a flat list of organizations, updating the flat organization map.
     *
     * @param data - The organizations to build the tree from.
     * @returns The built tree nodes.
     */
    const buildChildTree = (data: OrganizationInterface[]): TreeViewBaseItemWithParent[] => {
        const nodeMap: Record<string, TreeViewBaseItemWithParent> = {};
        const tempFlatOrganizationMap: Record<string, OrganizationInterface> = { ...flatOrganizationMap };

        data.forEach((item: OrganizationInterface) => {
            nodeMap[item.id] = {
                children: item.hasChildren
                    ? [ { children: [], id: `${ item.id }-temp-child`, label: "Loading..." } ]
                    : [],
                id: item.id,
                label: item.name,
                parentId: item.parentId ?? expandedOrgId
            };

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

        setFlatOrganizationMap(tempFlatOrganizationMap);

        return data.map((item: OrganizationInterface) => nodeMap[item.id]);
    };

    /**
     * Get all the descendant organization IDs of a given organization from the flat map.
     *
     * @param parentId - The parent organization ID.
     * @returns The descendant organization IDs.
     */
    const getChildrenOfOrganization = (parentId: string): string[] => {
        return Object.values(flatOrganizationMap)
            .filter((org: OrganizationInterface) => org.parentId === parentId)
            .map((org: OrganizationInterface) => org.id);
    };

    /**
     * Replace the temporary loading child of a parent node with its real children.
     */
    const updateTreeWithChildren = (
        tree: TreeViewBaseItemWithParent[],
        parentId: string,
        children: TreeViewBaseItemWithParent[]
    ): TreeViewBaseItemWithParent[] => {
        return tree.map((node: TreeViewBaseItemWithParent) => {
            if (node.id === parentId) {
                return { ...node, children };
            }

            if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: updateTreeWithChildren(node.children as TreeViewBaseItemWithParent[], parentId, children)
                };
            }

            return node;
        });
    };

    // Pre-tick the organizations that the identity provider is already shared with.
    useEffect(() => {
        if ((sharedOrganizations as OrganizationListInterface)?.organizations?.length > 0) {
            const sharedOrgIds: string[] = (sharedOrganizations as OrganizationListInterface).organizations.map(
                (org: OrganizationInterface) => org.id
            );

            if (selectedItems.length === 0) {
                setSelectedItems(sharedOrgIds);
            }
        }
    }, [ sharedOrganizations ]);

    // Build the first level of the organization tree.
    useEffect(() => {
        if (topLevelOrganizations?.organizations?.length > 0) {
            const orgTree: TreeViewBaseItemWithParent[] = buildChildTree(topLevelOrganizations.organizations);

            setOrganizationTree((prev: TreeViewBaseItemWithParent[]) => {
                if (prev.length === 0) {
                    return orgTree;
                }

                const existingOrgIds: string[] = prev.map((item: TreeViewBaseItemWithParent) => item.id);
                const newOrgs: TreeViewBaseItemWithParent[] = orgTree.filter(
                    (item: TreeViewBaseItemWithParent) => !existingOrgIds.includes(item.id)
                );

                return newOrgs.length === 0 ? prev : [ ...prev, ...newOrgs ];
            });

            const nextLink: OrganizationLinkInterface | undefined = topLevelOrganizations?.links?.find(
                (link: OrganizationLinkInterface) => link.rel === "next"
            );

            setNextPageLink(nextLink?.href);

            const initialFlatMap: Record<string, OrganizationInterface> = {};

            topLevelOrganizations.organizations.forEach((org: OrganizationInterface) => {
                initialFlatMap[org.id] = { ...org, parentId: organizationId };
            });
            setFlatOrganizationMap((prev: Record<string, OrganizationInterface>) => ({ ...prev, ...initialFlatMap }));
            setSelectedOrgId((prev: string) => prev ?? topLevelOrganizations.organizations[0].id);

            setHideLeftPanel(
                topLevelOrganizations.organizations.length === 1 &&
                !topLevelOrganizations.organizations[0].hasChildren
            );
        }
    }, [ topLevelOrganizations ]);

    // Update the tree with children of the expanded organization.
    useEffect(() => {
        if (childOrganizations?.organizations?.length > 0) {
            const childTree: TreeViewBaseItemWithParent[] = buildChildTree(childOrganizations.organizations);

            setOrganizationTree((prev: TreeViewBaseItemWithParent[]) =>
                updateTreeWithChildren(prev, expandedOrgId, childTree)
            );
        }
    }, [ childOrganizations ]);

    // Resolve the future-children policy of the selected organization.
    useEffect(() => {
        if (isEmpty(selectedOrgId)) {
            return;
        }

        const selectedOrg: OrganizationInterface = (selectedSharedOrganization as OrganizationListInterface)
            ?.organizations?.[0];

        if (selectedOrg?.sharingMode?.policy) {
            setShouldShareWithFutureChildOrgsMap((prev: Record<string, boolean>) => {
                if (prev[selectedOrgId] !== undefined) {
                    return prev;
                }

                return {
                    ...prev,
                    [selectedOrgId]: selectedOrg.sharingMode.policy ===
                        IdPSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                };
            });
        }
    }, [ selectedSharedOrganization ]);

    // Surface any fetch errors.
    useEffect(() => {
        if (
            sharedOrganizationsFetchRequestError ||
            topLevelOrganizationsFetchRequestError ||
            childOrganizationsFetchRequestError
        ) {
            dispatch(addAlert({
                description: t("authenticationProvider:sharedAccess.notifications.fetchOrganizations." +
                    "genericError.description"),
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:sharedAccess.notifications.fetchOrganizations." +
                    "genericError.message")
            }));
        }
    }, [
        sharedOrganizationsFetchRequestError,
        topLevelOrganizationsFetchRequestError,
        childOrganizationsFetchRequestError
    ]);

    /**
     * Select all ancestor nodes of the given organization.
     */
    const selectParentNodes = (selectedItemId: string): void => {
        const selectedOrg: OrganizationInterface | undefined = flatOrganizationMap[selectedItemId];

        if (!selectedOrg) {
            return;
        }

        const parentNode: OrganizationInterface | undefined = flatOrganizationMap[selectedOrg.parentId];

        if (!parentNode) {
            return;
        }

        if (!selectedItems.includes(parentNode.id)) {
            setSelectedItems((prev: string[]) => [ ...prev, parentNode.id ]);

            if (!addedOrgs.includes(parentNode.id)) {
                setAddedOrgs((prev: string[]) => [ ...prev, parentNode.id ]);
            }

            selectParentNodes(parentNode.id);
        }
    };

    /**
     * Deselect all descendant nodes of the given organization.
     */
    const deselectChildrenNodes = (selectedItemId: string): void => {
        const selectedOrg: OrganizationInterface | undefined = flatOrganizationMap[selectedItemId];

        if (!selectedOrg || !selectedOrg.hasChildren) {
            return;
        }

        const children: string[] = getChildrenOfOrganization(selectedItemId);

        setSelectedItems((prev: string[]) => prev.filter((item: string) => !children.includes(item)));

        children.forEach((childId: string) => {
            if (!removedOrgs.includes(childId)) {
                setRemovedOrgs((prev: string[]) => [ ...prev, childId ]);
            }
            setAddedOrgs((prev: string[]) => prev.filter((item: string) => item !== childId));
            deselectChildrenNodes(childId);
        });
    };

    /**
     * Handle the selection/deselection of an organization in the tree.
     */
    const resolveSelectedItems = (selectedItemId: string, isSelected: boolean): void => {
        if (isSelected) {
            if (!selectedItems.includes(selectedItemId)) {
                setSelectedItems((prev: string[]) => [ ...prev, selectedItemId ]);
            }
            if (!addedOrgs.includes(selectedItemId)) {
                setAddedOrgs((prev: string[]) => [ ...prev, selectedItemId ]);
            }
            setRemovedOrgs((prev: string[]) => prev.filter((item: string) => item !== selectedItemId));
            selectParentNodes(selectedItemId);
        } else {
            setSelectedItems((prev: string[]) => prev.filter((item: string) => item !== selectedItemId));
            if (!removedOrgs.includes(selectedItemId)) {
                setRemovedOrgs((prev: string[]) => [ ...prev, selectedItemId ]);
            }
            setAddedOrgs((prev: string[]) => prev.filter((item: string) => item !== selectedItemId));
            deselectChildrenNodes(selectedItemId);
        }
    };

    /**
     * Collapse all descendant nodes of the given parent node.
     */
    const collapseChildNodes = (parentId: string): void => {
        const children: string[] = getChildrenOfOrganization(parentId);

        children.forEach((childId: string) => {
            setExpandedItems((prev: string[]) => prev.filter((id: string) => id !== childId));
            collapseChildNodes(childId);
        });
    };

    /**
     * Load the next page of top-level organizations.
     */
    const loadMoreOrganizations = (): void => {
        const cursorFragments: string[] = nextPageLink?.split("after=") ?? [];

        if (cursorFragments.length < 2) {
            setNextPageLink(undefined);

            return;
        }

        setAfterCursor(cursorFragments[1]);
    };

    /**
     * Update the future-children policy of the selected organization.
     */
    const updateChildSharingPolicy = (shareWithChildren: boolean): void => {
        setShouldShareWithFutureChildOrgsMap((prev: Record<string, boolean>) => ({
            ...prev,
            [selectedOrgId]: shareWithChildren
        }));
    };

    const resolveShareSettingsPane = (): ReactElement => {
        if (!hideLeftPanel && isEmpty(selectedOrgId)) {
            return (
                <Box className="idp-share-settings-container center">
                    { t("authenticationProvider:sharedAccess.selectAnOrganizationToManage") }
                </Box>
            );
        }

        if (!hideLeftPanel && !selectedItems.includes(selectedOrgId)) {
            return (
                <Box className="idp-share-settings-container center">
                    { t("authenticationProvider:sharedAccess.toManageOrganizationSelectLeftPanel") }
                </Box>
            );
        }

        return (
            <Box className="idp-share-settings-container">
                <Typography variant="h5">
                    { t("authenticationProvider:sharedAccess.sharingSettingsLabel") }
                    <Code sx={ { marginLeft: "5px" } }>{ flatOrganizationMap[selectedOrgId]?.name }</Code>
                </Typography>
                <FormControlLabel
                    control={ <Checkbox /> }
                    label={ t("authenticationProvider:sharedAccess.shareWithFutureChildOrgs") }
                    data-componentid={ `${ componentId }-share-with-future-child-checkbox` }
                    checked={ shouldShareWithFutureChildOrgsMap[selectedOrgId] ?? false }
                    onChange={ (_event: ChangeEvent<HTMLInputElement>, checked: boolean) =>
                        updateChildSharingPolicy(checked)
                    }
                />
            </Box>
        );
    };

    return (
        <Grid container xs={ 12 } className="idp-selective-share-container">
            {
                isLoading ? (
                    <Grid
                        container
                        xs={ 12 }
                        padding={ 1 }
                        className="idp-selective-share-left-panel"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CircularProgress size={ 30 } />
                    </Grid>
                ) : organizationTree.length > 0 ? (
                    <>
                        {
                            !hideLeftPanel && (
                                <Grid
                                    xs={ 12 }
                                    md={ 4 }
                                    lg={ 3 }
                                    padding={ 1 }
                                    className="idp-selective-share-left-panel"
                                >
                                    <RichTreeView
                                        data-componentid={ `${ componentId }-tree-view` }
                                        items={ organizationTree }
                                        expandedItems={ expandedItems }
                                        expansionTrigger="iconContainer"
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
                                        onItemSelectionToggle={ (
                                            _e: SyntheticEvent,
                                            itemId: string,
                                            isSelected: boolean
                                        ) => resolveSelectedItems(itemId, isSelected) }
                                        onItemClick={ (_e: SyntheticEvent, itemId: string) =>
                                            setSelectedOrgId(itemId)
                                        }
                                        selectedItems={ selectedItems }
                                        checkboxSelection={ true }
                                        multiSelect={ true }
                                        selectionPropagation={ { descendants: false, parents: false } }
                                        slots={ { item: CustomTreeItem } }
                                    />
                                    {
                                        !isEmpty(nextPageLink) && (
                                            <LinkButton
                                                compact
                                                onClick={ loadMoreOrganizations }
                                                data-componentid={ `${ componentId }-load-more-button` }
                                            >
                                                { t("common:showMore") }
                                            </LinkButton>
                                        )
                                    }
                                </Grid>
                            )
                        }
                        <Grid
                            xs={ 12 }
                            md={ hideLeftPanel ? 12 : 8 }
                            lg={ hideLeftPanel ? 12 : 9 }
                            paddingX={ 2 }
                            paddingY={ 1 }
                            className="idp-selective-share-right-panel"
                        >
                            { resolveShareSettingsPane() }
                        </Grid>
                    </>
                ) : (
                    <Grid xs={ 12 } padding={ 1 } className="idp-selective-share-empty">
                        <Box
                            data-componentid={ `${ componentId }-no-orgs` }
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                        >
                            <EmptyPlaceholder
                                className="p-0"
                                data-componentid={ `${ componentId }-empty-list-placeholder` }
                                image={ getEmptyPlaceholderIllustrations().emptyList }
                                imageSize="mini"
                                subtitle={ [ t("organizations:placeholders.emptyList.subtitles.0") ] }
                            />
                        </Box>
                    </Grid>
                )
            }
        </Grid>
    );
};

export default IdentityProviderSelectiveShare;
