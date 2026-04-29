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

import Alert from "@oxygen-ui/react/Alert";
import Button from "@oxygen-ui/react/Button";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Typography from "@oxygen-ui/react/Typography";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import { OperationStatus } from "@wso2is/admin.core.v1/models/common";
import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";
import {
    OrganizationInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RolesV2Interface, RolesV2ResponseInterface } from "@wso2is/admin.roles.v2/models/roles";
import SelectiveOrgShareWithSelectiveRoles from
    "@wso2is/common.ui.shared-access.v1/components/selective-org-share-with-selective-roles";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    ProfileInfoInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    Heading,
    Hint
} from "@wso2is/react-components";
import { AnimatePresence, motion } from "framer-motion";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import RolesShareWithAll from "./roles-share-with-all";
import {
    editAgentRolesOfExistingOrganizations,
    shareAgentsWithAllOrganizations,
    shareAgentsWithSelectedOrganizationsAndRoles,
    unShareAgentsWithAllOrganizations,
    unshareAgentWithSelectedOrganizations
} from "../../api/agents";
import useGetAgentShare from "../../api/use-get-user-share";
import { RoleShareType, ShareType, ShareTypeSwitchApproach } from "../../constants/agent-roles";
import {
    AgentSharingPolicy,
    RoleSharingInterface,
    ShareAgentWithAllOrganizationsDataInterface,
    ShareAgentWithSelectedOrganizationsAndRolesDataInterface,
    ShareOrganizationsAndRolesPatchDataInterface,
    ShareOrganizationsAndRolesPatchOperationInterface,
    UnshareAgentWithAllOrganizationsDataInterface,
    UnshareOrganizationsDataInterface
} from "../../models/agents";
import { RoleInterface, SharedOrganizationInterface } from "../../models/endpoints";

enum RoleSharingModes {
    SELECTED = "SELECTED",
    NONE = "NONE"
}

export interface AgentShareFormPropsInterface
    extends IdentifiableComponentInterface {
    /**
     * Editing agent.
     */
    agent: ProfileInfoInterface;
    /**
     * Specifies if the agent sharing form should be triggered.
     */
    triggerAgentShare?: boolean;
    /**
     * Callback when the agent sharing completed.
     */
    onAgentSharingCompleted?: () => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Specifies if there is an ongoing sharing process.
     */
    isSharingInProgress?: boolean;
    /**
     * Specifies the current sharing status of the agent.
     */
    operationStatus?: OperationStatus;
    /**
     * Whether to include the Console Administrator role in the role sharing dropdowns.
     * Should only be true in the console settings administrator edit view.
     */
    enableConsoleAdminRole?: boolean;
}

