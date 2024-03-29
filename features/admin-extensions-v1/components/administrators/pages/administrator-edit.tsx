/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { UserstoreConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes, isFeatureEnabled, resolveUserDisplayName, resolveUserEmails } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    MultiValueAttributeInterface,
    ProfileInfoInterface,
    emptyProfileInfo
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EditAvatarModal, Popup, TabPageLayout, UserAvatar } from "@wso2is/react-components";
import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Icon } from "semantic-ui-react";
import { getProfileInformation } from "../../../../admin-authentication-v1/store";
import { AppState, FeatureConfigInterface, history, store } from "../../../../admin-core-v1";
import { PatchRoleDataInterface } from "../../../../admin-roles-v2/models/roles";
import {
    ServerConfigurationsInterface,
    getGovernanceConnectors,
    getServerConfigs
} from "../../../../admin-server-configurations-v1/api";
import { ServerConfigurationsConstants } from "../../../../admin-server-configurations-v1/constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    RealmConfigInterface
} from "../../../../admin-server-configurations-v1/models";
import { getUserDetails, updateUserInfo } from "../../../../admin-users-v1/api/users";
import { UserManagementConstants } from "../../../../admin-users-v1/constants/user-management-constants";
import { UserManagementUtils } from "../../../../admin-users-v1/utils/user-management-utils";
import { administratorConfig } from "../../../configs/administrator";
import { UserStoreUtils } from "../../../utils/user-store-utils";
import { EditGuestUser } from "../components";
import { AdministratorConstants } from "../constants";

/**
 * Admin User Edit page.
 *
 * @returns admin user edit page.
 */
