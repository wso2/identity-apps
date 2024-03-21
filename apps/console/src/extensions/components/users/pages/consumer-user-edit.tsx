/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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
import { UserstoreConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    hasRequiredScopes,
    isFeatureEnabled,
    resolveUserDisplayName,
    resolveUserEmails
} from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    MultiValueAttributeInterface,
    ProfileInfoInterface,
    ProfileSchemaInterface,
    emptyProfileInfo
} from "@wso2is/core/models";
import { addAlert, setSCIMSchemas } from "@wso2is/core/store";
import { CommonUtils } from "@wso2is/core/utils";
import { I18n } from "@wso2is/i18n";
import {
    EditAvatarModal,
    EmptyPlaceholder,
    GenericIcon,
    Popup,
    TabPageLayout,
    UserAvatar
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Icon, Label } from "semantic-ui-react";
import { getProfileInformation } from "../../../../features/authentication";
import {
    AppState,
    FeatureConfigInterface,
    getEmptyPlaceholderIllustrations,
    getSidePanelIcons,
    history,
    store
} from "../../../../features/core";
import { getIdPIcons } from "../../../../features/identity-providers/configs/ui";
import { PatchRoleDataInterface } from "../../../../features/roles/models/roles";
import { getGovernanceConnectors } from "../../../../features/server-configurations/api";
import { ServerConfigurationsConstants } from "../../../../features/server-configurations/constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../../../../features/server-configurations/models";
import { getProfileSchemas, getUserDetails, updateUserInfo } from "../../../../features/users/api";
import { UserManagementConstants } from "../../../../features/users/constants";
import UserManagementProvider from "../../../../features/users/providers/user-management-provider";
import { UserManagementUtils } from "../../../../features/users/utils";
import { SCIMConfigs } from "../../../configs/scim";
import { UserStoreUtils } from "../../../utils/user-store-utils";
import { UserManagementUtils as UserUtils } from "../../users/utils";
import { EditConsumerUser } from "../components/consumers";
import { UserAccountTypes, UsersConstants } from "../constants";

/**
 * Customer user Edit page.
 *
 * @returns user edit page component.
 */
