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
import Autocomplete, {
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { ApplicationSharingPolicy, RoleSharingModes } from "@wso2is/admin.console-settings.v1/models/shared-access";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";
import {
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationRoleInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import useGetApplicationRolesByAudience from "@wso2is/admin.roles.v2/api/use-get-application-roles-by-audience";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import { AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatePresence } from "framer-motion";
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
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import "./roles-selective-share.scss";
import { DropdownProps } from "semantic-ui-react";
import useGetApplicationShare from "../../api/use-get-application-share";
import { ShareType } from "../../constants/application-roles";
import { ApplicationInterface, RoleSharingInterface } from "../../models/application";
import {
    computeChildRoleSelections,
    computeInitialRoleSelections,
    getChildrenOfOrganization,
    updateTreeWithChildren
} from "../../utils/shared-access";
import CircularProgress from "@oxygen-ui/react/CircularProgress";

interface OrgSelectiveShareWithSelectiveRolesEditProps extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    selectedItems: string[];
    setSelectedItems: ReactDispatch<SetStateAction<string[]>>;
    addedOrgs: string[];
    setAddedOrgs: ReactDispatch<SetStateAction<string[]>>;
    removedOrgs: string[];
    setRemovedOrgs: ReactDispatch<SetStateAction<string[]>>;
    roleSelections: Record<string, SelectedOrganizationRoleInterface[]>;
    setRoleSelections: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    addedRoles: Record<string, RoleSharingInterface[]>;
    setAddedRoles: ReactDispatch<SetStateAction<Record<string, RoleSharingInterface[]>>>;
    removedRoles: Record<string, RoleSharingInterface[]>;
    setRemovedRoles: ReactDispatch<SetStateAction<Record<string, RoleSharingInterface[]>>>;
    shareAllRoles: boolean;
    shareType: ShareType;
    newlyAddedCommonRoles?: RolesInterface[];
    newlyRemovedCommonRoles?: RolesInterface[];
    shouldShareWithFutureChildOrgsMap?: Record<string, boolean>;
    setShouldShareWithFutureChildOrgsMap?: ReactDispatch<SetStateAction<Record<string, boolean>>>;
}

interface TreeViewBaseItemWithRoles extends TreeViewBaseItem {
    roles?: RolesInterface[];
    parentId?: string;
}

const OrgSelectiveShareWithSelectiveRolesEdit = (props: OrgSelectiveShareWithSelectiveRolesEditProps) => {
    const {
        [ "data-componentid" ]: componentId = "org-selective-share-with-selective-roles-edit",
        application,
        addedOrgs,
        setAddedOrgs,
        removedOrgs,
        setRemovedOrgs,
        selectedItems,
        setSelectedItems,
        roleSelections,
        setRoleSelections,
        addedRoles,
        setAddedRoles,
        removedRoles,
        setRemovedRoles,
        shareAllRoles,
        shareType,
        newlyAddedCommonRoles = [],
        newlyRemovedCommonRoles = [],
        shouldShareWithFutureChildOrgsMap = {},
        setShouldShareWithFutureChildOrgsMap
    } = props;

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { isOrganizationManagementEnabled } = useGlobalVariables();

    // This will store the organization tree of the current organization.
    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ nextPageLink, setNextPageLink ] = useState<string>();
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ expandedOrgId, setExpandedOrgId ] = useState<string>();
    const [ selectedOrgId, setSelectedOrgId ] = useState<string>();
    const [ expandedItems, setExpandedItems ] = useState<string[]>([]);
    const [ selectedOrganizationSharingPolicy, setSelectedOrganizationSharingPolicy ]
        = useState<ApplicationSharingPolicy>();

    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});

    const applicationAudience: string = application?.associatedRoles?.allowedAudience ?? RoleAudienceTypes.ORGANIZATION;

    // Fetch all the organizations that the application is shared with.
    const {
        data: totalApplicationOrganizations,
        isLoading: isTotalApplicationOrganizationsFetchRequestLoading,
        error:  totalApplicationOrganizationsFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        !isEmpty(application?.id),
        true,
        null,
        "roles"
    );

    // Fetch the application roles by audience.
    // This will fetch the roles that are available for the application to share with the organizations.
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
        !isEmpty(application?.id)
    );

    // Fetch the top-level organization of the current organization.
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

    // Fetch the organizations under the selected organization.
    // This is used to fetch the child organizations of the selected organization.
    const {
        data: originalOrganizations,
        error: organizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled &&
        !isEmpty(expandedOrgId),
        `parentId eq '${ expandedOrgId }'`,
        null,
        null,
        null,
        false,
        false
    );

    // Fetch the details of the selected organization.
    // This is used to fetch the shared roles of the selected organization.
    const {
        data: selectedApplicationOrganization,
        error:  selectedApplicationOrganizationFetchRequestError
    } = useGetApplicationShare(
        application?.id,
        !isEmpty(application?.id) &&
        !isEmpty(selectedOrgId),
        true,
        `id eq '${ selectedOrgId }'`,
        null,
        1,
        null,
        null,
        "sharingMode"
    );

    const isLoading: boolean = isTotalApplicationOrganizationsFetchRequestLoading ||
            isApplicationRolesFetchRequestLoading;

    // Used to tick shared orgs from the total organization tree
    useEffect(() => {
        if (totalApplicationOrganizations?.organizations?.length > 0) {
            const sharedOrgs: string[] = totalApplicationOrganizations.organizations.map(
                (org: OrganizationInterface) => org.id
            );

            setSelectedItems(sharedOrgs);
        } else {
            setSelectedItems([]);
        }
    }, [ totalApplicationOrganizations ]);

    // applications roles available in the application to be shared with the organizations.
    const applicationRolesList: RolesV2Interface[] = useMemo(() => {
        if (originalApplicationRoles?.Resources?.length > 0) {
            return originalApplicationRoles.Resources;
        }
    }, [ originalApplicationRoles ]);

    // Build the first level organization tree from the top-level organizations.
    useEffect(() => {
        if (originalTopLevelOrganizations?.organizations?.length > 0) {
            const orgTree: TreeViewBaseItemWithRoles[] =
                buildChildTree(originalTopLevelOrganizations.organizations);

            setOrganizationTree((prev: TreeViewBaseItemWithRoles[]) => {
                // If the application organization tree is empty, set the application orgs as the initial tree
                if (prev.length === 0) {
                    return orgTree;
                }

                // If the application organization tree already has items, merge the
                // application orgs with the existing tree.
                const existingOrgIds: string[] = prev.map((item: TreeViewBaseItemWithRoles) => item.id);
                const newOrgs: TreeViewBaseItemWithRoles[] = orgTree.filter(
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

            // Initialize the flat organization map with the top-level organizations
            const initialFlatMap: Record<string, OrganizationInterface> = {};

            // Set the top-level organizations in the flat organization map.
            originalTopLevelOrganizations.organizations.forEach((org: OrganizationInterface) => {
                initialFlatMap[org.id] = {
                    ...org,
                    parentId: organizationId
                };
            });
            setFlatOrganizationMap(initialFlatMap);
        }
    }, [ originalTopLevelOrganizations ]);

    // This will update the organization tree with the children of the expanded organization.
    useEffect(() => {
        if (originalOrganizations?.organizations?.length > 0) {
            const childOrgTree: TreeViewBaseItemWithRoles[] =
                buildChildTree(originalOrganizations?.organizations);
            const updatedTree: TreeViewBaseItemWithRoles[] =
                updateTreeWithChildren(organizationTree, expandedOrgId, childOrgTree);

            setOrganizationTree(updatedTree);

            // Compute role selections for the newly added children when expanded.
            const childRoleMap: Record<string, SelectedOrganizationRoleInterface[]> = computeChildRoleSelections(
                expandedOrgId,
                originalOrganizations.organizations,
                roleSelections
            );

            setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                ...prev,
                ...childRoleMap
            }));
        }
    }, [ originalOrganizations ]);

    useEffect(() => {
        if (
            originalTopLevelOrganizations?.organizations?.length > 0 &&
            applicationRolesList?.length > 0
        ) {
            const computedRoleSelections: Record<string, SelectedOrganizationRoleInterface[]> =
                computeInitialRoleSelections(
                    originalTopLevelOrganizations.organizations,
                    applicationRolesList
                );

            // Update the roleSelection if the added roleSelections are not already present.
            setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => {
                const updated: Record<string, SelectedOrganizationRoleInterface[]> = { ...prev };

                Object.keys(computedRoleSelections).forEach((orgId: string) => {
                    if (isEmpty(updated[orgId])) {
                        updated[orgId] = computedRoleSelections[orgId];
                    }
                });

                return updated;
            });
        }
    }, [ originalTopLevelOrganizations, applicationRolesList ]);

    useEffect(() => {
        if (selectedApplicationOrganization?.organizations?.length > 0) {
            const selectedOrg: OrganizationInterface = selectedApplicationOrganization.organizations[0];
            const orgRoleSelections: SelectedOrganizationRoleInterface[] = roleSelections[selectedOrg.id] || [];
            const selectedOrgSharingPolicy: ApplicationSharingPolicy = selectedOrg?.sharingMode?.policy;
            const selectedOrgRoleSharingMode: RoleSharingModes = selectedOrg?.sharingMode?.roleSharing?.mode;

            if (selectedOrgSharingPolicy) {
                setSelectedOrganizationSharingPolicy(selectedOrgSharingPolicy);
            } else {
                // If the selected organization does not have a sharing policy,
                // default it to SELECTED_ORG_ONLY.
                setSelectedOrganizationSharingPolicy(ApplicationSharingPolicy.SELECTED_ORG_ONLY);
            }

            // If the selected organization has roles, update the role selections.
            if (selectedOrg?.roles?.length > 0) {
                if (isEmpty(orgRoleSelections)) {
                    // If there are no roles selected for the organization, initialize them.
                    const initializedRoles: SelectedOrganizationRoleInterface[] = selectedOrg.roles.map(
                        (role: OrganizationRoleInterface) => ({
                            ...role,
                            selected: selectedOrgRoleSharingMode !== RoleSharingModes.ALL
                        })
                    );

                    setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                        ...prev,
                        [ selectedOrg.id ]: initializedRoles
                    }));

                    return;
                }

                let updatedRolesWithApiResponse: SelectedOrganizationRoleInterface[] = [];

                if (shareType === ShareType.SHARE_ALL) {
                    // If the share type is SHARE_ALL, we have to consider the common set of roles as well.
                    // Mark the roles in the orgRoleSelections as selected.
                    updatedRolesWithApiResponse = orgRoleSelections?.map(
                        (role: SelectedOrganizationRoleInterface) => {
                            let isSelected: boolean = false;

                            const isRoleInSelectedOrg: boolean = selectedOrg?.roles?.some(
                                (selectedRole: OrganizationRoleInterface) =>
                                    selectedRole.displayName === role.displayName);
                            // Check if the roles exists in the newlyAddedCommonRoles
                            const isRoleInNewlyAddedCommonRoles: boolean = newlyAddedCommonRoles?.some(
                                (selectedRole: RolesInterface) => selectedRole.displayName === role.displayName);
                            // Check if the roles exists in the newlyRemovedCommonRoles
                            const isRoleInNewlyRemovedCommonRoles: boolean = newlyRemovedCommonRoles?.some(
                                (selectedRole: RolesInterface) => selectedRole.displayName === role.displayName);

                            // Only consider the response from the API if the share type is NOT SHARE_ALL.
                            if (selectedOrgRoleSharingMode !== RoleSharingModes.ALL && isRoleInSelectedOrg) {
                                isSelected = true;
                            }

                            // Check if the roles exists in newlyAddedCommonRoles, mark it as selected.
                            if (isRoleInNewlyAddedCommonRoles) {
                                isSelected = true;
                            }

                            // If the role exists in the newlyRemovedCommonRoles, mark it as unselected.
                            if (isRoleInNewlyRemovedCommonRoles) {
                                isSelected = false;
                            }

                            return({
                                ...role,
                                selected: isSelected
                            });
                        }
                    );
                } else if (shareType === ShareType.SHARE_SELECTED) {
                    // If the share type is SHARE_SELECTED, we only consider the roles in the selectedOrg.
                    updatedRolesWithApiResponse = orgRoleSelections?.map(
                        (role: SelectedOrganizationRoleInterface) => {
                            let isSelected: boolean = false;

                            // Check if the roles exists in the selectedOrg
                            // If it does, mark it as selected.
                            if (selectedOrg?.roles?.some((selectedRole: OrganizationRoleInterface) =>
                                selectedRole.displayName === role.displayName)) {
                                isSelected = true;
                            }

                            return({
                                ...role,
                                selected: isSelected
                            });
                        }
                    );
                }

                // Processing for addedRoles and removedRoles which resulted from user interaction
                const updatedRoles: SelectedOrganizationRoleInterface[] = updatedRolesWithApiResponse?.map(
                    (role: SelectedOrganizationRoleInterface) => {
                        // If the role exists in the addedRoles, mark it as selected.
                        if (addedRoles[selectedOrg.id]?.some(
                            (addedRole: RoleSharingInterface) =>
                                addedRole.displayName === role.displayName)) {
                            return({
                                ...role,
                                selected: true
                            });
                        }

                        // If the role exists in the removedRoles, mark it as unselected.
                        if (removedRoles[selectedOrg.id]?.some(
                            (removedRole: RoleSharingInterface) =>
                                removedRole.displayName === role.displayName)) {
                            return({
                                ...role,
                                selected: false
                            });
                        }

                        // If the role does not exist in the addedRoles or removedRoles,
                        // keep the existing selection state.
                        return role;
                    }
                );

                // Update the role selections with the updated roles.
                setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                    ...prev,
                    [ selectedOrg.id ]: updatedRoles
                }));
            } else if (selectedOrg?.roles?.length === 0) {
                // If the selected organization has an empty roles array, set all the roles to unselected.
                const unselectedRoles: SelectedOrganizationRoleInterface[] = orgRoleSelections?.map(
                    (role: SelectedOrganizationRoleInterface) => ({
                        ...role,
                        selected: false
                    })
                );

                let updatedRolesWithApiResponse: SelectedOrganizationRoleInterface[] = [];

                if (shareType === ShareType.SHARE_ALL) {
                    // If the share type is SHARE_ALL, we have to consider the common set of roles as well.
                    // Mark the roles in the orgRoleSelections as selected.
                    updatedRolesWithApiResponse = unselectedRoles?.map(
                        (role: SelectedOrganizationRoleInterface) => {
                            // Check if the roles exists in the newlyAddedCommonRoles
                            const isRoleInSelectedRoles: boolean = newlyAddedCommonRoles?.some(
                                (selectedRole: RolesInterface) => selectedRole.displayName === role.displayName);

                            // If it does, mark it as selected.
                            if (isRoleInSelectedRoles) {
                                return({
                                    ...role,
                                    selected: true
                                });
                            }

                            // If it does not, keep the existing selection state.
                            return role;
                        }
                    );
                } else if (shareType === ShareType.SHARE_SELECTED) {
                    // If the share type is SHARE_SELECTED, we just keep the unselected state.
                    updatedRolesWithApiResponse = unselectedRoles;
                }

                // Processing for addedRoles and removedRoles which resulted from user interaction
                const updatedRoles: SelectedOrganizationRoleInterface[] = updatedRolesWithApiResponse?.map(
                    (role: SelectedOrganizationRoleInterface) => {
                        // If the role exists in the addedRoles, mark it as selected.
                        if (addedRoles[selectedOrg.id]?.some(
                            (addedRole: RoleSharingInterface) =>
                                addedRole.displayName === role.displayName)) {
                            return({
                                ...role,
                                selected: true
                            });
                        }

                        // If the role exists in the removedRoles, mark it as unselected.
                        if (removedRoles[selectedOrg.id]?.some(
                            (removedRole: RoleSharingInterface) =>
                                removedRole.displayName === role.displayName)) {
                            return({
                                ...role,
                                selected: false
                            });
                        }

                        // If the role does not exist in the addedRoles or removedRoles,
                        // keep the existing selection state.
                        return role;
                    }
                );

                setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                    ...prev,
                    [ selectedOrg.id ]: updatedRoles
                }));
            }
        }
    }, [ selectedApplicationOrganization ]);

    useEffect(() => {
        if (totalApplicationOrganizationsFetchRequestError ||
            selectedApplicationOrganizationFetchRequestError
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
        totalApplicationOrganizationsFetchRequestError,
        selectedApplicationOrganizationFetchRequestError
    ]);

    useEffect(() => {
        if (organizationsFetchRequestError || topLevelOrganizationsFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchOrganizations.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchOrganizations.genericError.message")
                })
            );
        }
    }, [ organizationsFetchRequestError, topLevelOrganizationsFetchRequestError ]);

    useEffect(() => {
        if (applicationRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchApplicationRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.sharedAccess.notifications" +
                        ".fetchApplicationRoles.genericError.message")
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
                parentId: item.parentId ?? expandedOrgId
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

    const resolveSelectedItems = (selectedItemId: string, isSelected: boolean) => {
        if (isSelected) {
            // Add the selected item to the selectedItems list if it is not already there
            if (!selectedItems.includes(selectedItemId)) {
                setSelectedItems((prev: string[]) => [ ...prev, selectedItemId ]);
            }
            // Add to addedOrgs list if the organization is not already in the list
            if (!addedOrgs.includes(selectedItemId)) {
                setAddedOrgs((prev: string[]) => [ ...prev, selectedItemId ]);
            }
            // remove the organization from the removedOrgs list if it exists
            setRemovedOrgs((prev: string[]) => prev.filter((item: string) => item !== selectedItemId));
            // Select the parent nodes of the selected item
            selectParentNodes(selectedItemId);
        }
        else {
            // Remove the selected item from the selectedItems list
            setSelectedItems((prev: string[]) => prev.filter((item: string) => item !== selectedItemId));
            // Add to removedOrgs list if the organization is not already in the list
            if (!removedOrgs.includes(selectedItemId)) {
                setRemovedOrgs((prev: string[]) => [ ...prev, selectedItemId ]);
            }
            // remove the organization from the addedOrgs list if it exists
            setAddedOrgs((prev: string[]) => prev.filter((item: string) => item !== selectedItemId));

            // Remove roles of the removed organization
            removeRolesOfTheRemovedOrg(selectedItemId);

            // Deselect all children nodes of the selected item
            deselectChildrenNodes(selectedItemId);
        }
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

        // Remove the roles of the deselected organization
        removeRolesOfTheRemovedOrg(selectedItemId);

        // Recursively deselect children nodes
        children.forEach((childId: string) => {
            deselectChildrenNodes(childId);
        });
    };

    const removeRolesOfTheRemovedOrg = (selectedItemId: string): void => {
        const tempRemovedRoles: RoleSharingInterface[] | undefined = removedRoles[selectedItemId];
        const tempAddedRoles: RoleSharingInterface[] | undefined = addedRoles[selectedItemId];

        // Remove roles from the addedRoles map if they exist
        if (tempAddedRoles) {
            setAddedRoles((prev: Record<string, RoleSharingInterface[]>) => {
                const updatedRoles: Record<string, RoleSharingInterface[]> = { ...prev };

                delete updatedRoles[selectedItemId];

                return updatedRoles;
            });
        }

        // Remove roles from the removedRoles map if they exist
        if (tempRemovedRoles) {
            setRemovedRoles((prev: Record<string, RoleSharingInterface[]>) => {
                const updatedRoles: Record<string, RoleSharingInterface[]> = { ...prev };

                delete updatedRoles[selectedItemId];

                return updatedRoles;
            });
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

    const resolveRoleAddition = (orgId: string, addedRole: RoleSharingInterface) => {
        // Check if the roles is in removedRoles map
        const removedRolesForOrg: RoleSharingInterface[] = removedRoles[orgId] || [];
        const isRoleInRemovedRoles: boolean = removedRolesForOrg.some(
            (role: RoleSharingInterface) => role.displayName === addedRole.displayName
        );

        // If the role is in removedRoles, remove it from there
        // No need to add it to the addedRoles map as an already existed role was removed
        // and now it is being added again.
        if (isRoleInRemovedRoles) {
            setRemovedRoles((prev: Record<string, RoleSharingInterface[]>) => {
                const updatedRoles: RoleSharingInterface[] = prev[orgId]?.filter(
                    (role: RoleSharingInterface) => role.displayName !== addedRole.displayName
                ) || [];

                return {
                    ...prev,
                    [orgId]: updatedRoles
                };
            });

            return;
        }

        // Else, this is a new role addition, so add it to the addedRoles map
        setAddedRoles((prev: Record<string, RoleSharingInterface[]>) => {
            const updatedRoles: RoleSharingInterface[] = prev[orgId]?.map(
                (role: RoleSharingInterface) => ({
                    audience: {
                        display: role.audience?.display,
                        type: role.audience?.type
                    },
                    displayName: role.displayName
                })) || [];
            const alreadyExists: boolean = updatedRoles.some(
                (role: RoleSharingInterface) => role.displayName === addedRole.displayName
            );

            if (!alreadyExists) {
                return {
                    ...prev,
                    [orgId]: [ ...updatedRoles, addedRole ]
                };
            }

            return prev;
        });
    };

    const resolveRoleRemoval = (orgId: string, removedRole: RoleSharingInterface) => {
        // Check if the roles is in addedRoles map
        const addedRolesForOrg: RoleSharingInterface[] = addedRoles[orgId] || [];
        const isRoleInAddedRoles: boolean = addedRolesForOrg.some(
            (role: RoleSharingInterface) => role.displayName === removedRole.displayName
        );

        // If the role is in addedRoles, remove it from there
        // No need to add it to the removedRoles map as an already existed role was added
        // and now it is being removed again.
        if (isRoleInAddedRoles) {
            setAddedRoles((prev: Record<string, RoleSharingInterface[]>) => {
                const updatedRoles: RoleSharingInterface[] = prev[orgId]?.filter(
                    (role: RoleSharingInterface) => role.displayName !== removedRole.displayName
                ) || [];

                return {
                    ...prev,
                    [orgId]: updatedRoles
                };
            });

            return;
        }

        // Else, this is a new role removal, so we need to add it to the removedRoles map
        setRemovedRoles((prev: Record<string, RoleSharingInterface[]>) => {
            const updatedRoles: RoleSharingInterface[] = prev[orgId] || [];
            const alreadyExists: boolean = updatedRoles.some(
                (role: RoleSharingInterface) => role.displayName === removedRole.displayName
            );

            if (!alreadyExists) {
                return {
                    ...prev,
                    [orgId]: [ ...updatedRoles, removedRole ]
                };
            }

            return prev;
        });
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

    const updateChildSharingPolicy = (
        shareWithChildren: boolean
    ): void => {
        // Update the sharing policy of the organization in the shouldShareWithFutureChildOrgsMap
        setShouldShareWithFutureChildOrgsMap((prev: Record<string, boolean>) => ({
            ...prev,
            [selectedOrgId]: shareWithChildren
        }));
    };

    const handleRolesOnChange = (
        value: SelectedOrganizationRoleInterface[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<SelectedOrganizationRoleInterface>
    ): void => {
        if (reason === "selectOption") {
            // If the user selects a role, set the selected property to true in the roleSelections
            // Selected value is at the last index of the value array
            const selectedRole: SelectedOrganizationRoleInterface = details?.option;

            // If there is no selected role, return
            if (isEmpty(selectedRole)) {
                return;
            }

            const updatedRoles: SelectedOrganizationRoleInterface[] = roleSelections[selectedOrgId]?.map(
                (role: SelectedOrganizationRoleInterface) => {
                    if (role?.displayName === selectedRole?.displayName) {
                        return { ...role, selected: true };
                    }

                    return role;
                }
            );

            setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                ...prev,
                [selectedOrgId]: updatedRoles
            }));

            const transformedRole: RoleSharingInterface = {
                audience: {
                    display: selectedRole?.audience?.display,
                    type: selectedRole?.audience?.type
                },
                displayName: selectedRole.displayName
            };

            cascadeRoleAdditionToChildren(selectedOrgId, selectedRole);
            resolveRoleAddition(selectedOrgId, transformedRole);
        }

        if (reason === "removeOption") {
            // If the user removes a role, set the selected property to false in the roleSelections
            const removedRole: SelectedOrganizationRoleInterface = details?.option;

            // If there is no removed role, return
            if (isEmpty(removedRole)) {
                return;
            }

            const updatedRoles: SelectedOrganizationRoleInterface[] = roleSelections[selectedOrgId]?.map(
                (role: SelectedOrganizationRoleInterface) => {
                    if (role?.displayName === removedRole?.displayName) {
                        return { ...role, selected: false };
                    }

                    return role;
                }
            );

            setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                ...prev,
                [selectedOrgId]: updatedRoles
            }));

            const transformedRole: RoleSharingInterface = {
                audience: {
                    display: removedRole?.audience?.display,
                    type: removedRole?.audience?.type
                },
                displayName: removedRole.displayName
            };

            cascadeRoleRemovalToChildren(selectedOrgId, removedRole);
            resolveRoleRemoval(selectedOrgId, transformedRole);
        }
    };

    const resolveRoleSelectionPane = (): ReactNode => {
        if (isEmpty(selectedOrgId)) {
            return (
                <Alert
                    severity="info"
                    data-componentid={ `${ componentId }-org-not-selected-alert` }
                >
                    { t("applications:edit.sections.sharedAccess.selectAnOrganizationToMangage") }
                </Alert>
            );
        }

        if (shareType === ShareType.SHARE_SELECTED && !selectedItems.includes(selectedOrgId)) {
            return (
                <Alert
                    severity="info"
                    data-componentid={ `${ componentId }-org-not-selected-alert` }
                >
                    { t("applications:edit.sections.sharedAccess.toManageOrganizationSelectLeftPanel") }
                </Alert>
            );
        }

        return (
            <>
                <Typography variant="h5">
                    {
                        `${ t("applications:edit.sections.sharedAccess.sharingSettings") } ${
                            flatOrganizationMap[selectedOrgId]?.name }`
                    }
                </Typography>
                <Typography variant="body1">
                    { t("applications:edit.sections.sharedAccess.sharedRoles") }
                </Typography>
                {
                    shareAllRoles ? (
                        <Alert
                            severity="info"
                            data-componentid={ `${ componentId }-no-roles-alert` }
                        >
                            { t("applications:edit.sections.sharedAccess.allRolesSharingMessage") }
                        </Alert>
                    ) : isEmpty(roleSelections[selectedOrgId]) ? (
                        <Alert
                            severity="info"
                            data-componentid={ `${ componentId }-no-roles-alert` }
                        >
                            { t("applications:edit.sections.sharedAccess" +
                                ".noRolesAvailableForOrg") }
                        </Alert>
                    ) : (
                        <Autocomplete
                            fullWidth
                            multiple
                            disableClearable
                            data-componentid={ `${componentId}-autocomplete` }
                            placeholder={
                                t("applications:edit.sections.sharedAccess.modes.shareWithSelectedPlaceholder") }
                            options={ roleSelections[selectedOrgId] ?? [] }
                            value={ roleSelections[selectedOrgId].filter(
                                (role: SelectedOrganizationRoleInterface) => role.selected) }
                            onChange={ (
                                _event: SyntheticEvent,
                                value: SelectedOrganizationRoleInterface[],
                                reason: AutocompleteChangeReason,
                                details: AutocompleteChangeDetails<SelectedOrganizationRoleInterface>
                            ) => {
                                handleRolesOnChange(value, reason, details);
                            } }
                            noOptionsText={ t("common:noResultsFound") }
                            getOptionLabel={ (dropdownOption: DropdownProps) =>
                                dropdownOption?.displayName }
                            isOptionEqualToValue={ (
                                option: RolesV2Interface,
                                value: RolesV2Interface) =>
                                option?.displayName === value.displayName
                            }
                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                <TextField
                                    { ...params }
                                    size="medium"
                                    placeholder={
                                        t("applications:edit.sections.sharedAccess.searchAvailableRolesPlaceholder") }
                                    data-componentid={ `${componentId}-role-search-input` }
                                />
                            ) }
                            renderTags={ (
                                value: RolesV2Interface[],
                                getTagProps: AutocompleteRenderGetTagProps
                            ) => value.map((option: RolesV2Interface, index: number) => {
                                return (
                                    <Chip
                                        { ...getTagProps({ index }) }
                                        key={ index }
                                        label={ option.displayName }
                                    />
                                );
                            }
                            ) }
                        />
                    )
                }
                {
                    shareType === ShareType.SHARE_SELECTED && (
                        <FormControlLabel
                            control={ <Checkbox defaultChecked /> }
                            label="Share application and roles with future child organizations"
                            data-componentid={ `${ componentId }-share-with-future-child-checkbox` }
                            checked={ shouldShareWithFutureChildOrgsMap[selectedOrgId] ??
                                selectedOrganizationSharingPolicy ===
                                ApplicationSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN ??
                                false
                            }
                            onChange={ (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                updateChildSharingPolicy(checked);
                            } }
                        />
                    )
                }
            </>
        );
    };

    return (
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
                ) : organizationTree.length > 0 ? (
                    <>
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
                                    data-componentid={ `${ componentId }-tree-view` }
                                    className="roles-selective-share-tree-view"
                                    items={ organizationTree }
                                    expandedItems={ expandedItems }
                                    expansionTrigger={ shareType === ShareType.SHARE_ALL
                                        ? "content"
                                        : "iconContainer"
                                    }
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
                                    ) =>
                                        resolveSelectedItems(itemId, isSelected) }
                                    onItemClick={ (_e: SyntheticEvent, itemId: string) => {
                                        setSelectedOrgId(itemId);
                                    } }
                                    selectedItems={ selectedItems }
                                    checkboxSelection={ shareType !== ShareType.SHARE_ALL }
                                    disableSelection={ shareType === ShareType.SHARE_ALL }
                                    multiSelect={ shareType !== ShareType.SHARE_ALL }
                                    selectionPropagation={ {
                                        descendants: false,
                                        parents: false
                                    } }
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
                    <Grid
                        xs={ 12 }
                        padding={ 1 }
                        className="roles-selective-share-all-roles"
                        id="scrollableOrgContainer"
                    >
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
                    </Grid>
                )
            }
        </Grid>
    );
};

export default OrgSelectiveShareWithSelectiveRolesEdit;