const AdministratorEditPage = (): ReactElement => {

    const { t } = useTranslation();

    const dispatch: ThunkDispatch<AppState, any, AnyAction>  = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ user, setUserProfile ] = useState<ProfileInfoInterface>(emptyProfileInfo);
    const [ isUserDetailsRequestLoading, setIsUserDetailsRequestLoading ] = useState<boolean>(false);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);
    const [ connectorProperties, setConnectorProperties ] = useState<ConnectorPropertyInterface[]>(undefined);
    const [ isReadOnlyUserStoresLoading, setReadOnlyUserStoresLoading ] = useState<boolean>(false);
    const [ realmConfigs, setRealmConfigs ] = useState<RealmConfigInterface>(undefined);
    const [ isReadOnly, setReadOnly ] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isDisplayNameEnabled, setIsDisplayNameEnabled ] = useState<boolean>(undefined);

    useEffect(() => {
        if (!user) {
            return;
        }

        const userStore: string = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[ 0 ]
            : UserstoreConstants.PRIMARY_USER_STORE;

        if (!isFeatureEnabled(featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
            || readOnlyUserStoresList?.includes(userStore?.toString())
            || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
        ) {
            setReadOnly(true);
        }
    }, [ user, readOnlyUserStoresList ]);

    useEffect(() => {
        const properties: ConnectorPropertyInterface[] = [];

        getGovernanceConnectors(ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
            .then((response: GovernanceConnectorInterface[]) => {
                response.map((connector: GovernanceConnectorInterface) => {
                    if (connector.id === ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID
                        || connector.id === ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_CONNECTOR_ID) {
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
    }, []);

    /**
     * Set users list.
     */
    useEffect(() => {
        if (!user) {
            return;
        }

        if (hasRequiredScopes(featureConfig?.guestUser,
            featureConfig?.guestUser?.scopes?.read, allowedScopes)) {
            getAdminUser();
        }
        setIsDisplayNameEnabled(
            UserManagementUtils.isDisplayNameEnabled(
                store.getState().profile.profileSchemas, user.displayName
            )
        );
    }, [ user ]);

    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const id: string = path[ path.length - 1 ];

        getUser(id);
    }, []);

    useEffect(() => {
        setReadOnlyUserStoresLoading(true);
        UserStoreUtils.getReadOnlyUserStores()
            .then((response: string[]) => {
                setReadOnlyUserStoresList(response);
            })
            .finally(() => {
                setReadOnlyUserStoresLoading(false);
            });
    }, []);

    /**
     * Util method to get super admin
     */
    const getAdminUser = () => {
        getServerConfigs()
            .then((response: ServerConfigurationsInterface) => {
                setRealmConfigs(response?.realmConfig);
            });
    };

    const getUser = (id: string) => {
        setIsUserDetailsRequestLoading(true);

        getUserDetails(id, null)
            .then((response: ProfileInfoInterface) => {
                setUserProfile(response);
            })
            .catch(() => {
                // TODO add to notifications
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
        history.push(AdministratorConstants.getPaths().get("COLLABORATOR_USERS_PATH"));
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
                        "user:profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "user:profile.notifications.updateProfileInfo.success.message"
                    )
                }));

                handleUserUpdate(user?.id);
            })
            .catch((error: IdentityAppsApiException) => {
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
                setIsSubmitting(true);
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
            primaryEmail = emails.find((value: string | MultiValueAttributeInterface) => typeof value === "string");
        }

        return primaryEmail as string;
    };

    /**
    * This function resolves the description of the user
    *
    * @returns the descriptipn of user's
    */
    const resolveDescription = (): string | null => {

        const description: string = user.emails ? resolvePrimaryEmail(user?.emails) : user.userName;

        if (isDisplayNameEnabled) {
            return description;
        }

        if (resolveUserDisplayName(user, null, administratorConfig.adminRoleName) === description) {
            return administratorConfig.adminRoleName;
        }

        return description;
    };

    return (
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
                                        : resolveUserDisplayName(user, null, administratorConfig.adminRoleName)
                                }
                            </>
                        </>
                    )
                    : (
                        <>
                            {
                                isDisplayNameEnabled
                                    ? user.displayName
                                    : resolveUserDisplayName(user, null, administratorConfig.adminRoleName)
                            }
                        </>
                    )
            }
            description={ resolveDescription() }
            image={ (
                <UserAvatar
                    editable={ !isReadOnly }
                    name={ isDisplayNameEnabled ? user.displayName : resolveUserDisplayName(user) }
                    size="tiny"
                    image={ user?.profileUrl }
                    onClick={ () => !isReadOnly && setShowEditAvatarModal(true) }
                    data-suppress=""
                />
            ) }
            backButton={ {
                "data-testid": "user-mgt-edit-admin-back-button",
                onClick: handleBackButtonClick,
                text: t("extensions:manage.admins.editPage.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditGuestUser
                realmConfigs={ realmConfigs }
                featureConfig={ featureConfig }
                user={ user }
                handleUserUpdate={ handleUserUpdate }
                readOnlyUserStores={ readOnlyUserStoresList }
                connectorProperties={ connectorProperties }
                isReadOnlyUserStoresLoading={ isReadOnlyUserStoresLoading }
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
                        isSubmitting={ isSubmitting }
                        imageUrl={ user?.profileUrl }
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
                                                <a href="https://www.gravatar.com"> Gravatar Official Website</a>
                                                or use one of the following.
                                            </Trans>
                                        ),
                                        header: t("console:common.modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.header")
                                    }
                                },
                                heading: t("console:common.modals.editAvatarModal.content.gravatar.heading")
                            },
                            hostedAvatar: {
                                heading: t("console:common.modals.editAvatarModal.content.hostedAvatar.heading"),
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
                                    hint: t("console:common.modals.editAvatarModal.content.hostedAvatar.input.hint"),
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
                                heading: t("console:common.modals.editAvatarModal.content.systemGenAvatars.heading"),
                                types: {
                                    initials: t("console:common.modals.editAvatarModal.content.systemGenAvatars." +
                                        "types.initials")
                                }
                            }
                        } }
                        data-suppress=""
                    />
                )
            }
        </TabPageLayout>
    );
};

export default AdministratorEditPage;
