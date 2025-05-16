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

import Button from "@oxygen-ui/react/Button";
import { useRequiredScopes } from "@wso2is/access-control";
import { getProfileInformation } from "@wso2is/admin.authentication.v1/store";
import { getEmptyPlaceholderIllustrations, getSidePanelIcons } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { getIdPIcons } from "@wso2is/admin.identity-providers.v1/configs/ui";
import { useGovernanceConnectors } from "@wso2is/admin.server-configurations.v1/api";
import { ServerConfigurationsConstants } from "@wso2is/admin.server-configurations.v1/constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "@wso2is/admin.server-configurations.v1/models";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import {
    getUserNameWithoutDomain,
    isFeatureEnabled,
    resolveUserDisplayName,
    resolveUserEmails
} from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    ProfileInfoInterface,
    emptyProfileInfo
}from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils } from "@wso2is/core/utils";
import {
    EditAvatarModal,
    EmptyPlaceholder,
    GenericIcon, Popup,
    TabPageLayout,
    UserAvatar
} from "@wso2is/react-components";
import React, { MouseEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Label } from "semantic-ui-react";
import { updateUserInfo, useUserDetails } from "../api";
import { EditUser } from "../components/edit-user";
import { UserManagementConstants } from "../constants/user-management-constants";
import UserManagementProvider from "../providers/user-management-provider";
import { UserManagementUtils } from "../utils";

/**
 * User Edit page.
 *
 * @returns User edit page react component.
 */
