/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Collapse from "@mui/material/Collapse";
import Alert from "@oxygen-ui/react/Alert";
import Button from "@oxygen-ui/react/Button";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Switch from "@oxygen-ui/react/Switch";
import { ApplicationSharingPolicy, RoleSharingModes } from "@wso2is/admin.console-settings.v1/models/shared-access";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import { OperationStatus } from "@wso2is/admin.core.v1/models/common";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    shareApplication,
    stopSharingApplication,
    unshareApplication
} from "@wso2is/admin.organizations.v1/api";
import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";
import useSharedOrganizations from "@wso2is/admin.organizations.v1/api/use-shared-organizations";
import {
    GetOrganizationsParamsInterface,
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationResponseInterface,
    SelectedOrganizationRoleInterface,
    ShareApplicationRequestInterface
} from "@wso2is/admin.organizations.v1/models";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    Heading,
    Hint,
    Message,
    PrimaryButton,
    Text,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import debounce from "lodash-es/debounce";
import differenceBy from "lodash-es/differenceBy";
import React, {
    ChangeEvent,
    FormEvent,
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import { ApplicationManagementConstants } from "../../constants/application-management";
import { ApplicationInterface, ShareApplicationWithAllOrganizationsDataInterface, ShareApplicationWithSelectedOrganizationsAndRolesDataInterface, UnshareOrganizationsDataInterface, additionalSpProperty } from "../../models/application";
import { AnimatePresence, motion } from "framer-motion";
import RolesShareWithAll from "./roles-share-with-all";
import useGetApplicationRolesByAudience from "@wso2is/admin.roles.v2/api/use-get-application-roles-by-audience";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import RolesSelectiveShare from "./roles-selective-share";
import { RoleShareType, ShareType } from "../../constants/application-roles";
import OrgSelectiveShareWithAllRoles from "./org-selective-share-with-all-roles";
import { shareApplicationWithAllOrganizations, shareApplicationWithSelectedOrganizationsAndRoles, unshareApplicationWithSelectedOrganizations } from "../../api/application-roles";


export interface ApplicationShareFormPropsInterface
    extends IdentifiableComponentInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Specifies if the application sharing form should be triggered.
     */
    triggerApplicationShare?: boolean;
    /**
     * Callback when the application sharing completed.
     */
    onApplicationSharingCompleted?: () => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Specifies if there is an ongoing sharing process.
     */
    isSharingInProgress?: boolean;
    /**
     * Callback when application sharing starts.
     */
    onOperationStarted?: () => void;
    /**
     * Specifies the current sharing status of the application.
     */
    operationStatus?: OperationStatus;
}

