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
import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import TextField from "@oxygen-ui/react/TextField";
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
    OrganizationRoleInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import { AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Dispatch as ReactDispatch,
    ReactNode,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps } from "semantic-ui-react";
import { ConsoleRolesOnboardingConstants } from "../../constants/console-roles-onboarding-constants";
import useConsoleRoles from "../../hooks/use-console-roles";
import useConsoleSettings from "../../hooks/use-console-settings";
import "./console-roles-selective-share.scss";

interface ConsoleRolesSelectiveShareProps extends IdentifiableComponentInterface {
    setAddedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    setRemovedRoles: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    readOnly: boolean;
    roleSelections: Record<string, SelectedOrganizationRoleInterface[]>;
    setRoleSelections: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
    addedRoles: Record<string, SelectedOrganizationRoleInterface[]>;
    removedRoles: Record<string, SelectedOrganizationRoleInterface[]>;
    newlyAddedCommonRoles?: RolesInterface[];
    newlyRemovedCommonRoles?: RolesInterface[];
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
        setRemovedRoles,
        roleSelections,
        setRoleSelections,
        readOnly,
        newlyAddedCommonRoles = [],
        newlyRemovedCommonRoles = []
    } = props;

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { consoleId } = useConsoleSettings();

    const [ selectedOrgId, setSelectedOrgId ] = useState<string>();
    const [ expandedOrgId, setExpandedOrgId ] = useState<string>();
    const [ expandedItems, setExpandedItems ] = useState<string[]>([]);
    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItemWithRoles[]>([]);
    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ nextPageLink, setNextPageLink ] = useState<string>();
    const [ afterCursor, setAfterCursor ] = useState<string>();

    const {
        data: originalTopLevelOrganizationTree,
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

    // Fetch the details of the selected organization.
    // This is used to fetch the shared roles of the selected organization.
    const {
        data: selectedOrganization,
        error:  selectedOrganizationFetchRequestError
    } = useGetApplicationShare(
        consoleId,
        !isEmpty(selectedOrgId),
        true,
        `id eq '${ selectedOrgId }'`
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
                roleSelections,
                [ ConsoleRolesOnboardingConstants.ADMINISTRATOR ]
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
        if (selectedOrganization?.organizations?.length > 0) {
            const selectedOrg: OrganizationInterface = selectedOrganization.organizations[0];
            const orgRoleSelections: SelectedOrganizationRoleInterface[] = roleSelections[selectedOrg.id] || [];

            // If the selected organization is not in the flat organization map,
            // add it to the flat organization map.
            if (!flatOrganizationMap[selectedOrg.id]) {
                setFlatOrganizationMap((prev: Record<string, OrganizationInterface>) => ({
                    ...prev,
                    [ selectedOrg.id ]: selectedOrg
                }));
            }

            // If the selected organization has roles, update the role selections.
            if (selectedOrg?.roles?.length > 0) {
                if (isEmpty(orgRoleSelections)) {
                    // If there are no roles selected for the organization, initialize them.
                    // In the read-only mode, all roles should be selected (showing the current state).
                    const initializedRoles: SelectedOrganizationRoleInterface[] = selectedOrg.roles.map(
                        (role: OrganizationRoleInterface) => ({
                            ...role,
                            selected: role.displayName === ConsoleRolesOnboardingConstants.ADMINISTRATOR
                                ? true
                                : readOnly
                        })
                    );

                    setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                        ...prev,
                        [ selectedOrg.id ]: initializedRoles
                    }));

                    return;
                }

                let updatedRolesWithApiResponse: SelectedOrganizationRoleInterface[] = [];

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

                        if (role.displayName === ConsoleRolesOnboardingConstants.ADMINISTRATOR) {
                            isSelected = true;
                        }

                        // Only consider the response from the API in the readonly mode.
                        if (readOnly && isRoleInSelectedOrg) {
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

                // Processing for addedRoles and removedRoles which resulted from user interaction
                const updatedRoles: SelectedOrganizationRoleInterface[] = updatedRolesWithApiResponse?.map(
                    (role: SelectedOrganizationRoleInterface) => {
                        // If the role exists in the addedRoles, mark it as selected.
                        if (addedRoles[selectedOrg.id]?.some(
                            (addedRole: SelectedOrganizationRoleInterface) =>
                                addedRole.displayName === role.displayName)) {
                            return({
                                ...role,
                                selected: true
                            });
                        }

                        // If the role exists in the removedRoles, mark it as unselected.
                        if (removedRoles[selectedOrg.id]?.some(
                            (removedRole: SelectedOrganizationRoleInterface) =>
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

                // Processing for addedRoles and removedRoles which resulted from user interaction
                const updatedRoles: SelectedOrganizationRoleInterface[] = updatedRolesWithApiResponse?.map(
                    (role: SelectedOrganizationRoleInterface) => {
                        // If the role exists in the addedRoles, mark it as selected.
                        if (addedRoles[selectedOrg.id]?.some(
                            (addedRole: SelectedOrganizationRoleInterface) =>
                                addedRole.displayName === role.displayName)) {
                            return({
                                ...role,
                                selected: true
                            });
                        }

                        // If the role exists in the removedRoles, mark it as unselected.
                        if (removedRoles[selectedOrg.id]?.some(
                            (removedRole: SelectedOrganizationRoleInterface) =>
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
    }, [ selectedOrganization, readOnly ]);

    useEffect(() => {
        if (originalOrganizationTreeFetchRequestError ||
            originalTopLevelOrganizationTreeFetchRequestError ||
            selectedOrganizationFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.error.message")
                })
            );
        }
    }, [
        originalOrganizationTreeFetchRequestError,
        originalTopLevelOrganizationTreeFetchRequestError,
        selectedOrganizationFetchRequestError
    ]);

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

    const handleRolesOnChange = (
        value: SelectedOrganizationRoleInterface[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<SelectedOrganizationRoleInterface>
    ): void => {
        if (reason === "selectOption") {
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

            cascadeRoleAdditionToChildren(selectedOrgId, selectedRole);
            resolveRoleAddition(selectedOrgId, selectedRole);
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

            cascadeRoleRemovalToChildren(selectedOrgId, removedRole);
            resolveRoleRemoval(selectedOrgId, removedRole);
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
                    isEmpty(roleSelections[selectedOrgId]) ? (
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
                            readOnly={ readOnly }
                            data-componentid={ `${componentId}-autocomplete` }
                            placeholder={ !readOnly &&
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
                            getOptionDisabled={ (option: RolesInterface) => {
                                return option.displayName === ConsoleRolesOnboardingConstants.ADMINISTRATOR;
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
                                    disabled={ readOnly }
                                    placeholder={
                                        !readOnly &&
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
                                        disabled={ option.displayName ===
                                            ConsoleRolesOnboardingConstants.ADMINISTRATOR }
                                        className="shared-role-chip"
                                    />
                                );
                            }
                            ) }
                        />
                    )
                }
            </>
        );
    };

    return (
        <>
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
                        { resolveRoleSelectionPane() }
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default ConsoleRolesSelectiveShare;