const UserEditPage = (): ReactElement => {

    const { t } = useTranslation();

    const dispatch: Dispatch<any> = useDispatch();

    const { mutateUserStoreList, isUserStoreReadOnly, readOnlyUserStoreNamesList } = useUserStores();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);

    const hasUsersUpdatePermissions: boolean = useRequiredScopes(
        featureConfig?.users?.scopes?.update
    );
    const isUserUpdateFeatureEnabled: boolean = isFeatureEnabled(
        featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"));
    const isUpdatingSharedProfilesFeatureEnabled: boolean = isFeatureEnabled(
        featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_SHARED_PROFILES"));

    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);
    const [ connectorProperties, setConnectorProperties ] = useState<ConnectorPropertyInterface[]>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const path: string[] = history.location.pathname.split("/");
    const id: string = path[ path.length - 1 ];

    // Get user profile details.
    const {
        data: originalUserDetails,
        isLoading: isUserDetailsFetchRequestLoading,
        isValidating: isUserDetailsFetchRequestValidating,
        mutate: mutateUserDetails,
        error: userDetailsFetchRequestError
    } = useUserDetails(id);

    // Get account management governance connector data.
    const {
        data: originalAccountManagementConnectorData
    } = useGovernanceConnectors(ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID);

    // Get user onboarding governance connector data.
    const {
        data: originalUserOnboardingConnectorData
    } = useGovernanceConnectors(ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID);

    // Get other settings governance connector data.
    const {
        data: otherSettingsConnectorData
    } = useGovernanceConnectors(ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID);

    const user: ProfileInfoInterface = useMemo(() =>
        originalUserDetails || emptyProfileInfo(), [ originalUserDetails ]);

    const isNameAvailable: boolean = user?.name?.familyName === undefined &&
        user?.name?.givenName === undefined;

    /**
     * Checks if the user store is read only.
     */
    const isReadOnlyUserStore: boolean = useMemo(() => {
        const userStoreName: string = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[0]
            : userstoresConfig.primaryUserstoreName;

        return isUserStoreReadOnly(userStoreName);
    }, [ user, readOnlyUserStoreNamesList ]);

    /**
     * Checks if the UI should be in read-only mode.
     */
    const isReadOnly: boolean = !isUserUpdateFeatureEnabled
        || !hasUsersUpdatePermissions
        || isReadOnlyUserStore
        || user[ SCIMConfigs.scim.systemSchema ]?.userSourceId
        || user[ SCIMConfigs.scim.systemSchema ]?.isReadOnlyUser === "true"
        || (user[ SCIMConfigs.scim.systemSchema ]?.managedOrg && !isUpdatingSharedProfilesFeatureEnabled);

    /**
     * As there is a delay in updating user stores,
     * user stores list needs be mutated in page load to avoid stale data.
     */
    useEffect(() => {
        mutateUserStoreList();
    }, []);

    /**
     * Set the connector properties.
     */
    useEffect(() => {
        const properties: ConnectorPropertyInterface[] = [];

        if (originalAccountManagementConnectorData) {
            originalAccountManagementConnectorData.map((connector: GovernanceConnectorInterface) => {
                if (connector.id === ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID
                    || connector.id === ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_CONNECTOR_ID) {
                    connector.properties.map((property: ConnectorPropertyInterface) => {
                        properties.push(property);
                    });
                }
            });
        }

        if (originalUserOnboardingConnectorData) {
            originalUserOnboardingConnectorData.map((connector: GovernanceConnectorInterface) => {
                if (connector.id === ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID) {
                    connector.properties.map((property: ConnectorPropertyInterface) => {
                        if (property.name === ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION) {
                            properties.push(property);
                        }
                    });
                }
            });
        }

        if (otherSettingsConnectorData) {
            otherSettingsConnectorData.map((connector: GovernanceConnectorInterface) => {
                if (connector.id === ServerConfigurationsConstants.USER_CLAIM_UPDATE_CONNECTOR_ID) {
                    connector.properties.map((property: ConnectorPropertyInterface) => {
                        if (property.name === ServerConfigurationsConstants.ENABLE_EMAIL_VERIFICATION
                            || property.name === ServerConfigurationsConstants.ENABLE_MOBILE_VERIFICATION
                            || property.name ===
                                ServerConfigurationsConstants.ENABLE_MOBILE_VERIFICATION_BY_PRIVILEGED_USER
                        ) {
                            properties.push(property);
                        }
                    });
                }
            });
        }
        setConnectorProperties(properties);
    }, [ originalAccountManagementConnectorData, originalUserOnboardingConnectorData, otherSettingsConnectorData ]);

    useEffect(() => {
        if (!userDetailsFetchRequestError) {
            return;
        }

        if (userDetailsFetchRequestError.response
            && userDetailsFetchRequestError.response.data
            && userDetailsFetchRequestError.response.data.description) {
            dispatch(addAlert({
                description: userDetailsFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:manage.notifications.getProfileInfo.error.message")
            }));

            return;
        }

        dispatch(
            addAlert<AlertInterface>({
                description: t(
                    "console:manage.notifications.getProfileSchema.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.notifications.getProfileSchema.genericError.message"
                )
            })
        );
    }, [ userDetailsFetchRequestError ]);


    const handleUserUpdate = () => {
        mutateUserDetails();

        if (UserManagementUtils.isAuthenticatedUser(profileInfo?.userName, user?.userName)) {
            dispatch(getProfileInformation());
        }
    };

    const handleBackButtonClick = () => {
        if (window.location.href.includes(AppConstants.getPaths().get("ADMINISTRATORS"))) {
            history.push(AppConstants.getPaths().get("ADMINISTRATORS"));
        } else {
            history.push(AppConstants.getPaths().get("USERS"));
        }
    };

    const getBackButtonText = (): string => {
        if (window.location.href.includes(AppConstants.getPaths().get("ADMINISTRATORS"))) {
            return t("pages:usersEdit.backButton", { type: "Administrators" });
        } else {
            return t("pages:usersEdit.backButton", { type: "Users" });
        }
    };

    /**
     * Handles edit avatar modal submit action.
     *
     * @param e - Mouse event.
     * @param url - Selected image URL.
     */
    const handleAvatarEditModalSubmit = (e: MouseEvent<HTMLButtonElement>, url: string): void => {
        const data: {
            Operations: {
                op: string;
                value: {
                    profileUrl: string;
                };
            }[];
            schemas: string[];
        } = {
            Operations: [
                {
                    op: "replace",
                    value: {
                        profileUrl: url
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);

        updateUserInfo(user?.id, data)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "user:profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "user:profile.notifications.updateProfileInfo.success.message"
                    )
                }));

                handleUserUpdate();
            })
            .catch((error: any) => {
                if (error.response
                    && error.response.data
                    && (error.response.data.description || error.response.data.detail)) {

                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description || error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t(
                            "user:profile.notifications.updateProfileInfo.error.message"
                        )
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "user:profile.notifications.updateProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "user:profile.notifications.updateProfileInfo.genericError.message"
                    )
                }));
            })
            .finally(() => {
                setShowEditAvatarModal(false);
                setIsSubmitting(false);
            });
    };

    /**
     * This function resolves the description of the user
     *
     * @returns the description of user
     */
    const resolveDescription = (): string | null => {
        return !isNameAvailable && UserManagementUtils.resolveUserListSubheaderName(user);
    };

    /**
     * This function resolves the icon of the user's IDP.
     *
     * @param idpType - User's IDP type.
     */
    const resolveIdpIcon = (idpType: string): ReactElement => {
        switch (idpType) {
            case "Google":
                return getIdPIcons().google;
            case "facebook":
                return getIdPIcons().facebook;
            case "Github":
                return getIdPIcons().github;
            case "Microsoft":
                return getIdPIcons().microsoft;
            case "Apple":
                return getIdPIcons().apple;
            default:
                return getIdPIcons().enterprise;
        }
    };

    if (userDetailsFetchRequestError) {
        return (
            <EmptyPlaceholder
                action={ (
                    <Button variant="text" onClick={ CommonUtils.refreshPage }>
                        { t("console:common.placeholders.brokenPage.action") }
                    </Button>
                ) }
                image={ getEmptyPlaceholderIllustrations().brokenPage }
                imageSize="tiny"
                subtitle={ [
                    t("console:common.placeholders.brokenPage.subtitles.0"),
                    t("console:common.placeholders.brokenPage.subtitles.1")
                ] }
                title={ t("console:common.placeholders.brokenPage.title") }
            />
        );
    }

    return (
        <UserManagementProvider>
            <TabPageLayout
                isLoading={ isUserDetailsFetchRequestLoading || isUserDetailsFetchRequestValidating }
                loadingStateOptions={ {
                    count: 5,
                    imageType: "circular"
                } }
                title={ (
                    <>
                        {
                            user?.active !== undefined
                                ? (
                                    <>
                                        {
                                            user?.active
                                                ? (
                                                    <Popup
                                                        trigger={ (
                                                            <Icon
                                                                className="mr-2 ml-0 vertical-aligned-baseline"
                                                                size="small"
                                                                name="circle"
                                                                color="green"
                                                            />
                                                        ) }
                                                        content={ t("common:enabled") }
                                                        inverted
                                                    />
                                                ) : (
                                                    <Popup
                                                        trigger={ (
                                                            <Icon
                                                                className="mr-2 ml-0 vertical-aligned-baseline"
                                                                size="small"
                                                                name="circle"
                                                                color="orange"
                                                            />
                                                        ) }
                                                        content={ t("common:disabled") }
                                                        inverted
                                                    />
                                                )
                                        }
                                        { getUserNameWithoutDomain(user?.userName) }

                                    </>
                                ) : (
                                    <>
                                        { getUserNameWithoutDomain(user?.userName) }
                                    </>
                                )
                        }
                    </>
                ) }
                pageTitle="Edit User"
                description={ (
                    <div>
                        { resolveDescription() }
                        {
                            user[ SCIMConfigs.scim.systemSchema ]?.userSourceId && (
                                <Label className="profile-user-source-label">
                                    <GenericIcon
                                        className="mt-1 mb-0"
                                        square
                                        inline
                                        size="default"
                                        transparent
                                        icon={ resolveIdpIcon(user[ SCIMConfigs.scim.systemSchema ]?.idpType) }
                                        verticalAlign="middle"
                                    />
                                    <Label.Detail className="mt-1 ml-0 mb-1">
                                        { user[ SCIMConfigs.scim.systemSchema ]?.userSourceId }
                                    </Label.Detail>
                                </Label>
                            )
                        }
                        {
                            user[ SCIMConfigs.scim.systemSchema ]?.userSource && (
                                <Label
                                    className={ !resolveDescription()
                                        ? "profile-user-source-label ml-0"
                                        : "profile-user-source-label" }
                                >
                                    <GenericIcon
                                        className="mt-1 mb-0"
                                        square
                                        inline
                                        size="default"
                                        transparent
                                        icon={ getSidePanelIcons().userStore }
                                        verticalAlign="middle"
                                    />
                                    <Label.Detail className="mt-1 ml-0 mb-1">
                                        { user[ SCIMConfigs.scim.systemSchema ]?.userSource }
                                    </Label.Detail>
                                </Label>
                            )
                        }
                    </div>
                ) }
                image={ (
                    <UserAvatar
                        editable={ !isReadOnly }
                        hoverable={ !isReadOnly }
                        name={ resolveUserDisplayName(user) }
                        size="tiny"
                        image={ user?.profileUrl }
                        onClick={ () =>
                            !isReadOnly && setShowEditAvatarModal(true)
                        }
                    />
                ) }
                backButton={ {
                    "data-testid": "user-mgt-edit-user-back-button",
                    onClick: handleBackButtonClick,
                    text: getBackButtonText()
                } }
                titleTextAlign="left"
                bottomMargin={ false }
            >
                <EditUser
                    user={ user }
                    handleUserUpdate={ handleUserUpdate }
                    connectorProperties={ connectorProperties }
                    isLoading={ isUserDetailsFetchRequestLoading || isUserDetailsFetchRequestValidating }
                    isReadOnly={ isReadOnly }
                    isReadOnlyUserStore={ isReadOnlyUserStore }
                />
                {
                    showEditAvatarModal && (
                        <EditAvatarModal
                            open={ showEditAvatarModal }
                            name={ resolveUserDisplayName(user) }
                            emails={ resolveUserEmails(user?.emails) }
                            onClose={ () => setShowEditAvatarModal(false) }
                            closeOnDimmerClick={ false }
                            onCancel={ () => setShowEditAvatarModal(false) }
                            onSubmit={ handleAvatarEditModalSubmit }
                            imageUrl={ profileInfo?.profileUrl }
                            isSubmitting={ isSubmitting }
                            heading={ t("console:common.modals.editAvatarModal.heading") }
                            submitButtonText={ t("console:common.modals.editAvatarModal.primaryButton") }
                            cancelButtonText={ t("console:common.modals.editAvatarModal.secondaryButton") }
                            translations={ {
                                gravatar: {
                                    errors: {
                                        noAssociation: {
                                            content: (
                                                <Trans
                                                    i18nKey={
                                                        "console:common.modals.editAvatarModal.content.gravatar" +
                                                        "errors.noAssociation.content"
                                                    }
                                                >
                                                    It seems like the selected email is not registered on Gravatar.
                                                    Sign up for a Gravatar account by visiting
                                                    <a href="https://www.gravatar.com">
                                                        Gravatar Official Website
                                                    </a>
                                                    or use one of the following.
                                                </Trans>
                                            ),
                                            header: t("console:common.modals.editAvatarModal.content." +
                                                "gravatar.errors.noAssociation.header")
                                        }
                                    },
                                    heading: t("console:common.modals.editAvatarModal.content.gravatar.heading")
                                },
                                hostedAvatar: {
                                    heading: t("console:common.modals.editAvatarModal.content.hostedAvatar." +
                                    "heading"),
                                    input: {
                                        errors: {
                                            http: {
                                                content: t("console:common.modals.editAvatarModal.content." +
                                                    "hostedAvatar.input.errors.http.content"),
                                                header: t("console:common.modals.editAvatarModal.content." +
                                                    "hostedAvatar.input.errors.http.header")
                                            },
                                            invalid: {
                                                content: t("console:common.modals.editAvatarModal.content." +
                                                    "hostedAvatar.input.errors.invalid.content"),
                                                pointing: t("console:common.modals.editAvatarModal.content." +
                                                    "hostedAvatar.input.errors.invalid.pointing")
                                            }
                                        },
                                        hint: t("console:common.modals.editAvatarModal.content.hostedAvatar." +
                                            "input.hint"),
                                        placeholder: t("console:common.modals.editAvatarModal.content." +
                                            "hostedAvatar.input.placeholder"),
                                        warnings: {
                                            dataURL: {
                                                content: t("console:common.modals.editAvatarModal.content." +
                                                    "hostedAvatar.input.warnings.dataURL.content"),
                                                header: t("console:common.modals.editAvatarModal.content." +
                                                    "hostedAvatar.input.warnings.dataURL.header")
                                            }
                                        }
                                    }
                                },
                                systemGenAvatars: {
                                    heading: t("console:common.modals.editAvatarModal.content" +
                                        ".systemGenAvatars.heading"),
                                    types: {
                                        initials: t("console:common.modals.editAvatarModal.content." +
                                            "systemGenAvatars.types.initials")
                                    }
                                }
                            } }
                        />
                    )
                }
            </TabPageLayout>
        </UserManagementProvider>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UserEditPage;