export const ApplicationShareForm: FunctionComponent<ApplicationShareFormPropsInterface> = (
    props: ApplicationShareFormPropsInterface
) => {

    const {
        application,
        triggerApplicationShare,
        onApplicationSharingCompleted,
        [ "data-componentid" ]: componentId,
        readOnly,
        isSharingInProgress,
        operationStatus,
        onOperationStarted
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );
    const applicationFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state?.config?.ui?.features?.applications);
    const isApplicationShareOperationStatusEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_SHARED_ACCESS_STATUS"));

    const [ subOrganizationList, setSubOrganizationList ] = useState<Array<OrganizationInterface>>([]);
    const [ sharedOrganizationList, setSharedOrganizationList ] = useState<Array<OrganizationInterface>>([]);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<OrganizationInterface[]>([]);
    const [ shareType, setShareType ] = useState<ShareType>(ShareType.UNSHARE);
    const [ roleShareTypeAll, setRoleShareTypeAll ] = useState<RoleShareType>(RoleShareType.SHARE_WITH_ALL);
    const [ roleShareTypeSelected, setRoleShareTypeSelected ] = useState<RoleShareType>(RoleShareType.SHARE_WITH_ALL);
    const [ sharedWithAll, setSharedWithAll ] = useState<boolean>(false);
    const { isOrganizationManagementEnabled } = useGlobalVariables();
    const [ showConfirmationModal, setShowConfirmationModal ] = useState(false);

    const [ hasMoreOrganizations, setHasMoreOrganizations ] = useState(true);
    const [ filter, setFilter ] = useState<string>("");
    const [ afterCursor, setAfterCursor ] = useState<string | null>(null);
    const [ params, setParams ] =
        useState<GetOrganizationsParamsInterface>({ after: null, limit: 15, shouldFetch: true });
    const [ selectedRoles, setSelectedRoles ] = useState<RolesInterface[]>([]);
    const [ addedRoles, setAddedRoles ] = useState<Record<string, SelectedOrganizationRoleInterface[]>>({});
    const [ removedRoles, setRemovedRoles ] = useState<Record<string, SelectedOrganizationRoleInterface[]>>({});
    const [ selectedOrgIds, setSelectedOrgIds ] = useState<string[]>([]);
    const [ addedOrgIds, setAddedOrgIds ] = useState<string[]>([]);
    const [ removedOrgIds, setRemovedOrgIds ] = useState<string[]>([]);

    const {
        data: organizations,
        isLoading: isOrganizationsFetchRequestLoading,
        isValidating: isOrganizationsFetchRequestValidating,
        error: organizationsFetchRequestError
    } = useGetOrganizations(
        isOrganizationManagementEnabled && params.shouldFetch,
        params.filter,
        params.limit,
        params.after,
        null,
        true,
        false
    );

    const {
        data: sharedOrganizations,
        isLoading: isSharedOrganizationsFetchRequestLoading,
        isValidating: isSharedOrganizationsFetchRequestValidating,
        error: sharedOrganizationsFetchRequestError,
        mutate: mutateSharedOrganizationsFetchRequest
    } = useSharedOrganizations(
        application?.id,
        isOrganizationManagementEnabled
    );

    /**
     * Check if the organization list is loading.
     */
    const isLoading: boolean = useMemo(() => {
        if (!isOrganizationManagementEnabled) {
            return false;
        }

        return isSharedOrganizationsFetchRequestLoading ||
            isSharedOrganizationsFetchRequestValidating;
    }, [
        isSharedOrganizationsFetchRequestLoading,
        isSharedOrganizationsFetchRequestValidating
    ]);

    /**
     * Listen for status updates from the parent.
     */
    useEffect(() => {
        if (operationStatus === OperationStatus.PARTIALLY_COMPLETED) {
            onApplicationSharingCompleted?.();
        }
    }, [ operationStatus, onApplicationSharingCompleted ]);

    /**
     * Fetches the organization list.
     */
    useEffect(() => {
        if (!organizations || isOrganizationsFetchRequestLoading || isOrganizationsFetchRequestValidating) {
            return;
        }

        setParams((prevParams: GetOrganizationsParamsInterface) => ({ ...prevParams, shouldFetch: false }));

        const updatedOrganizationList: OrganizationInterface[] = (organizations.organizations);

        setSubOrganizationList((prevOrganizations: OrganizationInterface[]) => [
            ...prevOrganizations,
            ...(updatedOrganizationList || [])
        ]);

        let nextFound: boolean = false;

        organizations?.links?.forEach((link: OrganizationLinkInterface) => {
            if (link.rel === "next") {
                const nextCursor: string = link.href.split("after=")[1];

                setAfterCursor(nextCursor);
                setHasMoreOrganizations(!!nextCursor);
                nextFound = true;
            }
        });

        if (!nextFound) {
            setAfterCursor("");
            setHasMoreOrganizations(false);
        }
    }, [ organizations ]);

    /**
     * Fetches the shared organizations list for the particular application.
     */
    useEffect(() => {
        if (sharedOrganizations?.organizations) {
            setSharedOrganizationList(sharedOrganizations.organizations);
        } else {
            setSharedOrganizationList([]);
        }
    }, [ sharedOrganizations ]);

    /**
     * Dispatches error notifications if organization fetch request fails.
     */
    useEffect(() => {
        if (!organizationsFetchRequestError) {
            return;
        }

        if (organizationsFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: organizationsFetchRequestError?.response?.data?.description
                    ?? t("organizations:notifications.getOrganizationList.error.description"),
                level: AlertLevels.ERROR,
                message: organizationsFetchRequestError?.response?.data?.message
                    ?? t("organizations:notifications.getOrganizationList.error.message")
            }));

            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "organizations:notifications.getOrganizationList" +
                        ".genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "organizations:notifications." +
                        "getOrganizationList.genericError.message"
                )
            })
        );
    }, [ organizationsFetchRequestError ]);

    /**
     * Dispatches error notifications if shared organizations fetch request fails.
     */
    useEffect(() => {
        if (!sharedOrganizationsFetchRequestError) {
            return;
        }

        if (sharedOrganizationsFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: sharedOrganizationsFetchRequestError?.response?.data?.description
                    ?? t("applications:edit.sections.shareApplication.getSharedOrganizations.genericError.description"),
                level: AlertLevels.ERROR,
                message: sharedOrganizationsFetchRequestError?.response?.data?.message
                    ?? t("applications:edit.sections.shareApplication.getSharedOrganizations.genericError.message")
            }));

            return;
        }

        dispatch(
            addAlert({
                description: t("applications:edit.sections.shareApplication" +
                        ".getSharedOrganizations.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("applications:edit.sections.shareApplication" +
                        ".getSharedOrganizations.genericError.message")
            })
        );
    }, [ sharedOrganizationsFetchRequestError ]);

    useEffect(() => setCheckedUnassignedListItems(sharedOrganizationList || []),
        [ sharedOrganizationList ]
    );

    useEffect(() => {
        if (!application) {
            return;
        }

        const isSharedWithAll: additionalSpProperty[] = application?.advancedConfigurations
            ?.additionalSpProperties?.filter((property: additionalSpProperty) =>
                property?.name === "shareWithAllChildren"
            );

        if (!isSharedWithAll || isSharedWithAll.length === 0) {
            setSharedWithAll(false);
        } else {
            setSharedWithAll(
                JSON.parse(isSharedWithAll[ 0 ]?.value)
                    ? JSON.parse(isSharedWithAll[ 0 ]?.value)
                    : false
            );
        }

    }, [ application ]);

    useEffect(() => {
        if (sharedWithAll) {
            setShareType(ShareType.SHARE_ALL);
        } else if (sharedOrganizationList?.length > 0 && !sharedWithAll) {
            setShareType(ShareType.SHARE_SELECTED);
        } else if ((!sharedOrganizationList || sharedOrganizationList?.length === 0) &&
            !sharedWithAll
        ) {
            setShareType(ShareType.UNSHARE);
        }
    }, [ sharedWithAll, sharedOrganizationList ]);

    useEffect(() => {
        if (triggerApplicationShare) {
            handleShareApplication();
        }
    }, [ triggerApplicationShare ]);

    /**
     * Triggers the display of a confirmation modal when the user attempts to start a new share
     * while one is ongoing, asking for confirmation to interrupt the current share.
     */
    const handleInterruptOngoingShare = () => {
        setShowConfirmationModal(true);
    };

    /**
     * Renders a confirmation modal asking the user to confirm if they want to interrupt the
     * ongoing application share. Provides options to confirm or cancel the operation.
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
                    assertionHint={ t("applications:confirmations.inProgressReshare.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onPrimaryActionClick={ (): void => {
                        handleShareApplication();
                        setShowConfirmationModal(false);
                    } }
                    onSecondaryActionClick={ (): void => {
                        setShowConfirmationModal(false);
                    } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("applications:confirmations.inProgressReshare.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("applications:confirmations.inProgressReshare.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("applications:confirmations.inProgressReshare.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </>
        );
    };

    const handleShareApplication: () => Promise<void> = useCallback(async () => {
        if (isApplicationShareOperationStatusEnabled) {
            handleAsyncSharingNotification(shareType);
        }
        let shareAppData: ShareApplicationRequestInterface;
        let removedOrganization: OrganizationInterface[];

        if (shareType === ShareType.SHARE_ALL) {
            shareAppData = {
                shareWithAllChildren: true
            };
        } else if (shareType === ShareType.SHARE_SELECTED) {
            let addedOrganizations: string[];

            if (sharedWithAll) {
                addedOrganizations = checkedUnassignedListItems.map((org: OrganizationInterface) => org.id);

                await unshareApplication(application.id);

            } else {
                addedOrganizations = differenceBy(
                    checkedUnassignedListItems,
                    sharedOrganizationList,
                    "id"
                ).map((organization: OrganizationInterface) => organization.id);

                removedOrganization = differenceBy(
                    sharedOrganizationList,
                    checkedUnassignedListItems,
                    "id"
                );
            }

            shareAppData = {
                shareWithAllChildren: false,
                sharedOrganizations: addedOrganizations
            };
        }

        if (shareType === ShareType.SHARE_ALL || shareType === ShareType.SHARE_SELECTED) {
            shareApplication(
                currentOrganization.id,
                application.id,
                shareAppData
            )
                .then(() => {
                    if (!isApplicationShareOperationStatusEnabled) {
                        dispatch(
                            addAlert({
                                description: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".addSharingNotification.success.description"
                                ),
                                level: AlertLevels.SUCCESS,
                                message: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".addSharingNotification.success.message"
                                )
                            })
                        );
                    }
                })
                .catch((error: AxiosError) => {
                    if (error.response.data.message) {
                        dispatch(
                            addAlert({
                                description: error.response.data.message,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.message"
                                )
                            })
                        );
                    } else {
                        dispatch(
                            addAlert({
                                description: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.message"
                                )
                            })
                        );
                    }
                })
                .finally(() => {
                    if (shareType === ShareType.SHARE_SELECTED) {
                        mutateSharedOrganizationsFetchRequest();
                    }

                    onApplicationSharingCompleted();
                });

            removedOrganization?.forEach((removedOrganization: OrganizationInterface) => {
                stopSharingApplication(
                    currentOrganization.id,
                    application.id,
                    removedOrganization.id
                )
                    .then(() => {
                        dispatch(
                            addAlert({
                                description: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".stopSharingNotification.success.description",
                                    { organization: removedOrganization.name }
                                ),
                                level: AlertLevels.SUCCESS,
                                message: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".stopSharingNotification.success.message"
                                )
                            })
                        );
                    })
                    .catch((error: AxiosError) => {
                        if (error.response.data.message) {
                            dispatch(
                                addAlert({
                                    description: error.response.data.message,
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        "applications:edit.sections.shareApplication" +
                                        ".stopSharingNotification.genericError.message"
                                    )
                                })
                            );
                        } else {
                            dispatch(
                                addAlert({
                                    description: t(
                                        "applications:edit.sections.shareApplication" +
                                        ".stopSharingNotification.genericError.description",
                                        {
                                            organization:
                                                removedOrganization.name
                                        }
                                    ),
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        "applications:edit.sections.shareApplication" +
                                        ".stopSharingNotification.genericError.message"
                                    )
                                })
                            );
                        }
                    });
            });
        } else if (shareType === ShareType.UNSHARE) {
            unshareApplication(application.id)
                .then(() => {
                    dispatch(
                        addAlert({
                            description: t(
                                "applications:edit.sections.shareApplication" +
                                ".stopAllSharingNotification.success.description"
                            ),
                            level: AlertLevels.SUCCESS,
                            message: t(
                                "applications:edit.sections.shareApplication" +
                                ".stopAllSharingNotification.success.message"
                            )
                        })
                    );
                })
                .catch((error: AxiosError) => {
                    if (error?.response?.data?.message) {
                        dispatch(
                            addAlert({
                                description: error.response.data.message,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.message"
                                )
                            })
                        );
                    } else {
                        dispatch(
                            addAlert({
                                description: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "applications:edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.message"
                                )
                            })
                        );
                    }
                })
                .finally(() => {
                    setSharedOrganizationList([]);
                    onApplicationSharingCompleted();
                });
        }
    }, [
        sharedOrganizationList,
        checkedUnassignedListItems,
        stopSharingApplication,
        dispatch,
        currentOrganization.id,
        application.id,
        shareType
    ]);

    const handleApplicationSharing = (): void => {
        if (shareType === ShareType.UNSHARE) {
            // logic to handle unsharing the application

            return;
        }

        if (shareType === ShareType.SHARE_ALL) {
            if (roleShareTypeAll === RoleShareType.SHARE_SELECTED) {
                // Share selected roles with all organizations
                shareSelectedRolesWithAllOrgs();
            }

            if (roleShareTypeAll === RoleShareType.SHARE_WITH_ALL) {
                // Share all roles with all organizations
                shareAllRolesWithAllOrgs();
            }

            return;
        }

        if (shareType === ShareType.SHARE_SELECTED) {
            // logic to handle sharing the application with selected organizations
            if (roleShareTypeSelected === RoleShareType.SHARE_SELECTED) {
                // Share selected roles with selected organizations
                shareSelectedRolesWithSelectedOrgs();
            }

            if (roleShareTypeSelected === RoleShareType.SHARE_WITH_ALL) {
                // Share all roles with selected organizations
                shareAllRolesWithSelectedOrgs();
            }

            return;
        }
    };

    const shareSelectedRolesWithSelectedOrgs = (): void => {
        console.log(selectedOrgIds);

    };

    const shareAllRolesWithSelectedOrgs = (): void => {

        console.log(addedOrgIds);
        console.log(removedOrgIds);

        if (addedOrgIds.length > 0) {
            const data: ShareApplicationWithSelectedOrganizationsAndRolesDataInterface = {
                applicationId: application.id,
                organizations: addedOrgIds.map((orgId: string) => {
                    return {
                        orgId: orgId,
                        policy: ApplicationSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN,
                        roleSharing: {
                            mode: RoleSharingModes.ALL,
                            roles: []
                        }
                    };
                })
            };

            shareApplicationWithSelectedOrganizationsAndRoles(data)
                .then(() => {
                    dispatch(addAlert({
                        description: t("consoleSettings:sharedAccess.notifications." +
                            "shareRoles.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("consoleSettings:sharedAccess.notifications.shareRoles.success.message")
                    }));
                })
                .catch((error: Error) => {
                    dispatch(addAlert({
                        description: t("consoleSettings:sharedAccess.notifications." +
                            "shareRoles.error.description",
                        { error: error.message }),
                        level: AlertLevels.ERROR,
                        message: t("consoleSettings:sharedAccess.notifications.shareRoles.error.message")
                    }));
                });
        }

        // Call unshare API for removed organizations
        if (removedOrgIds.length > 0) {
            const data: UnshareOrganizationsDataInterface = {
                applicationId: application.id,
                orgIds: removedOrgIds
            };

            unshareApplicationWithSelectedOrganizations(data)
                .then(() => {
                    dispatch(addAlert({
                        description: t("consoleSettings:sharedAccess.notifications." +
                            "shareRoles.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("consoleSettings:sharedAccess.notifications.shareRoles.success.message")
                    }));
                })
                .catch((error: Error) => {
                    dispatch(addAlert({
                        description: t("consoleSettings:sharedAccess.notifications." +
                            "shareRoles.error.description",
                        { error: error.message }),
                        level: AlertLevels.ERROR,
                        message: t("consoleSettings:sharedAccess.notifications.shareRoles.error.message")
                    }));
                });
        }
    };

    const shareAllRolesWithAllOrgs = (): void => {
        const data: ShareApplicationWithAllOrganizationsDataInterface = {
            applicationId: application.id,
            policy: ApplicationSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleSharing: {
                mode: RoleSharingModes.ALL,
                roles: []
            }
        };

        shareApplicationWithAllOrganizations(data)
            .then(() => {
                dispatch(addAlert({
                    description: t("consoleSettings:sharedAccess.notifications." +
                        "shareRoles.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consoleSettings:sharedAccess.notifications.shareRoles.success.message")
                }));
            })
            .catch((error: Error) => {
                dispatch(addAlert({
                    description: t("consoleSettings:sharedAccess.notifications." +
                        "shareRoles.error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.shareRoles.error.message")
                }));
            });
    };

    const shareSelectedRolesWithAllOrgs = (): void => {
        const data: ShareApplicationWithAllOrganizationsDataInterface = {
            applicationId: application.id,
            policy: ApplicationSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleSharing: {
                mode: RoleSharingModes.SELECTED,
                roles: selectedRoles.map((role: RolesInterface) => {
                    return {
                        audience: {
                            display: role.audience.display,
                            type: role.audience.type
                        },
                        displayName: role.displayName
                    };
                })
            }
        };

        shareApplicationWithAllOrganizations(data)
            .then(() => {
                dispatch(addAlert({
                    description: t("consoleSettings:sharedAccess.notifications." +
                        "shareRoles.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consoleSettings:sharedAccess.notifications.shareRoles.success.message")
                }));
            })
            .catch((error: Error) => {
                dispatch(addAlert({
                    description: t("consoleSettings:sharedAccess.notifications." +
                        "shareRoles.error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.shareRoles.error.message")
                }));
            });
    };


    function handleAsyncSharingNotification(shareType: ShareType): void {
        if (shareType === ShareType.SHARE_ALL || shareType === ShareType.SHARE_SELECTED) {
            onOperationStarted?.();
            dispatch(
                addAlert({
                    description: t("applications:edit.sections.shareApplication.addAsyncSharingNotification"
                        + ".description"),
                    level: AlertLevels.INFO,
                    message: t("applications:edit.sections.shareApplication.addAsyncSharingNotification.message")
                })
            );
        }
    }

    if (isLoading) {
        return (
            <ContentLoader inline="centered" active/>
        );
    };

    return (
        <>
            <Grid container>
                <Grid xs={ 8 }>
                    <Heading ellipsis as="h6">
                        { t("applications:edit.sections.sharedAccess.subTitle") }
                    </Heading>
                    <FormControl fullWidth>
                        <RadioGroup
                            value={ shareType }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                setShareType(event.target.value as ShareType);
                            } }
                            data-componentid={ `${componentId}-radio-group` }
                        >
                            <FormControlLabel
                                value={ ShareType.UNSHARE }
                                label={ (
                                    <>
                                        { t("organizations:unshareApplicationRadio") }
                                        <Hint inline popup>
                                            { t(
                                                "organizations:unshareApplicationInfo"
                                            ) }
                                        </Hint>
                                    </>
                                ) }
                                control={ <Radio /> }
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-share-with-all-checkbox` }
                            />

                            <FormControlLabel
                                value={ ShareType.SHARE_SELECTED }
                                label={ t("organizations:shareWithSelectedOrgsRadio") }
                                control={ <Radio /> }
                                disabled={ readOnly }
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
                                            <FormControlLabel
                                                control={ (
                                                    <Switch
                                                        checked={ roleShareTypeSelected ===
                                                            RoleShareType.SHARE_SELECTED }
                                                        onChange={ (_event: ChangeEvent, checked: boolean) => {
                                                            if (checked) {
                                                                setRoleShareTypeSelected(RoleShareType.SHARE_SELECTED);
                                                            } else {
                                                                setRoleShareTypeSelected(RoleShareType.SHARE_WITH_ALL);
                                                            }
                                                        } }
                                                        data-componentid={
                                                            `${ componentId }-share-with-selected-switch` }
                                                    />
                                                ) }
                                                label={ "Share a subset of roles with selected organizations" }
                                            />
                                            <Grid xs={ 14 }>
                                                {
                                                    roleShareTypeSelected === RoleShareType.SHARE_WITH_ALL
                                                        ? (
                                                            <OrgSelectiveShareWithAllRoles
                                                                application={ application }
                                                                selectedItems={ selectedOrgIds }
                                                                setSelectedItems={ setSelectedOrgIds }
                                                                addedOrgs={ addedOrgIds }
                                                                setAddedOrgs={ setAddedOrgIds }
                                                                removedOrgs={ removedOrgIds }
                                                                setRemovedOrgs={ setRemovedOrgIds }
                                                            />
                                                        ) : (
                                                            <RolesSelectiveShare
                                                                roleShareType={ roleShareTypeSelected }
                                                                application={ application }
                                                                addedRoles={ addedRoles }
                                                                setAddedRoles={ setAddedRoles }
                                                                removedRoles={ removedRoles }
                                                                setRemovedRoles={ setRemovedRoles }
                                                                selectedItems={ selectedOrgIds }
                                                                setSelectedItems={ setSelectedOrgIds }
                                                            />
                                                        )
                                                }
                                            </Grid>
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                            <FormControlLabel
                                value={ ShareType.SHARE_ALL }
                                label={ t("organizations:shareApplicationRadio") }
                                control={ <Radio /> }
                                disabled={ readOnly }
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
                                                            } else {
                                                                setRoleShareTypeAll(RoleShareType.SHARE_WITH_ALL);
                                                            }
                                                        } }
                                                        data-componentid={
                                                            `${ componentId }-share-with-selected-switch` }
                                                    />
                                                ) }
                                                label={ "Share a subset of roles with all the organizations" }
                                            />
                                            <Divider hidden className="mb-0 mt-2" />
                                            {
                                                roleShareTypeAll === RoleShareType.SHARE_WITH_ALL
                                                    ? (
                                                        <Alert severity="info">
                                                            All roles of the application will be shared with all the organizations.
                                                        </Alert>
                                                    ) : (
                                                        <RolesShareWithAll
                                                            application={ application }
                                                            selectedRoles={ selectedRoles }
                                                            setSelectedRoles={ setSelectedRoles }
                                                        />
                                                    )
                                            }
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                        </RadioGroup>
                    </FormControl>
                    <Button
                        className="mt-5"
                        variant="contained"
                        size="small"
                        disabled={ readOnly }
                        data-componentid={ `${ componentId }-update-button` }
                        onClick={ isSharingInProgress ? handleInterruptOngoingShare : handleApplicationSharing }
                    >
                        { t("common:save") }
                    </Button>
                </Grid>
            </Grid>
            { renderConfirmationModal() }
        </>
    );
};

/**
 * Default props for the component.
 */
ApplicationShareForm.defaultProps = {
    "data-componentid": "application-share-form"
};
