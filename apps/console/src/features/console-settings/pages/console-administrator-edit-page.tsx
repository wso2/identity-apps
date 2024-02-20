/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes, resolveUserDisplayName, resolveUserEmails } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    MultiValueAttributeInterface,
    ProfileInfoInterface,
    emptyProfileInfo
}from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EditAvatarModal, Popup, TabPageLayout, UserAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { getProfileInformation } from "../../authentication/store";
import { AppConstants, AppState, FeatureConfigInterface, SharedUserStoreUtils, history } from "../../core";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { getGovernanceConnectors } from "../../server-configurations/api";
import { ServerConfigurationsConstants } from "../../server-configurations/constants";
import { ConnectorPropertyInterface, GovernanceConnectorInterface } from "../../server-configurations/models";
import { getUserDetails, updateUserInfo } from "../../users/api/users";
import { EditUser } from "../../users/components/edit-user";
import UserManagementProvider from "../../users/providers/user-management-provider";
import { UserManagementUtils } from "../../users/utils/user-management-utils";
import { ConsoleSettingsModes } from "../models/ui";

/**
 * Props interface of {@link ConsoleSettingsPage}
 */
type ConsoleAdministratorsEditPageInterface = IdentifiableComponentInterface;

/**
 * Email Domain Discovery page.
 *
 * @param props - Props injected to the component.
 * @returns Email Domain Discovery page component.
 */
const ConsoleAdministratorsEditPage: FunctionComponent<ConsoleAdministratorsEditPageInterface> = (
    props: ConsoleAdministratorsEditPageInterface
): ReactElement => {

    const { "data-componentid": componentId } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch<any> = useDispatch();

    const { isSuperOrganization } = useGetCurrentOrganizationType();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);

    const [ user, setUserProfile ] = useState<ProfileInfoInterface>(emptyProfileInfo);
    const [ isUserDetailsRequestLoading, setIsUserDetailsRequestLoading ] = useState<boolean>(false);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);
    const [ connectorProperties, setConnectorProperties ] = useState<ConnectorPropertyInterface[]>(undefined);
    const [ isReadOnlyUserStoresLoading, setReadOnlyUserStoresLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        if (isSuperOrganization) {
            return;
        }

        const properties: ConnectorPropertyInterface[] = [];

        getGovernanceConnectors(ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
            .then((response: GovernanceConnectorInterface[]) => {
                response.map((connector: GovernanceConnectorInterface) => {
                    if (connector.id === ServerConfigurationsConstants.ACCOUNT_DISABLING_DYNAMIC_CONNECTOR_ID
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

    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const id: string = path[ path.length - 1 ];

        getUser(id);
    }, []);

    useEffect(() => {
        if (!isSuperOrganization) {
            return;
        }

        setReadOnlyUserStoresLoading(true);
        SharedUserStoreUtils.getReadOnlyUserStores()
            .then((response: string[]) => {
                setReadOnlyUserStoresList(response);
            })
            .finally(() => {
                setReadOnlyUserStoresLoading(false);
            });
    }, [ user ]);

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
        history.push(AppConstants.getPaths().get("CONSOLE_SETTINGS")
            + `#tab=${ ConsoleSettingsModes.ADMINISTRATORS }`);
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
                        "console:manage.features.user.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.user.profile.notifications.updateProfileInfo.success.message"
                    )
                }));

                handleUserUpdate(user?.id);
            })
            .catch((error: any) => {
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
            primaryEmail = emails.find((value: string | MultiValueAttributeInterface) => typeof value === "string");
        }

        return primaryEmail as string;
    };

    return (
        <UserManagementProvider>
            <TabPageLayout
                isLoading={ isUserDetailsRequestLoading }
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
                                        { resolveUserDisplayName(user, null, "Administrator") }

                                    </>
                                ) : (
                                    <>
                                        { resolveUserDisplayName(user, null, "Administrator") }
                                    </>
                                )
                        }
                    </>
                ) }
                pageTitle="Edit User"
                description={ t("" + user.emails && user.emails !== undefined ? resolvePrimaryEmail(user?.emails) :
                    user.userName) }
                image={ (
                    <UserAvatar
                        editable={
                            hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                        }
                        name={ resolveUserDisplayName(user) }
                        size="tiny"
                        image={ user?.profileUrl }
                        onClick={ () =>
                            hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                            && setShowEditAvatarModal(true)
                        }
                    />
                ) }
                loadingStateOptions={ {
                    count: 5,
                    imageType: "circular"
                } }
                backButton={ {
                    "data-testid": "user-mgt-edit-user-back-button",
                    onClick: handleBackButtonClick,
                    text: t("console:consoleSettings.administrators.edit.backButton")
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                data-componentid={ componentId }
            >
                <EditUser
                    featureConfig={ featureConfig }
                    user={ user }
                    handleUserUpdate={ handleUserUpdate }
                    readOnlyUserStores={ readOnlyUserStoresList }
                    connectorProperties={ connectorProperties }
                    isLoading={ isUserDetailsRequestLoading }
                    isReadOnlyUserStoresLoading={ isReadOnlyUserStoresLoading }
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
                                        hint: t(
                                            "console:common.modals.editAvatarModal.content.hostedAvatar.input.hint"
                                        ),
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
                                    heading: t(
                                        "console:common.modals.editAvatarModal.content.systemGenAvatars.heading"
                                    ),
                                    types: {
                                        initials: t("console:common.modals.editAvatarModal.content.systemGenAvatars." +
                                            "types.initials")
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

ConsoleAdministratorsEditPage.defaultProps = {
    "data-componentid": "console-administrators-edit-page"
};

export default ConsoleAdministratorsEditPage;
