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
import Switch from "@oxygen-ui/react/Switch";
import Typography from "@oxygen-ui/react/Typography";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import { OperationStatus } from "@wso2is/admin.core.v1/models/common";
import { AppState } from "@wso2is/admin.core.v1/store";

import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";
import {
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models";
import useGetApplicationRolesByAudience from "@wso2is/admin.roles.v2/api/use-get-application-roles-by-audience";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import SelectiveOrgShareWithSelectiveRoles from
    "@wso2is/common.ui.shared-access.v1/components/selective-org-share-with-selective-roles";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    FeatureAccessConfigInterface,
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
import differenceBy from "lodash-es/differenceBy";
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
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import RolesShareWithAll from "./roles-share-with-all";
import useGetUserShare from "../api/use-get-user-share";
import {
    editUserRolesOfExistingOrganizations,
    shareUserWithAllOrganizations,
    shareUserWithSelectedOrganizationsAndRoles,
    unShareUserWithAllOrganizations,
    unshareUserWithSelectedOrganizations
} from "../api/users";
import { UserManagementConstants } from "../constants/user-management-constants";
import { RoleShareType, ShareType, ShareTypeSwitchApproach } from "../constants/user-roles";
import {
    RoleSharingInterface,
    ShareOrganizationsAndRolesPatchDataInterface,
    ShareOrganizationsAndRolesPatchOperationInterface,
    ShareUserWithAllOrganizationsDataInterface,
    ShareUserWithSelectedOrganizationsAndRolesDataInterface,
    UnshareOrganizationsDataInterface,
    UnshareUserWithAllOrganizationsDataInterface,
    UserSharingPolicy
} from "../models/user";
import "./share-user-form.scss";

enum RoleSharingModes {
                    ALL = "all",
                    SELECTED = "selected",
                    NONE = "none"
                }

export interface UserShareFormPropsInterface
    extends IdentifiableComponentInterface {
    /**
     * Editing user.
     */
    user: ProfileInfoInterface;
    /**
     * Specifies if the user sharing form should be triggered.
     */
    triggerUserShare?: boolean;
    /**
     * Callback when the user sharing completed.
     */
    onUserSharingCompleted?: () => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Specifies if there is an ongoing sharing process.
     */
    isSharingInProgress?: boolean;
    /**
     * Callback when user sharing starts.
     */
    onOperationStarted?: () => void;
    /**
     * Specifies the current sharing status of the user.
     */
    operationStatus?: OperationStatus;
}

export const ShareUserForm: FunctionComponent<UserShareFormPropsInterface> = (
    props: UserShareFormPropsInterface
) => {

    const {
        user,
        triggerUserShare,
        onUserSharingCompleted,
        readOnly,
        isSharingInProgress,
        operationStatus,
        onOperationStarted,
        ["data-componentid"]: componentId = "user-share-form"
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const userFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state?.config?.ui?.features?.users);
    const isUserShareOperationStatusEnabled: boolean = isFeatureEnabled(
        userFeatureConfig,
        UserManagementConstants.FEATURE_DICTIONARY.get("USER_SHARED_ACCESS_STATUS"));
    const userAudience: string = user?.associatedRoles?.allowedAudience ?? RoleAudienceTypes.ORGANIZATION;

    const [ shareType, setShareType ] = useState<ShareType>(ShareType.UNSHARE);
    const [ roleShareTypeAll, setRoleShareTypeAll ] = useState<RoleShareType>(RoleShareType.SHARE_WITH_ALL);
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
    const [ addedRoles, setAddedRoles ] = useState<Record<string, RoleSharingInterface[]>>({});
    const [ removedRoles, setRemovedRoles ] = useState<Record<string, RoleSharingInterface[]>>({});
    const [ addedOrgIds, setAddedOrgIds ] = useState<string[]>([]);
    const [ removedOrgIds, setRemovedOrgIds ] = useState<string[]>([]);
    const [ clearAdvancedRoleSharing, setClearAdvancedRoleSharing ] = useState<boolean>(false);

    // This is used to determine if the user is shared with all organizations or not.
    // and this will change the radio button option based on the result.
    const {
        data: userShareData,
        isLoading: isUserShareDataFetchRequestLoading,
        isValidating: isUserShareDataFetchRequestValidating,
        mutate: mutateUserShareDataFetchRequest,
        error:  userShareDataFetchRequestError
    } = useGetUserShare(
        user?.id,
        !isEmpty(user?.id) && isOrganizationManagementEnabled,
        false,
        null,
        "roles",
        1,
        null,
        null,
        "sharingMode"
    );

    // Fetch the user roles by audience.
    // This will fetch the roles that are available for the user to share with the organizations.
    const {
        data: originalUserRoles,
        isLoading: isUserRolesFetchRequestLoading,
        error: userRolesFetchRequestError
    } = useGetApplicationRolesByAudience(
        userAudience,
        user?.id,
        null,
        null,
        null,
        null,
        "users,groups,permissions,associatedApplications",
        !isEmpty(user?.id)
    );

    // Fetch the organization of the current organization.
    const {
        data: originalOrganizations,
        error: organizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled,
        null,
        1,
        null,
        null,
        false,
        false
    );

    // Check if there are organizations available to share the user with.
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

        return isUserShareDataFetchRequestLoading ||
            isUserRolesFetchRequestLoading ||
            isUserShareDataFetchRequestValidating;
    }, [
        isUserShareDataFetchRequestLoading,
        isUserShareDataFetchRequestValidating,
        isUserRolesFetchRequestLoading
    ]);

    // user roles available in the user to be shared with the organizations.
    const userRolesList: RolesV2Interface[] = useMemo(() => {
        if (originalUserRoles?.Resources?.length > 0) {
            return originalUserRoles.Resources;
        }
    }, [ originalUserRoles ]);

    useEffect(() => {
        // If there is no user share data, it means the user is not shared with any organization.
        if (isEmpty(userShareData)) {
            setShareType(ShareType.UNSHARE);

            return;
        }

        // If there is no sharing mode, it selective organization sharing is done.
        if (!userShareData.sharingMode) {
            setShareType(ShareType.SHARE_SELECTED);

            return;
        }

        // Otherwise, user is shared with all organizations
        const orgSharingPolicy: string = userShareData.sharingMode?.policy;

        // If the user is shared with all existing organizations only, set the share type to SHARE_SELECTED.
        if (orgSharingPolicy === UserSharingPolicy.ALL_EXISTING_ORGS_ONLY) {
            setShareType(ShareType.SHARE_SELECTED);
        }

        // If the user is shared with all existing and future organizations, set the share type to SHARE_ALL.
        if (orgSharingPolicy === UserSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS) {
            setShareType(ShareType.SHARE_ALL);

            const roleSharingMode: string = userShareData?.sharingMode?.roleAssignment?.mode;

            // Based on the role sharing mode, set the role share type.
            if (roleSharingMode === RoleSharingModes.ALL) {
                setRoleShareTypeAll(RoleShareType.SHARE_WITH_ALL);
            } else if (roleSharingMode === RoleSharingModes.SELECTED) {
                setRoleShareTypeAll(RoleShareType.SHARE_SELECTED);

                // If there is selective role sharing, set the selected roles.
                const initialRoles: RolesInterface[] =
                    userShareData?.sharingMode?.roleAssignment?.roles?.map(
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
                    setSelectedRoles(initialRoles);
                    setInitialSelectedRoles(initialRoles);
                }
            } else if (roleSharingMode === RoleSharingModes.NONE) {
                setRoleShareTypeAll(RoleShareType.SHARE_SELECTED);
            }
        }
    }, [ userShareData ]);


    /**
     * Listen for status updates from the parent.
     */
    useEffect(() => {
        if (operationStatus === OperationStatus.PARTIALLY_COMPLETED) {
            onUserSharingCompleted?.();
        }
    }, [ operationStatus, onUserSharingCompleted ]);


    /**
     * Dispatches error notifications if shared organizations fetch request fails.
     */
    useEffect(() => {
        if (!userShareDataFetchRequestError) {
            return;
        }

        if (userShareDataFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: userShareDataFetchRequestError?.response?.data?.description
                    ?? t("user:editUser.sections.shareUser.getSharedOrganizations.genericError.description"),
                level: AlertLevels.ERROR,
                message: userShareDataFetchRequestError?.response?.data?.message
                    ?? t("user:editUser.sections.shareUser.getSharedOrganizations.genericError.message")
            }));

            return;
        }

        dispatch(
            addAlert({
                description: t("user:editUser.sections.shareUser" +
                        ".getSharedOrganizations.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("user:editUser.sections.shareUser" +
                        ".getSharedOrganizations.genericError.message")
            })
        );
    }, [ userShareDataFetchRequestError ]);

    useEffect(() => {
        if (userRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("user:editUser.sections.sharedAccess.notifications" +
                        ".fetchUserRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("user:editUser.sections.sharedAccess.notifications" +
                        ".fetchUserRoles.genericError.message")
                })
            );
        }
    }, [ userRolesFetchRequestError ]);

    useEffect(() => {
        if (organizationsFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("user:editUser.sections.sharedAccess.notifications" +
                        ".fetchOrganizations.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("user:editUser.sections.sharedAccess.notifications" +
                        ".fetchOrganizations.genericError.message")
                })
            );
        }
    }, [ organizationsFetchRequestError ]);

    useEffect(() => {
        if (triggerUserShare) {
            handleUserSharing();
        }
    }, [ triggerUserShare ]);

    /**
     * Triggers the display of a confirmation modal when the user attempts to start a new share
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
        setClearAdvancedRoleSharing(false);
        shouldMutate && mutateUserShareDataFetchRequest();
    };

    const handleUserSharing = (): void => {
        if (shareType === ShareType.SHARE_SELECTED && selectedOrgIds?.length === 0) {
            dispatch(addAlert({
                description: t("user:editUser.sections.sharedAccess.notifications." +
                        "noOrganizationsSelected.description"),
                level: AlertLevels.ERROR,
                message: t("user:editUser.sections.sharedAccess.notifications." +
                        "noOrganizationsSelected.message")
            }));

            return;
        }

        if (isUserShareOperationStatusEnabled) {
            handleAsyncSharingNotification(shareType);
        }

        if (shareType === ShareType.UNSHARE) {
            // Unshare the user with all organizations
            unshareWithAllOrganizations();
        } else if (shareType === ShareType.SHARE_ALL) {
            if (roleShareTypeAll === RoleShareType.SHARE_SELECTED) {
                // Share selected roles with all organizations
                // If the selected roles have changed from the initial state,
                // This is a SHARE ALL operation and we need to show a warning modal
                if (JSON.stringify(selectedRoles) !== JSON.stringify(initialSelectedRoles)) {
                    setShowShareAllWarningModal(true);
                } else {
                    // If the selected roles are the same as the initial roles
                    // this means its a patch operation and we can skip the warning modal
                    shareSelectedRolesWithAllOrgs();
                }
            }

            if (roleShareTypeAll === RoleShareType.SHARE_WITH_ALL) {
                // Share all roles with all organizations
                shareAllRolesWithAllOrgs();
            }
        } else if (shareType === ShareType.SHARE_SELECTED) {
            // logic to handle sharing the user with selected organizations
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
        const data: UnshareUserWithAllOrganizationsDataInterface = {
            userId: user.id
        };

        try {
            await unShareUserWithAllOrganizations(data);
            dispatch(addAlert({
                description: t("user:editUser.sections.sharedAccess.notifications.unshare.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("user:editUser.sections.sharedAccess.notifications.unshare.success.message")
            }));
            resetStates(false);

            return true;
        } catch (error) {
            dispatch(addAlert({
                description: t("user:editUser.sections.sharedAccess.notifications.unshare.error.description", {
                    error: (error as Error).message
                }),
                level: AlertLevels.ERROR,
                message: t("user:editUser.sections.sharedAccess.notifications.unshare.error.message")
            }));

            return false;
        } finally {
            // onUserSharingCompleted();
        }
    };

    const shareAllRolesWithAllOrgs = async (
        sharingPolicy: UserSharingPolicy = UserSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS
    ): Promise<boolean> => {
        const data: ShareUserWithAllOrganizationsDataInterface = {
            policy: sharingPolicy,
            roleSharing: {
                mode: RoleSharingModes.ALL,
                roles: []
            },
            userId: user.id
        };

        try {
            await shareUserWithAllOrganizations(data);
            resetStates();

            dispatch(addAlert({
                description: t("user:editUser.sections.sharedAccess.notifications.share.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("user:editUser.sections.sharedAccess.notifications.share.success.message")
            }));

            return true;
        } catch (error) {
            dispatch(addAlert({
                description: t("user:editUser.sections.sharedAccess.notifications.share." +
                    "error.description",
                { error: error.message }),
                level: AlertLevels.ERROR,
                message: t("user:editUser.sections.sharedAccess.notifications.share.error.message")
            }));

            return false;
        } finally {
            // onUserSharingCompleted();
        }
    };

    const shareSelectedRolesWithSelectedOrgs = async (): Promise<void> => {
        const tempAddedRoles: Record<string, RoleSharingInterface[]> = { ...addedRoles };
        const tempRemovedRoles: Record<string, RoleSharingInterface[]> = { ...removedRoles };
        const tempShareWithFutureChildOrgsMap: Record<string, boolean> = { ...shouldShareWithFutureChildOrgsMap };
        const sharedPromises: Promise<any>[] = [];
        let orgSharingSuccess: boolean = true;

        // If there are added orgs we need to add both orgs and roles
        if (addedOrgIds.length > 0) {
            const data: ShareUserWithSelectedOrganizationsAndRolesDataInterface = {
                organizations: addedOrgIds.map((orgId: string) => {
                    return {
                        orgId: orgId,
                        policy: tempShareWithFutureChildOrgsMap[orgId]
                            ? UserSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                            : UserSharingPolicy.SELECTED_ORG_ONLY,
                        roleSharing: {
                            mode: tempAddedRoles[orgId] && tempAddedRoles[orgId].length > 0
                                ? RoleSharingModes.SELECTED
                                : RoleSharingModes.NONE,
                            roles: tempAddedRoles[orgId] && tempAddedRoles[orgId].length > 0
                                ? tempAddedRoles[orgId] as RoleSharingInterface[]
                                : []
                        }
                    };
                }),
                userId: user.id
            };

            sharedPromises.push(
                shareUserWithSelectedOrganizationsAndRoles(data)
                    .then(() => {
                        // Upon sucessful sharing, Remove the roles of the added orgs from tempAddedRoles
                        // and tempShareWithFutureChildOrgsMap
                        // as they are already processed along with the org sharing
                        addedOrgIds.forEach((orgId: string) => {
                            delete tempAddedRoles[orgId];
                            delete tempShareWithFutureChildOrgsMap[orgId];
                        });
                    })
                    .catch((error: Error) => {
                        orgSharingSuccess = false;

                        dispatch(addAlert({
                            description: t("user:editUser.sections.sharedAccess.notifications.share." +
                                "error.description",
                            { error: error.message }),
                            level: AlertLevels.ERROR,
                            message: t("user:editUser.sections.sharedAccess.notifications.share.error.message")
                        }));
                    })
            );
        }

        // If there are removed orgs we need to unshare the user with those orgs
        if (removedOrgIds.length > 0) {
            const data: UnshareOrganizationsDataInterface = {
                orgIds: removedOrgIds,
                userId: user.id
            };

            sharedPromises.push(
                unshareUserWithSelectedOrganizations(data)
                    .then(() => {
                        // Upon sucessful unsharing, Remove the orgs from tempRemovedRoles
                        // and tempShareWithFutureChildOrgsMap
                        // as they are already removed along with the org unsharing and no need of patch operation
                        removedOrgIds.forEach((orgId: string) => {
                            delete tempRemovedRoles[orgId];
                            delete tempShareWithFutureChildOrgsMap[orgId];
                        });
                    })
                    .catch((error: Error) => {
                        orgSharingSuccess = false;

                        dispatch(addAlert({
                            description: t("user:editUser.sections.sharedAccess.notifications.unshare." +
                                "error.description",
                            { error: error.message }),
                            level: AlertLevels.ERROR,
                            message: t("user:editUser.sections.sharedAccess.notifications.unshare." +
                                "error.message")
                        }));
                    })
            );
        }

        // Wait for sharing/unsharing to complete
        await Promise.all(sharedPromises);

        // If there are any entries remaining in tempShareWithFutureChildOrgsMap, that means the user has only changed
        // the sharing policy of the existing organizations without adding or removing any organizations.
        // In that case, we need to update the sharing policy of those organizations.
        if (Object.keys(tempShareWithFutureChildOrgsMap).length > 0) {

            const data: ShareUserWithSelectedOrganizationsAndRolesDataInterface = {
                organizations: Object.keys(tempShareWithFutureChildOrgsMap).map((orgId: string) => {
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
                            ? UserSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                            : UserSharingPolicy.SELECTED_ORG_ONLY,
                        roleSharing: {
                            mode: selectedRoles.length > 0
                                ? RoleSharingModes.SELECTED
                                : RoleSharingModes.NONE,
                            roles: selectedRoles
                        }
                    };
                }),
                userId: user.id
            };

            try {
                await shareUserWithSelectedOrganizationsAndRoles(data);
            } catch (error) {
                orgSharingSuccess = false;

                dispatch(addAlert({
                    description: t("user:editUser.sections.sharedAccess.notifications.share." +
                        "error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("user:editUser.sections.sharedAccess.notifications.share.error.message")
                }));
            }
        }

        // If the org sharing was not successful, do not proceed with role patch operations
        if (!orgSharingSuccess) {
            // onUserSharingCompleted();

            return;
        }

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
                    path: `organizations[orgId eq "${orgId}"].roles`,
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
                    path: `organizations[orgId eq "${orgId}"].roles`,
                    value: roleData
                };
            }).filter((item: any) => item !== null);

        const data: ShareOrganizationsAndRolesPatchDataInterface = {
            Operations: [
                ...addOperations,
                ...removeOperations
            ],
            userId: user.id
        };

        if (data?.Operations?.length > 0) {
            editUserRolesOfExistingOrganizations(data)
                .then(() => {
                    dispatch(addAlert({
                        description: t("user:editUser.sections.sharedAccess.notifications.share." +
                            "success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("user:editUser.sections.sharedAccess.notifications.share.success.message")
                    }));

                    resetStates();
                })
                .catch((error: Error) => {
                    dispatch(addAlert({
                        description: t("user:editUser.sections.sharedAccess.notifications.share." +
                            "error.description",
                        { error: error.message }),
                        level: AlertLevels.ERROR,
                        message: t("user:editUser.sections.sharedAccess.notifications.share.error.message")
                    }));
                })
                .finally(() => {
                    // onUserSharingCompleted();
                });
        } else {
            // If there are no further operations to perform, just show a success notification
            // and reset the state.
            dispatch(addAlert({
                description: t("user:editUser.sections.sharedAccess.notifications.share." +
                    "success.description"),
                level: AlertLevels.SUCCESS,
                message: t("user:editUser.sections.sharedAccess.notifications.share.success.message")
            }));

            resetStates();
        }
    };

    const shareAllorNoRolesWithSelectedOrgs = async (shareAllRoles: boolean): Promise<void> => {
        const sharedPromises: Promise<any>[] = [];
        const tempShareWithFutureChildOrgsMap: Record<string, boolean> = { ...shouldShareWithFutureChildOrgsMap };
        let orgSharingSuccess: boolean = true;

        if (addedOrgIds.length > 0) {
            const data: ShareUserWithSelectedOrganizationsAndRolesDataInterface = {
                organizations: addedOrgIds.map((orgId: string) => {
                    return {
                        orgId: orgId,
                        policy: tempShareWithFutureChildOrgsMap[orgId]
                            ? UserSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                            : UserSharingPolicy.SELECTED_ORG_ONLY,
                        roleSharing: {
                            mode: shareAllRoles
                                ? RoleSharingModes.ALL
                                : RoleSharingModes.NONE,
                            roles: []
                        }
                    };
                }),
                userId: user.id
            };

            sharedPromises.push(
                shareUserWithSelectedOrganizationsAndRoles(data)
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
                            description: t("user:editUser.sections.sharedAccess.notifications.share." +
                                "error.description",
                            { error: error.message }),
                            level: AlertLevels.ERROR,
                            message: t("user:editUser.sections.sharedAccess.notifications.share.error.message")
                        }));
                    })
            );
        }

        // Call unshare API for removed organizations
        if (removedOrgIds.length > 0) {
            const data: UnshareOrganizationsDataInterface = {
                orgIds: removedOrgIds,
                userId: user.id
            };

            unshareUserWithSelectedOrganizations(data)
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
                        description: t("user:editUser.sections.sharedAccess.notifications.unshare." +
                            "error.description",
                        { error: error.message }),
                        level: AlertLevels.ERROR,
                        message: t("user:editUser.sections.sharedAccess.notifications.unshare.error.message")
                    }));
                });
        }

        // Wait for sharing/unsharing to complete
        await Promise.all(sharedPromises);

        // If there are any entries remaining in tempShareWithFutureChildOrgsMap, that means the user has only changed
        // the sharing policy of the existing organizations without adding or removing any organizations.
        // In that case, we need to update the sharing policy of those organizations.
        if (Object.keys(tempShareWithFutureChildOrgsMap).length > 0) {

            const data: ShareUserWithSelectedOrganizationsAndRolesDataInterface = {
                organizations: Object.keys(tempShareWithFutureChildOrgsMap).map((orgId: string) => {
                    return {
                        orgId: orgId,
                        policy: tempShareWithFutureChildOrgsMap[orgId]
                            ? UserSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
                            : UserSharingPolicy.SELECTED_ORG_ONLY,
                        roleSharing: {
                            mode: shareAllRoles
                                ? RoleSharingModes.ALL
                                : RoleSharingModes.NONE,
                            roles: []
                        }
                    };
                }),
                userId: user.id
            };

            try {
                await shareUserWithSelectedOrganizationsAndRoles(data);
            } catch (error) {
                orgSharingSuccess = false;

                dispatch(addAlert({
                    description: t("user:editUser.sections.sharedAccess.notifications.share." +
                        "error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("user:editUser.sections.sharedAccess.notifications.share.error.message")
                }));
            }
        }

        // If org sharing was successful, show success notification
        if (orgSharingSuccess) {
            dispatch(addAlert({
                description: t("user:editUser.sections.sharedAccess.notifications.share.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("user:editUser.sections.sharedAccess.notifications.share.success.message")
            }));

            resetStates();
        }

        // Fire the user sharing completed callback
        // onUserSharingCompleted();
    };

    const shareSelectedRolesWithAllOrgs = (): void => {
        // This should only happen when the selectedRoles have changed from the initial state.
        if (!isEmpty(selectedRoles) && JSON.stringify(selectedRoles) === JSON.stringify(initialSelectedRoles)) {
            // If the selected roles are the same as the initial roles, we can skip the sharing process.
            // But we have to perform the role patch operation.
            shareIndividualRolesWithSelectedOrgs();

            return;
        }

        const data: ShareUserWithAllOrganizationsDataInterface = {
            policy: UserSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleSharing: selectedRoles.length > 0 ? {
                mode: RoleSharingModes.SELECTED,
                roles: selectedRoles.map((role: RolesInterface) => {
                    return {
                        audience: {
                            display: role.audience.display ?? user?.userName,
                            type: role.audience.type
                        },
                        displayName: role.displayName
                    };
                })
            } : {
                mode: RoleSharingModes.NONE,
                roles: []
            },
            userId: user.id
        };

        shareUserWithAllOrganizations(data)
            .then(() => {
                shareIndividualRolesWithSelectedOrgs();
            })
            .catch((error: Error) => {
                dispatch(addAlert({
                    description: t("user:editUser.sections.sharedAccess.notifications.share." +
                        "error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("user:editUser.sections.sharedAccess.notifications.share.error.message")
                }));
            })
            .finally(() => {
                // onUserSharingCompleted();
            });
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
                    path: `organizations[orgId eq "${orgId}"].roles`,
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
                    path: `organizations[orgId eq "${orgId}"].roles`,
                    value: roleData
                };
            }).filter((item: any) => item !== null);

        const data: ShareOrganizationsAndRolesPatchDataInterface = {
            Operations: [
                ...addOperations,
                ...removeOperations
            ],
            userId: user.id
        };

        if (data?.Operations?.length > 0) {
            editUserRolesOfExistingOrganizations(data)
                .then(() => {
                    dispatch(addAlert({
                        description: t("user:editUser.sections.sharedAccess.notifications.share." +
                            "success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("user:editUser.sections.sharedAccess.notifications.share.success.message")
                    }));

                    resetStates();
                })
                .catch((error: Error) => {
                    dispatch(addAlert({
                        description: t("user:editUser.sections.sharedAccess.notifications.share." +
                            "error.description",
                        { error: error.message }),
                        level: AlertLevels.ERROR,
                        message: t("user:editUser.sections.sharedAccess.notifications.share.error.message")
                    }));
                })
                .finally(() => {
                    // onUserSharingCompleted();
                });
        } else {
            // If there are no further operations to perform, just show a success notification
            // and reset the state.
            dispatch(addAlert({
                description: t("user:editUser.sections.sharedAccess.notifications.share." +
                    "success.description"),
                level: AlertLevels.SUCCESS,
                message: t("user:editUser.sections.sharedAccess.notifications.share.success.message")
            }));

            resetStates();
            // onUserSharingCompleted();
        }
    };

    const handleAsyncSharingNotification = (shareType: ShareType): void => {
        if (shareType === ShareType.SHARE_ALL || shareType === ShareType.SHARE_SELECTED) {
            onOperationStarted?.();
            dispatch(
                addAlert({
                    description: t("user:editUser.sections.shareUser.addAsyncSharingNotification"
                        + ".description"),
                    level: AlertLevels.INFO,
                    message: t("user:editUser.sections.shareUser.addAsyncSharingNotification.message")
                })
            );
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
            // Unshare the user with all organizations and switch to selective sharing
            const unshareSuccess: boolean = await unshareWithAllOrganizations();

            if (unshareSuccess) {
                setShareType(ShareType.SHARE_SELECTED);
                setRoleShareTypeSelected(RoleShareType.SHARE_SELECTED);
            }

            setShowShareTypeSwitchModal(false);
        } else if (shareTypeSwitchApproach === ShareTypeSwitchApproach.WITHOUT_UNSHARE) {
            // Switch to selective sharing without unsharing the user with all organizations
            // But we have to change the policy of the to selected org only from all existing and future orgs policy

            const shareSuccess: boolean = await shareAllRolesWithAllOrgs(
                UserSharingPolicy.ALL_EXISTING_ORGS_ONLY);

            if (shareSuccess) {
                setShareType(ShareType.SHARE_SELECTED);
                setRoleShareTypeSelected(RoleShareType.SHARE_SELECTED);
            }

            setShowShareTypeSwitchModal(false);
        }
    };

    /**
     * Renders a confirmation modal asking the user to confirm if they want to interrupt the
     * ongoing user share. Provides options to confirm or cancel the operation.
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
                    assertionHint={ t("users:confirmations.inProgressReshare.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onPrimaryActionClick={ (): void => {
                        handleUserSharing();
                        setShowConfirmationModal(false);
                    } }
                    onSecondaryActionClick={ (): void => {
                        setShowConfirmationModal(false);
                    } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("users:confirmations.inProgressReshare.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("users:confirmations.inProgressReshare.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("users:confirmations.inProgressReshare.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </>
        );
    };

    /**
     * Renders a confirmation modal asking the user to confirm if they want to switch the share type
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
                        { t("user:editUser.sections.sharedAccess.shareTypeSwitchModal.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("user:editUser.sections.sharedAccess.shareTypeSwitchModal.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("user:editUser.sections.sharedAccess.shareTypeSwitchModal.description") }
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
                                        <b>{ t("user:editUser.sections.sharedAccess." +
                                                "shareTypeSwitchModal.preserveStateLabel1") }: </b>
                                        { t("user:editUser.sections.sharedAccess." +
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
                                        <b>{ t("user:editUser.sections.sharedAccess." +
                                                "shareTypeSwitchModal.resetToDefaultLabel1") }: </b>
                                        { t("user:editUser.sections.sharedAccess." +
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
     * Renders a warning modal to convey user that they are doing a SHARE ALL operation
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
                        t("user:editUser.sections.sharedAccess.showShareAllWarningModal.assertionHint") }
                    assertionType="checkbox"
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("user:editUser.sections.sharedAccess.showShareAllWarningModal.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("user:editUser.sections.sharedAccess.showShareAllWarningModal.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("user:editUser.sections.sharedAccess.showShareAllWarningModal.description") }
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
                className="share-user-form"
            >
                <Grid xl={ 8 } xs={ 12 }>
                    <Heading as="h4">
                        { t("user:editUser.sections.sharedAccess.title") }
                    </Heading>
                    <Heading ellipsis as="h6">
                        { t("user:editUser.sections.sharedAccess.subTitle") }
                    </Heading>
                    <FormControl fullWidth>
                        <RadioGroup
                            value={ shareType }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                const selectedShareType: ShareType = event.target.value as ShareType;

                                if (shareType === ShareType.SHARE_ALL &&
                                    selectedShareType === ShareType.SHARE_SELECTED) {
                                    // If the user is switching from SHARE_ALL to SHARE_SELECTED,
                                    // we need to prompt the user to select the switching approach
                                    setShowShareTypeSwitchModal(true);

                                    return;
                                }

                                setShareType(selectedShareType);
                            } }
                            data-componentid={ `${componentId}-radio-group` }
                        >
                            <FormControlLabel
                                value={ ShareType.UNSHARE }
                                label={ t("user:editUser.sections.sharedAccess.doNotShareUser") }
                                control={ <Radio /> }
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-unshare-with-all-orgs-checkbox` }
                            />
                            <FormControlLabel
                                value={ ShareType.SHARE_ALL }
                                label={ t("user:editUser.sections.sharedAccess.shareAllUser") }
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
                                            <FormControlLabel
                                                control={ (
                                                    <Switch
                                                        checked={ roleShareTypeAll === RoleShareType.SHARE_SELECTED }
                                                        onChange={ (_event: ChangeEvent, checked: boolean) => {
                                                            if (checked) {
                                                                setRoleShareTypeAll(RoleShareType.SHARE_SELECTED);
                                                                setClearAdvancedRoleSharing(true);
                                                            } else {
                                                                setRoleShareTypeAll(RoleShareType.SHARE_WITH_ALL);
                                                            }
                                                        } }
                                                        data-componentid={
                                                            `${ componentId }-share-selected-roles-all-orgs-toggle` }
                                                    />
                                                ) }
                                                label={ t("user:editUser.sections.sharedAccess." +
                                                    "shareRoleSubsetWithAllOrgs") }
                                            />
                                            <Divider hidden className="mb-0 mt-2" />
                                            {
                                                roleShareTypeAll === RoleShareType.SHARE_WITH_ALL
                                                    ? (
                                                        <Alert severity="info">
                                                            { t("user:editUser.sections.sharedAccess." +
                                                                "allRolesAndOrgsSharingMessage") }
                                                        </Alert>
                                                    ) : (
                                                        <div className="role-share-all-container">
                                                            <RolesShareWithAll
                                                                user={ user }
                                                                selectedRoles={ selectedRoles }
                                                                setSelectedRoles={ setSelectedRoles }
                                                                onRoleChange={ updateRoleSelectionForAllOrganizations }
                                                            />
                                                            <Typography
                                                                variant="body1"
                                                                marginTop={ 2 }
                                                                marginBottom={ 1 }
                                                            >
                                                                { t("user:editUser.sections.sharedAccess." +
                                                                    "individualRoleSharingLabel") }
                                                                <Hint inline popup>
                                                                    { t("user:editUser.sections.sharedAccess." +
                                                                        "individualRoleSharingHint") }
                                                                </Hint>
                                                            </Typography>
                                                            <SelectiveOrgShareWithSelectiveRoles
                                                                userId={ user?.id }
                                                                applicationRolesList={ userRolesList }
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
                                                                shareAllRoles={ false }
                                                                // Check the diff between
                                                                // initialSelectedRoles and selectedRoles
                                                                newlyAddedCommonRoles={ differenceBy(
                                                                    selectedRoles,
                                                                    initialSelectedRoles,
                                                                    "displayName"
                                                                ) }
                                                                newlyRemovedCommonRoles={ differenceBy(
                                                                    initialSelectedRoles,
                                                                    selectedRoles,
                                                                    "displayName"
                                                                ) }
                                                                clearAdvancedRoleSharing={ clearAdvancedRoleSharing }
                                                                disableOrgSelection={ true }
                                                            />
                                                        </div>
                                                    )
                                            }
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                            <FormControlLabel
                                value={ ShareType.SHARE_SELECTED }
                                label={
                                    isOrganizationsAvailable
                                        ? t("user:editUser.sections.sharedAccess.shareSelectedUser")
                                        : (
                                            <>
                                                { t("user:editUser.sections.sharedAccess." +
                                                    "shareSelectedUser") }
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
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    data-componentid={
                                                        `${ componentId }-share-all-roles-with-selected-orgs-btn` }
                                                    onClick={ () => {
                                                        if (roleShareTypeSelected === RoleShareType.SHARE_WITH_ALL) {
                                                            setRoleShareTypeSelected(RoleShareType.SHARE_SELECTED);
                                                        } else if (roleShareTypeSelected ===
                                                            RoleShareType.SHARE_SELECTED) {
                                                            setRoleShareTypeSelected(RoleShareType.SHARE_WITH_ALL);
                                                        }
                                                    } }
                                                    disabled={ readOnly }
                                                >
                                                    {
                                                        roleShareTypeSelected === RoleShareType.SHARE_WITH_ALL
                                                            ? t("user:editUser.sections.sharedAccess." +
                                                                "shareSelectedRoles")
                                                            : t("user:editUser.sections.sharedAccess.shareAllRoles")
                                                    }
                                                </Button>
                                                <SelectiveOrgShareWithSelectiveRoles
                                                    userId={ user?.id }
                                                    applicationRolesList={ userRolesList }
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
                <Grid xs={ 8 }>
                    <Button
                        className="mt-5"
                        variant="contained"
                        size="small"
                        disabled={ readOnly }
                        data-componentid={ `${ componentId }-update-button` }
                        onClick={ isSharingInProgress ? handleInterruptOngoingShare : handleUserSharing }
                    >
                        { t("common:save") }
                    </Button>
                </Grid>
            </Grid>
            { renderConfirmationModal() }
            { renderShareTypeSwitchModal() }
            { renderShareAllWarningModal() }
        </>
    );
};