const ConsumerUserEditPage = (): ReactElement => {

    const { t } = useTranslation();

    const dispatch: ThunkDispatch<AppState, any, AnyAction> = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ user, setUserProfile ] = useState<ProfileInfoInterface>(emptyProfileInfo);
    const [ isUserDetailsRequestLoading, setIsUserDetailsRequestLoading ] = useState<boolean>(true);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);
    const [ connectorProperties, setConnectorProperties ] = useState<ConnectorPropertyInterface[]>(undefined);
    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isReadOnlyUserStore, setReadOnlyUserStore ] = useState<boolean>(false);
    const [ isDisplayNameEnabled, setIsDisplayNameEnabled ] = useState<boolean>(undefined);
    const [ isUserNotFound, setIsUserNotFound ] = useState<boolean>(false);
    const [ isUserDetailsFetchError, setIsUserDetailsFetchError ] = useState<boolean>(false);

    useEffect(() => {
        if(!user) {
            return;
        }

        const userStore: string = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[0]
            : UserstoreConstants.PRIMARY_USER_STORE;

        if (readOnlyUserStoresList?.includes(userStore?.toString())) {
            setReadOnlyUserStore(true);
        } else {
            setReadOnlyUserStore(false);
        }

        if (readOnlyUserStoresList?.includes(userStore?.toString())
            || !isFeatureEnabled(featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
            || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
            || user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId
        ) {
            setReadOnly(true);
        } else {
            setReadOnly(false);
        }
    }, [ user, readOnlyUserStoresList ]);

    useEffect(() => {
        const properties: ConnectorPropertyInterface[] = [];
        const path: string[] = history.location.pathname.split("/");
        const id: string = path[ path.length - 1 ];

        getGovernanceConnectors(ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
            .then((response: GovernanceConnectorInterface[]) => {
                response.map((connector: GovernanceConnectorInterface) => {
                    if (connector.id === ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID
                        || connector.id === ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_CONNECTOR_ID
                        || connector.id === ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID) {
                        connector.properties.map((property: ConnectorPropertyInterface) => {
                            properties.push(property);
                        });
                    }
                });

                getGovernanceConnectors(ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                    .then((response: GovernanceConnectorInterface[]) => {
                        response.map((connector: GovernanceConnectorInterface) => {
                            if (connector.id === ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID) {
                                connector.properties.map((property: ConnectorPropertyInterface) => {
                                    if (property.name === ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION) {
                                        properties.push(property);
                                    }
                                });
                            }
                        });

                        setConnectorProperties(properties);
                    });
            });

        getUser(id);

        UserStoreUtils.getReadOnlyUserStores()
            .then((response: string[]) => {
                setReadOnlyUserStoresList(response);
            });
    }, []);

    useEffect(() => {
        setIsDisplayNameEnabled(
            UserUtils.isDisplayNameEnabled(
                store.getState().profile.profileSchemas, user.displayName
            )
        );
    }, [ user ]);

    const getUser = (id: string) => {
        setIsUserDetailsRequestLoading(true);

        // If the schemas in the redux store is empty, fetch the SCIM schemas from the API.
        if (isEmpty(store.getState().profile.profileSchemas)) {
            setIsUserDetailsRequestLoading(true);

            getProfileSchemas()
                .then((response: ProfileSchemaInterface[]) => {
                    dispatch(setSCIMSchemas<ProfileSchemaInterface[]>(response));
                })
                .catch((error: IdentityAppsApiException) => {
                    if (error?.response?.data?.description) {
                        dispatch(
                            addAlert<AlertInterface>({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: I18n.instance.t("notifications:getProfileSchema." +
                                    "error.message")
                            })
                        );
                    }

                    dispatch(
                        addAlert<AlertInterface>({
                            description: I18n.instance.t(
                                "notifications:getProfileSchema.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t(
                                "notifications:getProfileSchema.genericError.message"
                            )
                        })
                    );
                });
        }

        getUserDetails(id, null)
            .then((response: ProfileInfoInterface) => {
                setUserProfile(response);
                setIsUserNotFound(false);
                setIsUserDetailsFetchError(false);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.status === 404) {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: error.response.data.detail,
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t("notifications:getProfileInfo.error.message")
                        })
                    );

                    setIsUserNotFound(true);
                } else {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: I18n.instance.t(
                                "notifications:getProfileSchema.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t(
                                "notifications:getProfileSchema.genericError.message"
                            )
                        })
                    );

                    setIsUserDetailsFetchError(true);
                }
            })
            .finally(() => {
                setIsUserDetailsRequestLoading(false);
            });
    };

    const handleUserUpdate = (id: string) => {
        getUser(id);

        if (UserManagementUtils.isAuthenticatedUser(profileInfo?.userName, user?.userName)) {
            dispatch(getProfileInformation());
        }
    };

    const handleBackButtonClick = () => {
        history.push(UsersConstants.getPaths().get("USERS_PATH"));
    };

    /**
     * Handles edit avatar modal submit action.
     *
     * @param e - Event.
     * @param url - Selected image URL.
     */
    const handleAvatarEditModalSubmit = (e: MouseEvent<HTMLButtonElement>, url: string): void => {
        const data: PatchRoleDataInterface = {
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
                        "console:manage.features.user.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.user.profile.notifications.updateProfileInfo.success.message"
                    )
                }));

                handleUserUpdate(user?.id);
            })
            .catch((error: AxiosError) => {
                if (error.response
                    && error.response.data
                    && (error.response.data.description || error.response.data.detail)) {

                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description || error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.user.profile.notifications.updateProfileInfo.error.message"
                        )
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "console:manage.features.user.profile.notifications.updateProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.user.profile.notifications.updateProfileInfo.genericError.message"
                    )
                }));
            })
            .finally(() => {
                setShowEditAvatarModal(false);
                setIsSubmitting(false);
            });
    };

    /**
     * This function resolves the primary email of the user.
     *
     * @param emails - User emails.
     */
    const resolvePrimaryEmail = (emails: (string | MultiValueAttributeInterface)[]): string => {
        let primaryEmail: string | MultiValueAttributeInterface = "";

        if (emails && Array.isArray(emails) && emails.length > 0) {
            primaryEmail = emails.find((value: string | MultiValueAttributeInterface) => typeof value === "string"
                && FormValidation.email(value));
        }

        return primaryEmail as string;
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

    /**
     * This function resolves the description of the user
     *
     * @returns the description of user
     */
    const resolveDescription = (): string | null => {

        const description: string = user.emails ? resolvePrimaryEmail(user?.emails) : user.userName.split("/")[1];

        if (isDisplayNameEnabled) {
            return description;
        }

        if (resolveUserDisplayName(user, null, UserAccountTypes.ADMINISTRATOR) === description) {
            return null;
        }

        return description;
    };

    /**
     * Placeholder for the user profile page.
     *
     * @returns placeholder for the user profile page
     */
    const getPlaceholder = (): ReactElement => {
        if (isUserNotFound) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <Button variant="text" onClick={ handleBackButtonClick }>
                            { t("console:manage.features.users.editUser.placeholders.undefinedUser.action") }
                        </Button>
                    ) }
                    subtitle={ [ t("console:manage.features.users.editUser.placeholders.undefinedUser.subtitles") ] }
                    title={ t("console:manage.features.users.editUser.placeholders.undefinedUser.title") }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                />
            );
        } else if (isUserDetailsFetchError) {
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
    };

    return isUserNotFound || isUserDetailsFetchError
        ? getPlaceholder()
        : (
            <UserManagementProvider>
                <TabPageLayout
                    isLoading={ isUserDetailsRequestLoading }
                    loadingStateOptions={ {
                        count: 5,
                        imageType: "circular"
                    } }
                    title={
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
                                            ) }
                                    <>
                                        {
                                            isDisplayNameEnabled
                                                ? user.displayName
                                                : resolveUserDisplayName(user, null, UserAccountTypes.ADMINISTRATOR)
                                        }
                                    </>
                                </>
                            )
                            : (
                                <>
                                    {
                                        isDisplayNameEnabled
                                            ? user.displayName
                                            : resolveUserDisplayName(user, null, UserAccountTypes.ADMINISTRATOR)
                                    }
                                </>
                            )

                    }
                    description={ (
                        <div>
                            { resolveDescription() }
                            {
                                user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId && (
                                    <Label className="profile-user-source-label">
                                        <GenericIcon
                                            className="mt-1 mb-0"
                                            square
                                            inline
                                            size="default"
                                            transparent
                                            icon={ resolveIdpIcon(user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType) }
                                            verticalAlign="middle"
                                        />
                                        <Label.Detail className="mt-1 ml-0 mb-1">
                                            { user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId }
                                        </Label.Detail>
                                    </Label>
                                )
                            }
                            {
                                user[ SCIMConfigs.scim.enterpriseSchema ]?.userSource && (
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
                                            { user[ SCIMConfigs.scim.enterpriseSchema ]?.userSource }
                                        </Label.Detail>
                                    </Label>
                                )
                            }
                        </div>
                    ) }
                    image={ (
                        <UserAvatar
                            editable={ !isReadOnly && !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId }
                            name={ isDisplayNameEnabled ? user.displayName : resolveUserDisplayName(user) }
                            size="tiny"
                            image={ user?.profileUrl }
                            onClick={ () => { !isReadOnly && !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId
                                ? setShowEditAvatarModal(true)
                                : null;
                            } }
                            data-suppress=""
                        />
                    ) }
                    backButton={ {
                        "data-testid": "user-mgt-edit-user-back-button",
                        onClick: handleBackButtonClick,
                        text: t("console:manage.pages.usersEdit.backButton", { type: "Users" })
                    } }
                    titleTextAlign="left"
                    bottomMargin={ false }
                >
                    <EditConsumerUser
                        isUserProfileLoading={ isUserDetailsRequestLoading }
                        featureConfig={ featureConfig }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        isReadOnly={ isReadOnly }
                        isReadOnlyUserStore={ isReadOnlyUserStore }
                        connectorProperties={ connectorProperties }
                    />
                    {
                        showEditAvatarModal && (
                            <EditAvatarModal
                                open={ showEditAvatarModal }
                                name={ isDisplayNameEnabled ? user.displayName : resolveUserDisplayName(user) }
                                emails={ resolveUserEmails(user?.emails) }
                                onClose={ () => setShowEditAvatarModal(false) }
                                closeOnDimmerClick={ false }
                                onCancel={ () => setShowEditAvatarModal(false) }
                                onSubmit={ handleAvatarEditModalSubmit }
                                imageUrl={ user?.profileUrl }
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
                                                        <a href="https://www.gravatar.com">Gravatar Official
                                                        Website</a> or use one of the following.
                                                    </Trans>
                                                ),
                                                header: t("console:common.modals.editAvatarModal.content.gravatar" +
                                                    ".errors.noAssociation.header")
                                            }
                                        },
                                        heading: t("console:common.modals.editAvatarModal.content.gravatar.heading")
                                    },
                                    hostedAvatar: {
                                        heading: t("console:common.modals.editAvatarModal.content.hostedAvatar" +
                                            ".heading"),
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
                                        heading: t("console:common.modals.editAvatarModal.content.systemGenAvatars." +
                                            "heading"),
                                        types: {
                                            initials: t("console:common.modals.editAvatarModal.content" +
                                                ".systemGenAvatars.types.initials")
                                        }
                                    }
                                } }
                                data-suppress=""
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
export default ConsumerUserEditPage;