export const ShareAgentForm: FunctionComponent<AgentShareFormPropsInterface> = (
    props: AgentShareFormPropsInterface
) => {

    const {
        agent,
        triggerAgentShare,
        onAgentSharingCompleted,
        readOnly,
        isSharingInProgress,
        operationStatus,
        enableConsoleAdminRole = false,
        ["data-componentid"]: componentId = "agent-share-form"
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ shareType, setShareType ] = useState<ShareType>(ShareType.UNSHARE);
    const [ savedShareType, setSavedShareType ] = useState<ShareType>(ShareType.UNSHARE);
    const [ roleShareTypeSelected, setRoleShareTypeSelected ] = useState<RoleShareType>(RoleShareType.SHARE_SELECTED);
    const { isOrganizationManagementEnabled } = useGlobalVariables();
    const [ showConfirmationModal, setShowConfirmationModal ] = useState<boolean>(false);
    const [ showShareTypeSwitchModal, setShowShareTypeSwitchModal ] = useState<boolean>(false);
    const [ showShareAllWarningModal, setShowShareAllWarningModal ] = useState<boolean>(false);
    const [ shareTypeSwitchApproach, setShareTypeSwitchApproach ] = useState<ShareTypeSwitchApproach>(
        ShareTypeSwitchApproach.WITHOUT_UNSHARE);
    const [ selectedRoles, setSelectedRoles ] = useState<RolesInterface[]>([]);
    const [ initialSelectedRoles, setInitialSelectedRoles ] = useState<RolesInterface[]>([]);
    const [ selectedOrgIds, setSelectedOrgIds ] = useState<string[]>([]);
    const [ roleSelections, setRoleSelections ] = useState<Record<string, SelectedOrganizationRoleInterface[]>>({});
    const [ shouldShareWithFutureChildOrgsMap, setShouldShareWithFutureChildOrgsMap ]
        = useState<Record<string, boolean>>({});
    const [ initialShouldShareWithFutureChildOrgsMap, setInitialShouldShareWithFutureChildOrgsMap ]
        = useState<Record<string, boolean>>({});
    const [ addedRoles, setAddedRoles ] = useState<Record<string, RoleSharingInterface[]>>({});
    const [ removedRoles, setRemovedRoles ] = useState<Record<string, RoleSharingInterface[]>>({});
    const [ addedOrgIds, setAddedOrgIds ] = useState<string[]>([]);
    const [ removedOrgIds, setRemovedOrgIds ] = useState<string[]>([]);
    // Tracks the roles that are actually assigned to the agent in each organization.
    // This is distinct from roleSelections, which represents the sharing policy roles.
    const [ agentAssignedRolesMap, setAgentAssignedRolesMap ]
        = useState<Record<string, RoleInterface[]>>({});

    // This is used to determine if the agent is shared with all organizations or not.
    // and this will change the radio button option based on the result.
    const {
        data: agentShareData,
        isLoading: isAgentShareDataFetchRequestLoading,
        isValidating: isAgentShareDataFetchRequestValidating,
        mutate: mutateAgentShareDataFetchRequest,
        error:  agentShareDataFetchRequestError
    } = useGetAgentShare(
        agent?.id,
        !isEmpty(agent?.id) && isOrganizationManagementEnabled,
        true,
        null,
        "sharingMode,roles",
        10
    );

    // Fetch all roles (both organization and application audience) available for sharing.
    const {
        data: originalAgentRoles,
        isLoading: isAgentRolesFetchRequestLoading,
        error: agentRolesFetchRequestError
    } = useGetRolesList<RolesV2ResponseInterface>(
        null,
        null,
        null,
        "agents,groups,permissions,associatedApplications",
        !isEmpty(agent?.id)
    );

    // Fetch the organization of the current organization.
    const {
        data: originalOrganizations,
        error: organizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled,
        null,
        15,
        null,
        null,
        false,
        false
    );

    // Check if there are organizations available to share the agent with.
    const isOrganizationsAvailable: boolean = useMemo(() => {
        if (!isOrganizationManagementEnabled || isEmpty(originalOrganizations)) {
            return false;
        }

        return originalOrganizations?.organizations?.length > 0;
    }, [ originalOrganizations, isOrganizationManagementEnabled ]);

    /**
     * Check if the organization list is loading.
     */
    const isLoading: boolean = useMemo(() => {
        if (!isOrganizationManagementEnabled) {
            return false;
        }

        return isAgentShareDataFetchRequestLoading ||
            isAgentRolesFetchRequestLoading ||
            isAgentShareDataFetchRequestValidating;
    }, [
        isAgentShareDataFetchRequestLoading,
        isAgentShareDataFetchRequestValidating,
        isAgentRolesFetchRequestLoading
    ]);

    // Roles available for sharing. Console application roles are excluded unless
    // enableConsoleAdminRole is true (e.g. in the console settings administrator edit view).
    const agentRolesList: RolesV2Interface[] = useMemo(() => {
        if (originalAgentRoles?.Resources?.length > 0) {
            return originalAgentRoles.Resources.filter((role: RolesV2Interface) =>
                enableConsoleAdminRole
                || !(role.audience?.type?.toUpperCase() === RoleAudienceTypes.APPLICATION
                    && role.audience?.display === UIConstants.CONSOLE_APP_AUDIENCE_DISPLAY)
            );
        }

        return [];
    }, [ originalAgentRoles, enableConsoleAdminRole ]);

    useEffect(() => {
        // If there is no agent share data, it means the agent is not shared with any organization.
        if (isEmpty(agentShareData)) {
            setShareType(ShareType.UNSHARE);
            setSavedShareType(ShareType.UNSHARE);

            return;
        }

        // If there are no organizations in the response and no sharing mode,
        // it means the agent is not shared with any organization.
        if (isEmpty(agentShareData.organizations) && !agentShareData.sharingMode) {
            setShareType(ShareType.UNSHARE);
            setSavedShareType(ShareType.UNSHARE);

            return;
        }

        // If there is no sharing mode, it selective organization sharing is done.
        if (!agentShareData.sharingMode) {
            setShareType(ShareType.SHARE_SELECTED);
            setSavedShareType(ShareType.SHARE_SELECTED);

            // Populate selected organizations and their role assignments for display
            if (agentShareData.organizations && Array.isArray(agentShareData.organizations)) {
                const orgIds: string[] =
                    agentShareData.organizations.map((org: SharedOrganizationInterface) => org.orgId);
                const rolesMap: Record<string, SelectedOrganizationRoleInterface[]> = {};
                const shouldShareWithFutureChildOrgsMap: Record<string, boolean> = {};
                const assignedRolesMap: Record<string, RoleInterface[]> = {};

                agentShareData.organizations.forEach((org: SharedOrganizationInterface) => {
                    // Track the sharing policy for each organization
                    shouldShareWithFutureChildOrgsMap[org.orgId] =
                        org.sharingMode?.policy ===
                            AgentSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN;
                    // Map roles from the sharingMode role assignment
                    const sharingModeRoles: RoleSharingInterface[] =
                        org.sharingMode?.roleAssignment?.roles as RoleSharingInterface[];

                    if (sharingModeRoles?.length > 0) {
                        const roles: SelectedOrganizationRoleInterface[] =
                            sharingModeRoles.map((role: RoleSharingInterface) => ({
                                ...role,
                                id: `${role.displayName}:${role.audience?.type}:${role.audience?.display}`,
                                selected: true // Mark all existing roles as selected
                            }));

                        rolesMap[org.orgId] = roles;
                    }

                    // Track the roles that are actually assigned to the agent in this organization.
                    if (org.roles?.length > 0) {
                        assignedRolesMap[org.orgId] = org.roles;
                    }
                });

                setSelectedOrgIds(orgIds);
                setRoleSelections(rolesMap);
                setShouldShareWithFutureChildOrgsMap(shouldShareWithFutureChildOrgsMap);
                setInitialShouldShareWithFutureChildOrgsMap(shouldShareWithFutureChildOrgsMap);
                setAgentAssignedRolesMap(assignedRolesMap);
            }

            return;
        }

        // Otherwise, agent is shared with all organizations
        const orgSharingPolicy: string = agentShareData.sharingMode?.policy;

        // If the agent is shared with all existing and future organizations, set the share type to SHARE_ALL.
        if (orgSharingPolicy === AgentSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS) {
            setShareType(ShareType.SHARE_ALL);
            setSavedShareType(ShareType.SHARE_ALL);

            const roleSharingMode: string = agentShareData?.sharingMode?.roleAssignment?.mode;

            // Based on the role sharing mode, set the role share type.
            if (roleSharingMode === RoleSharingModes.SELECTED) {
                // Store and display the shared roles
                const initialRoles: RolesInterface[] =
                    agentShareData?.sharingMode?.roleAssignment?.roles?.map(
                        (role: RoleSharingInterface) => ({
                            audience: {
                                display: role.audience.display,
                                type: role.audience.type
                            },
                            displayName: role.displayName,
                            id: role.displayName
                        }) as RolesInterface
                    );

                if (initialRoles?.length > 0) {
                    setInitialSelectedRoles(initialRoles);
                    setSelectedRoles(initialRoles); // Show the selected roles in the UI
                }
            }
        }
    }, [ agentShareData ]);

    // When agentRolesList or agentShareData becomes available (or changes), expand each pre-existing
    // org entry in roleSelections so that it contains the *full* role list — not just the
    // previously-saved roles stored by the agentShareData effect. Adding agentShareData as a
    // dependency ensures this re-runs even when agentRolesList loaded first (before the sparse
    // entries from agentShareData were written). React batches both setRoleSelections calls from
    // the same render cycle, so the functional updater here receives the sparse map as prev and
    // produces the fully-expanded map in one commit. Existing `selected` state is preserved.
    useEffect(() => {
        if (!agentRolesList?.length) {
            return;
        }

        setRoleSelections((prevRoleSelections: Record<string, SelectedOrganizationRoleInterface[]>) => {
            if (isEmpty(prevRoleSelections)) {
                return prevRoleSelections;
            }

            const updated: Record<string, SelectedOrganizationRoleInterface[]> = {};

            Object.keys(prevRoleSelections).forEach((orgId: string) => {
                const existing: SelectedOrganizationRoleInterface[] = prevRoleSelections[orgId];

                updated[orgId] = agentRolesList.map((role: RolesV2Interface) => {
                    const compositeId: string =
                        `${role.displayName}:${role.audience?.type}:${role.audience?.display}`;
                    const existingEntry: SelectedOrganizationRoleInterface | undefined = existing.find(
                        (r: SelectedOrganizationRoleInterface) => r.id === compositeId
                    );

                    return {
                        audience: {
                            display: role.audience?.display,
                            type: role.audience?.type
                        },
                        displayName: role.displayName,
                        id: compositeId,
                        selected: existingEntry?.selected ?? false
                    };
                });
            });

            return updated;
        });
    }, [ agentRolesList, agentShareData ]);


    /**
     * Listen for status updates from the parent.
     */
    useEffect(() => {
        if (operationStatus === OperationStatus.PARTIALLY_COMPLETED) {
            onAgentSharingCompleted?.();
        }
    }, [ operationStatus, onAgentSharingCompleted ]);


    /**
     * Dispatches error notifications if shared organizations fetch request fails.
     */
    useEffect(() => {
        if (!agentShareDataFetchRequestError) {
            return;
        }

        if (agentShareDataFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: agentShareDataFetchRequestError?.response?.data?.description
                    ?? t("agents:edit.sections.shareAgent.getSharedOrganizations.genericError.description"),
                level: AlertLevels.ERROR,
                message: agentShareDataFetchRequestError?.response?.data?.message
                    ?? t("agents:edit.sections.shareAgent.getSharedOrganizations.genericError.message")
            }));

            return;
        }

        dispatch(
            addAlert({
                description: t("agents:edit.sections.shareAgent" +
                        ".getSharedOrganizations.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("agents:edit.sections.shareAgent" +
                        ".getSharedOrganizations.genericError.message")
            })
        );
    }, [ agentShareDataFetchRequestError ]);

    useEffect(() => {
        if (agentRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("agents:edit.sections.sharedAccess.notifications" +
                        ".fetchAgentRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("agents:edit.sections.sharedAccess.notifications" +
                        ".fetchAgentRoles.genericError.message")
                })
            );
        }
    }, [ agentRolesFetchRequestError ]);

    useEffect(() => {
        if (organizationsFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("agents:edit.sections.sharedAccess.notifications" +
                        ".fetchOrganizations.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("agents:edit.sections.sharedAccess.notifications" +
                        ".fetchOrganizations.genericError.message")
                })
            );
        }
    }, [ organizationsFetchRequestError ]);

    useEffect(() => {
        if (triggerAgentShare) {
            handleAgentSharing();
        }
    }, [ triggerAgentShare ]);

    /**
     * Reset role sharing states when switching away from SHARE_ALL or SHARE_SELECTED modes.
     */
    useEffect(() => {
        // Reset role sharing states when switching away from SHARE_ALL
        if (shareType !== ShareType.SHARE_ALL) {
            setSelectedRoles([]);
            setInitialSelectedRoles([]);
        }

        // Reset selected organization role sharing states when switching away from SHARE_SELECTED
        if (shareType !== ShareType.SHARE_SELECTED) {
            setRoleShareTypeSelected(RoleShareType.SHARE_SELECTED);
        }
    }, [ shareType ]);

    /**
     * Triggers the display of a confirmation modal when the agent attempts to start a new share
     * while one is ongoing, asking for confirmation to interrupt the current share.
     */
    const handleInterruptOngoingShare = () => {
        setShowConfirmationModal(true);
    };

    /**
     * Resets the states of the component to their initial values.
     */
    const resetStates = (shouldMutate: boolean = true): void => {
        setSelectedRoles([]);
        setInitialSelectedRoles([]);
        setSelectedOrgIds([]);
        setRoleSelections({});
        setAddedRoles({});
        setRemovedRoles({});
        setAddedOrgIds([]);
        setRemovedOrgIds([]);
        setShouldShareWithFutureChildOrgsMap({});
        setInitialShouldShareWithFutureChildOrgsMap({});
        setAgentAssignedRolesMap({});
        shouldMutate && mutateAgentShareDataFetchRequest();
    };

    const handleAgentSharing = (): void => {
        if (shareType === ShareType.SHARE_SELECTED && selectedOrgIds?.length === 0) {
            dispatch(addAlert({
                description: t("agents:edit.sections.sharedAccess.notifications." +
                        "noOrganizationsSelected.description"),
                level: AlertLevels.ERROR,
                message: t("agents:edit.sections.sharedAccess.notifications." +
                        "noOrganizationsSelected.message")
            }));

            return;
        }

        if (shareType === ShareType.UNSHARE) {
            // Unshare the agent with all organizations
            unshareWithAllOrganizations();
        } else if (shareType === ShareType.SHARE_ALL) {
            // Always show warning modal for share with all organizations operations
            setShowShareAllWarningModal(true);
        } else if (shareType === ShareType.SHARE_SELECTED) {
            // logic to handle sharing the agent with selected organizations
            if (roleShareTypeSelected === RoleShareType.SHARE_SELECTED) {
                // Share selected roles with selected organizations
                shareSelectedRolesWithSelectedOrgs();
            }

            if (roleShareTypeSelected === RoleShareType.SHARE_WITH_ALL) {
                // Share all roles with selected organizations
                shareAllorNoRolesWithSelectedOrgs(true);
            }

            if (roleShareTypeSelected === RoleShareType.SHARE_NONE) {
                // Do not share any roles with selected organizations
                shareAllorNoRolesWithSelectedOrgs(false);
            }
        }
    };

    const unshareWithAllOrganizations = async (): Promise<boolean> => {
        const data: UnshareAgentWithAllOrganizationsDataInterface = {
            agentId: agent.id
        };

        try {
            await unShareAgentsWithAllOrganizations(data);
            dispatch(addAlert({
                description: t("agents:edit.sections.sharedAccess.notifications.unshare.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("agents:edit.sections.sharedAccess.notifications.unshare.success.message")
            }));
            resetStates(false);
            setSavedShareType(ShareType.UNSHARE);

            return true;
        } catch (error) {
            dispatch(addAlert({
                description: t("agents:edit.sections.sharedAccess.notifications.unshare.error.description", {
                    error: (error as Error).message
                }),
                level: AlertLevels.ERROR,
                message: t("agents:edit.sections.sharedAccess.notifications.unshare.error.message")
            }));

            return false;
        } finally {
            // onAgentSharingCompleted();
        }
    };

    const shareSelectedRolesWithSelectedOrgs = async (): Promise<void> => {
        const isSwitchingFromAllToSelected: boolean =
            savedShareType === ShareType.SHARE_ALL && shareType === ShareType.SHARE_SELECTED;

        // When converting from SHARE_ALL to SHARE_SELECTED, persist the selected organizations
        // and their role assignment policy via POST so the server updates the sharing mode
        // and role policy in one operation.
        if (isSwitchingFromAllToSelected) {
            const data: ShareAgentWithSelectedOrganizationsAndRolesDataInterface = {
                organizations: selectedOrgIds.map((orgId: string) => {
                    const selectedRoles: RoleSharingInterface[] = roleSelections[orgId]?.filter(
                        (role: SelectedOrganizationRoleInterface) => role.selected
                    ).map((mappedRole: SelectedOrganizationRoleInterface) => ({
                        audience: {
                            display: mappedRole.audience?.display,
                            type: mappedRole.audience?.type
                        },
                        displayName: mappedRole.displayName
                    })) || [];

                    return {
                        orgId,
                        policy: shouldShareWithFutureChildOrgsMap[orgId]
                            ? AgentSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                            : AgentSharingPolicy.SELECTED_ORG_ONLY,
                        roleAssignment: {
                            mode: selectedRoles.length > 0
                                ? RoleSharingModes.SELECTED
                                : RoleSharingModes.NONE,
                            roles: selectedRoles
                        }
                    };
                }),
                agentId: agent.id
            };

            try {
                await shareAgentsWithSelectedOrganizationsAndRoles(data);
                dispatch(addAlert({
                    description: t("agents:edit.sections.sharedAccess.notifications.share.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("agents:edit.sections.sharedAccess.notifications.share.success.message")
                }));
                resetStates();
            } catch (error) {
                dispatch(addAlert({
                    description: t("agents:edit.sections.sharedAccess.notifications.share." +
                        "error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("agents:edit.sections.sharedAccess.notifications.share.error.message")
                }));
            }

            return;
        }

        const existingSharedOrgIds: Set<string> = new Set(
            (agentShareData?.organizations ?? []).map((org: SharedOrganizationInterface) => org.orgId)
        );
        const effectiveAddedOrgIds: string[] = addedOrgIds.filter(
            (orgId: string) => !existingSharedOrgIds.has(orgId)
        );
        const effectiveRemovedOrgIds: string[] = removedOrgIds.filter(
            (orgId: string) => existingSharedOrgIds.has(orgId)
        );
        const tempAddedRoles: Record<string, RoleSharingInterface[]> = { ...addedRoles };
        const tempRemovedRoles: Record<string, RoleSharingInterface[]> = { ...removedRoles };
        const tempShareWithFutureChildOrgsMap: Record<string, boolean> = { ...shouldShareWithFutureChildOrgsMap };
        const sharedPromises: Promise<any>[] = [];
        let orgSharingSuccess: boolean = true;

        // If there are added orgs we need to add both orgs and roles
        if (effectiveAddedOrgIds.length > 0) {
            const data: ShareAgentWithSelectedOrganizationsAndRolesDataInterface = {
                organizations: effectiveAddedOrgIds.map((orgId: string) => {
                    return {
                        orgId: orgId,
                        policy: tempShareWithFutureChildOrgsMap[orgId]
                            ? AgentSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                            : AgentSharingPolicy.SELECTED_ORG_ONLY,
                        roleAssignment: {
                            mode: tempAddedRoles[orgId] && tempAddedRoles[orgId].length > 0
                                ? RoleSharingModes.SELECTED
                                : RoleSharingModes.NONE,
                            roles: tempAddedRoles[orgId] && tempAddedRoles[orgId].length > 0
                                ? tempAddedRoles[orgId] as RoleSharingInterface[]
                                : []
                        }
                    };
                }),
                agentId: agent.id
            };

            sharedPromises.push(
                shareAgentsWithSelectedOrganizationsAndRoles(data)
                    .then(() => {
                        // Upon sucessful sharing, Remove the roles of the added orgs from tempAddedRoles
                        // and tempShareWithFutureChildOrgsMap
                        // as they are already processed along with the org sharing
                        effectiveAddedOrgIds.forEach((orgId: string) => {
                            delete tempAddedRoles[orgId];
                            delete tempShareWithFutureChildOrgsMap[orgId];
                        });
                    })
                    .catch((error: Error) => {
                        orgSharingSuccess = false;

                        dispatch(addAlert({
                            description: t("agents:edit.sections.sharedAccess.notifications.share." +
                                "error.description",
                            { error: error.message }),
                            level: AlertLevels.ERROR,
                            message: t("agents:edit.sections.sharedAccess.notifications.share.error.message")
                        }));
                    })
            );
        }

        // If there are removed orgs we need to unshare the agent with those orgs
        if (effectiveRemovedOrgIds.length > 0) {
            const data: UnshareOrganizationsDataInterface = {
                orgIds: effectiveRemovedOrgIds,
                agentId: agent.id
            };

            sharedPromises.push(
                unshareAgentWithSelectedOrganizations(data)
                    .then(() => {
                        // Upon sucessful unsharing, Remove the orgs from tempRemovedRoles
                        // and tempShareWithFutureChildOrgsMap
                        // as they are already removed along with the org unsharing and no need of patch operation
                        effectiveRemovedOrgIds.forEach((orgId: string) => {
                            delete tempRemovedRoles[orgId];
                            delete tempShareWithFutureChildOrgsMap[orgId];
                        });
                    })
                    .catch((error: Error) => {
                        orgSharingSuccess = false;

                        dispatch(addAlert({
                            description: t("agents:edit.sections.sharedAccess.notifications.unshare." +
                                "error.description",
                            { error: error.message }),
                            level: AlertLevels.ERROR,
                            message: t("agents:edit.sections.sharedAccess.notifications.unshare." +
                                "error.message")
                        }));
                    })
            );
        }

        // Wait for sharing/unsharing to complete
        await Promise.all(sharedPromises);

        // If there are any entries remaining in tempShareWithFutureChildOrgsMap, that means the agent has only changed
        // the sharing policy of the existing organizations without adding or removing any organizations.
        // In that case, we need to update the sharing policy of those organizations.
        const policyChangedOrgIds: string[] = Object.keys(tempShareWithFutureChildOrgsMap).filter(
            (orgId: string) => {
                if (effectiveAddedOrgIds.includes(orgId) || effectiveRemovedOrgIds.includes(orgId)) {
                    return false;
                }

                if (!(orgId in initialShouldShareWithFutureChildOrgsMap)) {
                    return false;
                }

                return initialShouldShareWithFutureChildOrgsMap[orgId] !==
                    tempShareWithFutureChildOrgsMap[orgId];
            }
        );

        if (policyChangedOrgIds.length > 0) {

            const data: ShareAgentWithSelectedOrganizationsAndRolesDataInterface = {
                organizations: policyChangedOrgIds.map((orgId: string) => {
                    // Get the selected roles for the organization
                    const selectedRoles: RoleSharingInterface[] = roleSelections[orgId]?.filter(
                        (role: SelectedOrganizationRoleInterface) => role.selected).map(
                        (mappedRole: SelectedOrganizationRoleInterface) => ({
                            audience: {
                                display: mappedRole.audience?.display,
                                type: mappedRole.audience?.type
                            },
                            displayName: mappedRole.displayName
                        })
                    ) || [];

                    return {
                        orgId: orgId,
                        policy: tempShareWithFutureChildOrgsMap[orgId]
                            ? AgentSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                            : AgentSharingPolicy.SELECTED_ORG_ONLY,
                        roleAssignment: {
                            mode: selectedRoles.length > 0
                                ? RoleSharingModes.SELECTED
                                : RoleSharingModes.NONE,
                            roles: selectedRoles
                        }
                    };
                }),
                agentId: agent.id
            };

            try {
                await shareAgentsWithSelectedOrganizationsAndRoles(data);
            } catch (error) {
                orgSharingSuccess = false;

                dispatch(addAlert({
                    description: t("agents:edit.sections.sharedAccess.notifications.share." +
                        "error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("agents:edit.sections.sharedAccess.notifications.share.error.message")
                }));
            }
        }

        // If the org sharing was not successful, do not proceed with role patch operations
        if (!orgSharingSuccess) {
            // onAgentSharingCompleted();

            return;
        }

        // Handle individual role changes for existing organizations
        // Only call patch operations if there are remaining roles to add/remove for existing organizations
        const remainingAddedRoles: Record<string, RoleSharingInterface[]> = { ...tempAddedRoles };
        const remainingRemovedRoles: Record<string, RoleSharingInterface[]> = { ...tempRemovedRoles };

        // Check if there are any role operations left to perform
        const hasRemainingOperations: boolean =
            Object.keys(remainingAddedRoles).some((orgId: string) => remainingAddedRoles[orgId]?.length > 0) ||
            Object.keys(remainingRemovedRoles).some((orgId: string) => remainingRemovedRoles[orgId]?.length > 0);

        if (hasRemainingOperations) {
            shareIndividualRolesWithSelectedOrgs();
        } else {
            // No additional role operations needed, just show success and reset state
            dispatch(addAlert({
                description: t("agents:edit.sections.sharedAccess.notifications.share.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("agents:edit.sections.sharedAccess.notifications.share.success.message")
            }));

            resetStates();
        }
    };

    const shareAllorNoRolesWithSelectedOrgs = async (shareAllRoles: boolean): Promise<void> => {
        const sharedPromises: Promise<any>[] = [];
        const tempShareWithFutureChildOrgsMap: Record<string, boolean> = { ...shouldShareWithFutureChildOrgsMap };
        let orgSharingSuccess: boolean = true;

        if (addedOrgIds.length > 0) {
            const data: ShareAgentWithSelectedOrganizationsAndRolesDataInterface = {
                organizations: addedOrgIds.map((orgId: string) => {
                    return {
                        orgId: orgId,
                        policy: tempShareWithFutureChildOrgsMap[orgId]
                            ? AgentSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                            : AgentSharingPolicy.SELECTED_ORG_ONLY,
                        roleAssignment: {
                            mode: shareAllRoles
                                ? RoleSharingModes.SELECTED
                                : RoleSharingModes.NONE,
                            roles: shareAllRoles ? (agentRolesList?.map((role: RoleSharingInterface) => ({
                                audience: {
                                    display: role.audience?.display ?? agent?.agentName,
                                    type: role.audience?.type
                                },
                                displayName: role.displayName
                            })) || []) : []
                        }
                    };
                }),
                agentId: agent.id
            };

            sharedPromises.push(
                shareAgentsWithSelectedOrganizationsAndRoles(data)
                    .then(() => {
                        // Upon sucessful sharing, Remove the orgs from tempShareWithFutureChildOrgsMap
                        // as they are already processed along with the org sharing
                        addedOrgIds.forEach((orgId: string) => {
                            delete tempShareWithFutureChildOrgsMap[orgId];
                        });
                    })
                    .catch((error: Error) => {
                        orgSharingSuccess = false;

                        dispatch(addAlert({
                            description: t("agents:edit.sections.sharedAccess.notifications.share." +
                                "error.description",
                            { error: error.message }),
                            level: AlertLevels.ERROR,
                            message: t("agents:edit.sections.sharedAccess.notifications.share.error.message")
                        }));
                    })
            );
        }

        // Call unshare API for removed organizations
        if (removedOrgIds.length > 0) {
            const data: UnshareOrganizationsDataInterface = {
                orgIds: removedOrgIds,
                agentId: agent.id
            };

            unshareAgentWithSelectedOrganizations(data)
                .then(() => {
                    // Upon sucessful unsharing, Remove the orgs from tempShareWithFutureChildOrgsMap
                    // as they are already removed along with the org unsharing and no need of patch operation
                    removedOrgIds.forEach((orgId: string) => {
                        delete tempShareWithFutureChildOrgsMap[orgId];
                    });
                })
                .catch((error: Error) => {
                    orgSharingSuccess = false;

                    dispatch(addAlert({
                        description: t("agents:edit.sections.sharedAccess.notifications.unshare." +
                            "error.description",
                        { error: error.message }),
                        level: AlertLevels.ERROR,
                        message: t("agents:edit.sections.sharedAccess.notifications.unshare.error.message")
                    }));
                });
        }

        // Wait for sharing/unsharing to complete
        await Promise.all(sharedPromises);

        // If there are any entries remaining in tempShareWithFutureChildOrgsMap, that means the agent has only changed
        // the sharing policy of the existing organizations without adding or removing any organizations.
        // In that case, we need to update the sharing policy of those organizations.
        if (Object.keys(tempShareWithFutureChildOrgsMap).length > 0) {

            const data: ShareAgentWithSelectedOrganizationsAndRolesDataInterface = {
                organizations: Object.keys(tempShareWithFutureChildOrgsMap).map((orgId: string) => {
                    return {
                        orgId: orgId,
                        policy: tempShareWithFutureChildOrgsMap[orgId]
                            ? AgentSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                            : AgentSharingPolicy.SELECTED_ORG_ONLY,
                        roleAssignment: {
                            mode: shareAllRoles
                                ? RoleSharingModes.SELECTED
                                : RoleSharingModes.NONE,
                            roles: shareAllRoles ? (agentRolesList?.map((role: RoleSharingInterface) => ({
                                audience: {
                                    display: role.audience?.display ?? agent?.agentName,
                                    type: role.audience?.type
                                },
                                displayName: role.displayName
                            })) || []) : []
                        }
                    };
                }),
                agentId: agent.id
            };

            try {
                await shareAgentsWithSelectedOrganizationsAndRoles(data);
            } catch (error) {
                orgSharingSuccess = false;

                dispatch(addAlert({
                    description: t("agents:edit.sections.sharedAccess.notifications.share." +
                        "error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("agents:edit.sections.sharedAccess.notifications.share.error.message")
                }));
            }
        }

        // If org sharing was successful, show success notification
        if (orgSharingSuccess) {
            dispatch(addAlert({
                description: t("agents:edit.sections.sharedAccess.notifications.share.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("agents:edit.sections.sharedAccess.notifications.share.success.message")
            }));

            resetStates();
        }

        // Fire the agent sharing completed callback
        // onAgentSharingCompleted();
    };

    const shareSelectedRolesWithAllOrgs = async (): Promise<boolean> => {
        // If the selected roles are the same as the initial roles, no changes needed
        if (!isEmpty(selectedRoles) && JSON.stringify(selectedRoles) === JSON.stringify(initialSelectedRoles)) {
            return true;
        }

        const data: ShareAgentWithAllOrganizationsDataInterface = {
            policy: AgentSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleAssignment: selectedRoles.length > 0 ? {
                mode: RoleSharingModes.SELECTED,
                roles: selectedRoles.map((role: RolesInterface) => {
                    return {
                        audience: {
                            display: role.audience.display ?? agent?.agentName,
                            type: role.audience.type
                        },
                        displayName: role.displayName
                    };
                })
            } : {
                mode: RoleSharingModes.NONE,
                roles: []
            },
            agentId: agent.id
        };

        try {
            await shareAgentsWithAllOrganizations(data);
            dispatch(addAlert({
                description: t("agents:edit.sections.sharedAccess.notifications.share." +
                    "success.description"),
                level: AlertLevels.SUCCESS,
                message: t("agents:edit.sections.sharedAccess.notifications.share.success.message")
            }));
            resetStates();

            return true;
        } catch (error) {
            dispatch(addAlert({
                description: t("agents:edit.sections.sharedAccess.notifications.share." +
                    "error.description",
                { error: error.message }),
                level: AlertLevels.ERROR,
                message: t("agents:edit.sections.sharedAccess.notifications.share.error.message")
            }));

            return false;
        } finally {
            // onAgentSharingCompleted();
        }
    };

    const shareIndividualRolesWithSelectedOrgs = (): void => {
        const tempAddedRoles: Record<string, RoleSharingInterface[]> = { ...addedRoles };
        const tempRemovedRoles: Record<string, RoleSharingInterface[]> = { ...removedRoles };

        const addOperations: ShareOrganizationsAndRolesPatchOperationInterface[] = Object.entries(tempAddedRoles)
            .map(([ orgId, roles ]: [string, RoleSharingInterface[]]) => {
                const roleData: RoleSharingInterface[] = roles.map(
                    (role: RoleSharingInterface) => ({
                        audience: {
                            display: role.audience.display,
                            type: role.audience.type
                        },
                        displayName: role.displayName
                    })
                );

                if (isEmpty(roleData)) {
                    return null;
                }

                return {
                    op: "add",
                    path: `organizations[orgId eq ${orgId}].roles`,
                    value: roleData
                };
            }).filter((item: any) => item !== null);

        const removeOperations: ShareOrganizationsAndRolesPatchOperationInterface[] = Object.entries(tempRemovedRoles)
            .map(([ orgId, roles ]: [string, RoleSharingInterface[]]) => {
                const roleData: RoleSharingInterface[] = roles.map(
                    (role: RoleSharingInterface) => ({
                        audience: {
                            display: role.audience.display,
                            type: role.audience.type
                        },
                        displayName: role.displayName
                    })
                );

                if (isEmpty(roleData)) {
                    return null;
                }

                return {
                    op: "remove",
                    path: `organizations[orgId eq ${orgId}].roles`,
                    value: roleData
                };
            }).filter((item: any) => item !== null);

        const data: ShareOrganizationsAndRolesPatchDataInterface = {
            Operations: [
                ...addOperations,
                ...removeOperations
            ],
            agentId: agent.id
        };

        if (data?.Operations?.length > 0) {
            editAgentRolesOfExistingOrganizations(data)
                .then(() => {
                    dispatch(addAlert({
                        description: t("agents:edit.sections.sharedAccess.notifications.share." +
                            "success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("agents:edit.sections.sharedAccess.notifications.share.success.message")
                    }));

                    resetStates();
                })
                .catch((error: Error) => {
                    dispatch(addAlert({
                        description: t("agents:edit.sections.sharedAccess.notifications.share." +
                            "error.description",
                        { error: error.message }),
                        level: AlertLevels.ERROR,
                        message: t("agents:edit.sections.sharedAccess.notifications.share.error.message")
                    }));
                })
                .finally(() => {
                    // onAgentSharingCompleted();
                });
        } else {
            // If there are no further operations to perform, just show a success notification
            // and reset the state.
            dispatch(addAlert({
                description: t("agents:edit.sections.sharedAccess.notifications.share." +
                    "success.description"),
                level: AlertLevels.SUCCESS,
                message: t("agents:edit.sections.sharedAccess.notifications.share.success.message")
            }));

            resetStates();
            // onAgentSharingCompleted();
        }
    };

    // Function to mark a specific role as selected/unselected across all organizations
    const updateRoleSelectionForAllOrganizations = (
        updatedRole: RolesV2Interface,
        isSelected: boolean
    ): void => {
        const updatedRoleSelections: Record<string, SelectedOrganizationRoleInterface[]> = { ...roleSelections };

        Object.keys(updatedRoleSelections).forEach((orgId: string) => {
            updatedRoleSelections[orgId] = updatedRoleSelections[orgId].map(
                (role: SelectedOrganizationRoleInterface) => {
                    if (role.displayName === updatedRole.displayName) {
                        return {
                            ...role,
                            selected: isSelected
                        };
                    }

                    return role;
                }
            );
        });

        setRoleSelections(updatedRoleSelections);

        if (isSelected) {
            // If the role is selected, we have to remove it from the removedRoles for all organizations
            const updatedRemovedRoles: Record<string, RoleSharingInterface[]> = { ...removedRoles };

            Object.keys(updatedRemovedRoles).forEach((orgId: string) => {
                updatedRemovedRoles[orgId] = updatedRemovedRoles[orgId].filter(
                    (role: RoleSharingInterface) => role.displayName !== updatedRole.displayName
                );
            });

            setRemovedRoles(updatedRemovedRoles);
        } else {
            // If the role is unselected, we have to remove it from the addedRoles for all organizations
            const updatedAddedRoles: Record<string, RoleSharingInterface[]> = { ...addedRoles };

            Object.keys(updatedAddedRoles).forEach((orgId: string) => {
                updatedAddedRoles[orgId] = updatedAddedRoles[orgId].filter(
                    (role: RoleSharingInterface) => role.displayName !== updatedRole.displayName
                );
            });

            setAddedRoles(updatedAddedRoles);
        }
    };

    const switchShareTypeFromAllToSelected = async (): Promise<void> => {
        if (shareTypeSwitchApproach === ShareTypeSwitchApproach.WITH_UNSHARE) {
            // Unshare the agent with all organizations and switch to selective sharing
            const unshareSuccess: boolean = await unshareWithAllOrganizations();

            if (unshareSuccess) {
                setShareType(ShareType.SHARE_SELECTED);
                setRoleShareTypeSelected(RoleShareType.SHARE_SELECTED);
            }

            setShowShareTypeSwitchModal(false);
        } else if (shareTypeSwitchApproach === ShareTypeSwitchApproach.WITHOUT_UNSHARE) {
            // Switch to selective sharing without an immediate API call.
            // Populate the UI with the currently shared organizations and their role assignments
            // so the agent can review/adjust before saving. The actual API call is deferred
            // until the agent clicks the Save button.

            // In SHARE_ALL mode, roles are stored globally in sharingMode.roleAssignment.roles.
            const globalRoles: RoleSharingInterface[] =
                (agentShareData.sharingMode?.roleAssignment?.roles as RoleSharingInterface[]) ?? [];

            // Build a lookup set of globally assigned role composite ids for accurate matching.
            // Using the composite id (displayName:type:display) prevents false positives when
            // two roles share the same displayName but belong to different audiences.
            const globalRoleIdSet: Set<string> = new Set(
                globalRoles.map((r: RoleSharingInterface) =>
                    `${r.displayName}:${r.audience?.type}:${r.audience?.display}`
                )
            );

            // Build the full role selection list from all available roles, marking globally
            // assigned roles as selected. The composite id format is required so that each
            // role can be uniquely identified when the agent modifies the selection.
            const fullRoleSelections: SelectedOrganizationRoleInterface[] = agentRolesList.map(
                (role: RolesV2Interface) => {
                    const id: string =
                        `${role.displayName}:${role.audience?.type}:${role.audience?.display}`;

                    return {
                        audience: {
                            display: role.audience?.display,
                            type: role.audience?.type
                        },
                        displayName: role.displayName,
                        id,
                        selected: globalRoleIdSet.has(id)
                    };
                }
            );

            // Determine org IDs to pre-select: prefer organizations from agentShareData,
            // but fall back to the top-level organizations since SHARE_ALL policy
            // may return an empty organizations list from the API.
            const sharedOrgIds: string[] =
                agentShareData?.organizations?.length > 0
                    ? agentShareData.organizations.map((org: SharedOrganizationInterface) => org.orgId)
                    : (originalOrganizations?.organizations?.map(
                        (org: OrganizationInterface) => org.id
                    ) ?? []);

            const rolesMap: Record<string, SelectedOrganizationRoleInterface[]> = {};
            // addedRolesMap is initialised to globalRoles for each org so that:
            // - resolveRoleRemoval (in the UI widget) will trim roles from addedRoles
            //   rather than pushing them into removedRoles, keeping removedRoles clean.
            // - On Save, shareSelectedRolesWithSelectedOrgs POSTs addedOrgIds with the
            //   complete (and agent-adjusted) role set from addedRoles.
            const addedRolesMap: Record<string, RoleSharingInterface[]> = {};
            const futureChildOrgsMap: Record<string, boolean> = {};

            sharedOrgIds.forEach((orgId: string) => {
                if (fullRoleSelections.length > 0) {
                    rolesMap[orgId] = fullRoleSelections;
                }
                addedRolesMap[orgId] = [ ...globalRoles ];
                futureChildOrgsMap[orgId] = true;
            });

            setRemovedOrgIds([]);
            setRemovedRoles({});
            setSelectedOrgIds(sharedOrgIds);
            setAddedOrgIds(sharedOrgIds);
            setRoleSelections(rolesMap);
            setAddedRoles(addedRolesMap);
            setShouldShareWithFutureChildOrgsMap(futureChildOrgsMap);

            setShareType(ShareType.SHARE_SELECTED);
            setRoleShareTypeSelected(RoleShareType.SHARE_SELECTED);
            setShowShareTypeSwitchModal(false);
        }
    };

    /**
     * Renders a confirmation modal asking the agent to confirm if they want to interrupt the
     * ongoing agent share. Provides options to confirm or cancel the operation.
     */
    const renderConfirmationModal = (): ReactElement | null => {
        return (
            <>
                <ConfirmationModal
                    data-componentid={ `${componentId}-in-progress-reshare-confirmation-modal` }
                    onClose={ (): void => {
                        setShowConfirmationModal(false);
                    } }
                    type="warning"
                    open={ showConfirmationModal }
                    assertionHint={ t("agents:confirmations.inProgressReshare.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onPrimaryActionClick={ (): void => {
                        handleAgentSharing();
                        setShowConfirmationModal(false);
                    } }
                    onSecondaryActionClick={ (): void => {
                        setShowConfirmationModal(false);
                    } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("agents:confirmations.inProgressReshare.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("agents:confirmations.inProgressReshare.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("agents:confirmations.inProgressReshare.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </>
        );
    };

    /**
     * Renders a confirmation modal asking the agent to confirm if they want to switch the share type
     */
    const renderShareTypeSwitchModal = (): ReactElement | null => {
        return (
            <>
                <ConfirmationModal
                    data-componentid={ `${componentId}-share-type-switch-modal` }
                    onClose={ (): void => {
                        setShowShareTypeSwitchModal(false);
                    } }
                    type="negative"
                    open={ showShareTypeSwitchModal }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onPrimaryActionClick={ (): void => {
                        if (isEmpty(shareTypeSwitchApproach)) {
                            return;
                        }

                        switchShareTypeFromAllToSelected();
                    } }
                    onSecondaryActionClick={ (): void => {
                        setShowShareTypeSwitchModal(false);
                    } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("agents:edit.sections.sharedAccess.shareTypeSwitchModal.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("agents:edit.sections.sharedAccess.shareTypeSwitchModal.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("agents:edit.sections.sharedAccess.shareTypeSwitchModal.description") }
                        <RadioGroup
                            value={ shareTypeSwitchApproach }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                setShareTypeSwitchApproach(event.target.value as ShareTypeSwitchApproach);
                            } }
                            data-componentid={ `${componentId}-share-type-switch-group` }
                            className="mt-3"
                        >
                            <FormControlLabel
                                value={ ShareTypeSwitchApproach.WITHOUT_UNSHARE }
                                label={ (
                                    <Typography variant="body1">
                                        <b>{ t("agents:edit.sections.sharedAccess." +
                                                "shareTypeSwitchModal.preserveStateLabel1") }: </b>
                                        { t("agents:edit.sections.sharedAccess." +
                                                "shareTypeSwitchModal.preserveStateLabel2") }
                                    </Typography>
                                ) }
                                control={ <Radio /> }
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-share-type-switch-without-unshare` }
                                className="mb-3"
                            />
                            <FormControlLabel
                                value={ ShareTypeSwitchApproach.WITH_UNSHARE }
                                label={ (
                                    <Typography variant="body1">
                                        <b>{ t("agents:edit.sections.sharedAccess." +
                                                "shareTypeSwitchModal.resetToDefaultLabel1") }: </b>
                                        { t("agents:edit.sections.sharedAccess." +
                                                "shareTypeSwitchModal.resetToDefaultLabel2") }
                                    </Typography>
                                ) }
                                control={ <Radio /> }
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-share-type-switch-with-unshare` }
                            />
                        </RadioGroup>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </>
        );
    };

    /**
     * Renders a warning modal to convey agent that they are doing a SHARE ALL operation
     */
    const renderShareAllWarningModal = (): ReactElement | null => {
        return (
            <>
                <ConfirmationModal
                    data-componentid={ `${componentId}-share-all-warning-modal` }
                    onClose={ (): void => {
                        setShowShareAllWarningModal(false);
                    } }
                    type="warning"
                    open={ showShareAllWarningModal }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onPrimaryActionClick={ (): void => {
                        shareSelectedRolesWithAllOrgs();
                        setShowShareAllWarningModal(false);
                    } }
                    onSecondaryActionClick={ (): void => {
                        setShowShareAllWarningModal(false);
                    } }
                    assertionHint={
                        t("agents:edit.sections.sharedAccess.showShareAllWarningModal.assertionHint") }
                    assertionType="checkbox"
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("agents:edit.sections.sharedAccess.showShareAllWarningModal.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("agents:edit.sections.sharedAccess.showShareAllWarningModal.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("agents:edit.sections.sharedAccess.showShareAllWarningModal.description") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </>
        );
    };

    if (isLoading) {
        return (
            <ContentLoader inline="centered" active/>
        );
    };

    return (
        <>
            <Grid
                container
                className="share-agent-form"
            >
                <Grid xl={ 8 } xs={ 12 }>
                    <Heading as="h4">
                        { t("agents:edit.sections.sharedAccess.title") }
                    </Heading>
                    <Heading ellipsis as="h6">
                        { t("agents:edit.sections.sharedAccess.subTitle") }
                    </Heading>
                    <FormControl fullWidth>
                        <RadioGroup
                            value={ shareType }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                const selectedShareType: ShareType = event.target.value as ShareType;

                                if (savedShareType === ShareType.SHARE_ALL &&
                                    selectedShareType === ShareType.SHARE_SELECTED) {
                                    // If the server has SHARE_ALL saved and the agent selects
                                    // SHARE_SELECTED (regardless of any intermediate local value),
                                    // prompt the agent to select the switching approach.
                                    setShowShareTypeSwitchModal(true);

                                    return;
                                }

                                setShareType(selectedShareType);
                            } }
                            data-componentid={ `${componentId}-radio-group` }
                        >
                            <FormControlLabel
                                value={ ShareType.UNSHARE }
                                label={ t("agents:edit.sections.sharedAccess.doNotShareAgent") }
                                control={ <Radio /> }
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-unshare-with-all-orgs-checkbox` }
                            />
                            <FormControlLabel
                                value={ ShareType.SHARE_ALL }
                                label={ t("agents:edit.sections.sharedAccess.shareAllAgent") }
                                control={ <Radio /> }
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-share-with-all-orgs-checkbox` }
                            />
                            <AnimatePresence mode="wait">
                                {
                                    shareType === ShareType.SHARE_ALL
                                    && (
                                        <motion.div
                                            key="selected-orgs-block"
                                            initial={ { height: 0, opacity: 0 } }
                                            animate={ { height: "auto", opacity: 1 } }
                                            exit={ { height: 0, opacity: 0 } }
                                            transition={ { duration: 0.3 } }
                                            className="ml-5"
                                        >
                                            <Alert severity="info" className="mb-3">
                                                { t("agents:edit.sections.sharedAccess.roleAvailabilityInfo") }
                                            </Alert>
                                            <div className="role-share-all-container">
                                                <RolesShareWithAll
                                                    user={ agent }
                                                    selectedRoles={ selectedRoles }
                                                    setSelectedRoles={ setSelectedRoles }
                                                    onRoleChange={ updateRoleSelectionForAllOrganizations }
                                                    enableConsoleAdminRole={ enableConsoleAdminRole }
                                                />
                                            </div>
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                            <FormControlLabel
                                value={ ShareType.SHARE_SELECTED }
                                label={
                                    isOrganizationsAvailable
                                        ? t("agents:edit.sections.sharedAccess.shareSelectedAgent")
                                        : (
                                            <>
                                                { t("agents:edit.sections.sharedAccess." +
                                                    "shareSelectedAgent") }
                                                <Hint inline popup>
                                                    { t("organizations:placeholders.emptyList.subtitles.0") }
                                                </Hint>
                                            </>
                                        )
                                }
                                control={ <Radio /> }
                                disabled={ readOnly || !isOrganizationsAvailable }
                                data-componentid={ `${ componentId }-share-with-selected-orgs-checkbox` }
                            />
                            <AnimatePresence mode="wait">
                                {
                                    shareType === ShareType.SHARE_SELECTED
                                    && (
                                        <motion.div
                                            key="selected-orgs-block"
                                            initial={ { height: 0, opacity: 0 } }
                                            animate={ { height: "auto", opacity: 1 } }
                                            exit={ { height: 0, opacity: 0 } }
                                            transition={ { duration: 0.3 } }
                                            className="ml-5"
                                        >
                                            <Grid xs={ 12 }>
                                                <SelectiveOrgShareWithSelectiveRoles
                                                    userId={ agent?.id }
                                                    applicationRolesList={ agentRolesList }
                                                    selectedItems={ selectedOrgIds }
                                                    setSelectedItems={ setSelectedOrgIds }
                                                    addedOrgs={ addedOrgIds }
                                                    setAddedOrgs={ setAddedOrgIds }
                                                    removedOrgs={ removedOrgIds }
                                                    setRemovedOrgs={ setRemovedOrgIds }
                                                    roleSelections={ roleSelections }
                                                    setRoleSelections={ setRoleSelections }
                                                    addedRoles={ addedRoles }
                                                    setAddedRoles={ setAddedRoles }
                                                    removedRoles={ removedRoles }
                                                    setRemovedRoles={ setRemovedRoles }
                                                    shareAllRoles={
                                                        roleShareTypeSelected === RoleShareType.SHARE_WITH_ALL }
                                                    shouldShareWithFutureChildOrgsMap={
                                                        shouldShareWithFutureChildOrgsMap }
                                                    setShouldShareWithFutureChildOrgsMap={
                                                        setShouldShareWithFutureChildOrgsMap
                                                    }
                                                    disableOrgSelection={ false }
                                                    allRolesSharingMessage={
                                                        t("agents:edit.sections.sharedAccess." +
                                                            "allAgentRolesSharingMessage")
                                                    }
                                                    shareWithFutureChildOrgsLabel={
                                                        t("agents:edit.sections.sharedAccess." +
                                                            "shareAgentWithFutureChildOrgs")
                                                    }
                                                    sharingSettingsLabel={
                                                        t("agents:edit.sections.sharedAccess." +
                                                            "sharingSettingsLabel")
                                                    }
                                                    assignedRolesLabel={
                                                        t("agents:edit.sections.sharedAccess." +
                                                            "assignedRolesLabel")
                                                    }
                                                    actualAssignedRolesMap={ agentAssignedRolesMap }
                                                    setActualAssignedRolesMap={ setAgentAssignedRolesMap }
                                                    currentlyAssignedRolesLabel={
                                                        savedShareType !== ShareType.UNSHARE
                                                            ? t("agents:edit.sections.sharedAccess." +
                                                                "currentlyAssignedRolesLabel")
                                                            : undefined
                                                    }
                                                />
                                            </Grid>
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Divider hidden />
                {
                    !readOnly && (
                        <Grid xs={ 8 }>
                            <Button
                                className="mt-5"
                                variant="contained"
                                size="small"
                                data-componentid={ `${ componentId }-update-button` }
                                onClick={ isSharingInProgress ? handleInterruptOngoingShare : handleAgentSharing }
                            >
                                { t("common:save") }
                            </Button>
                        </Grid>
                    )
                }
            </Grid>
            { renderConfirmationModal() }
            { renderShareTypeSwitchModal() }
            { renderShareAllWarningModal() }
        </>
    );
};
