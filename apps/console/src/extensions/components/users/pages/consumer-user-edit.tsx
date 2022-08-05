/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { UserstoreConstants } from "@wso2is/core/constants";
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
    emptyProfileInfo
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EditAvatarModal, GenericIcon, PageLayout, UserAvatar } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "semantic-ui-react";
import { getProfileInformation } from "../../../../features/authentication";
import {
    AppState,
    FeatureConfigInterface,
    SharedUserStoreUtils,
    getSidePanelIcons,
    history
} from "../../../../features/core";
import { getIdPIcons } from "../../../../features/identity-providers";
import { getGovernanceConnectors } from "../../../../features/server-configurations/api";
import { ServerConfigurationsConstants } from "../../../../features/server-configurations/constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../../../../features/server-configurations/models";
import { getUserDetails, updateUserInfo } from "../../../../features/users/api";
import { UserManagementConstants } from "../../../../features/users/constants";
import { UserManagementUtils } from "../../../../features/users/utils";
import { SCIMConfigs } from "../../../configs/scim";
import { EditConsumerUser } from "../components/consumers";
import { UsersConstants } from "../constants";

/**
 * Customer user Edit page.
 *
 * @return {React.ReactElement}
 */
const ConsumerUserEditPage = (): ReactElement => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

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

    useEffect(() => {
        if(!user) {
            return;
        }

        const userStore = user?.userName?.split("/").length > 1
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

        getGovernanceConnectors(ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
            .then((response: GovernanceConnectorInterface[]) => {
                response.map((connector) => {
                    if (connector.id === ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID
                        || connector.id === ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_CONNECTOR_ID
                        || connector.id === ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID) {
                        connector.properties.map((property) => {
                            properties.push(property);
                        });
                    }
                });

                getGovernanceConnectors(ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                    .then((response: GovernanceConnectorInterface[]) => {
                        response.map((connector) => {
                            if (connector.id === ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID) {
                                connector.properties.map((property) => {
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
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        SharedUserStoreUtils.getReadOnlyUserStores().then((response) => {
            setReadOnlyUserStoresList(response);
            getUser(id);
        });
    }, []);

    useEffect(() => {
        SharedUserStoreUtils.getReadOnlyUserStores().then((response) => {
            setReadOnlyUserStoresList(response);
        });
    }, [ user ]);

    const getUser = (id: string) => {
        setIsUserDetailsRequestLoading(true);

        getUserDetails(id, null)
            .then((response) => {
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

        if (UserManagementUtils.isAuthenticatedUser(profileInfo, user)) {
            dispatch(getProfileInformation());
        }
    };

    const handleBackButtonClick = () => {
        history.push(UsersConstants.getPaths().get("USERS_PATH"));
    };

    /**
     * Handles edit avatar modal submit action.
     *
     * @param {<HTMLButtonElement>} e - Event.
     * @param {string} url - Selected image URL.
     */
    const handleAvatarEditModalSubmit = (e: MouseEvent<HTMLButtonElement>, url: string): void => {
        const data = {
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
            .catch((error) => {
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
     * @param {string | MultiValueAttributeInterface)[]} emails - User emails.
     */
    const resolvePrimaryEmail = (emails: (string | MultiValueAttributeInterface)[]): string => {
        let primaryEmail: string | MultiValueAttributeInterface = "";
        
        if (emails && Array.isArray(emails) && emails.length > 0) {
            primaryEmail = emails.find((value) => typeof value === "string"
                && FormValidation.email(value));
        }

        return primaryEmail as string;
    };

    /**
     * This function resolves the icon of the user's IDP.
     *
     * @param {string} idpType - User's IDP type.
     */
    const resolveIdpIcon = (idpType: string): ReactElement => {
        switch (idpType) {
            case "Google":
                return getIdPIcons().google;
            case "facebook":
                return getIdPIcons().facebook;
            case "Github":
                return getIdPIcons().github;
            default:
                return getIdPIcons().enterprise;
        }
    };

    return (
        <PageLayout
            isLoading={ isUserDetailsRequestLoading }
            title={ <div data-suppress="">{ resolveUserDisplayName(user, null, "User") } </div> }
            description={ (
                <div>
                    {
                        user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId
                            ? (
                                !isEmpty(user.emails)
                                    ? (
                                        t(
                                            "" +user.emails && user.emails !== undefined
                                                ? resolvePrimaryEmail(user?.emails)
                                                : user.userName
                                        )
                                    )
                                    : null
                            ) : (
                                t(
                                    "" +user.emails && user.emails !== undefined
                                        ? resolvePrimaryEmail(user?.emails)
                                        : user.userName
                                )
                            )
                    }
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
                            <Label className="profile-user-source-label">
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
                    name={ resolveUserDisplayName(user) }
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
                text: t("console:manage.pages.usersEdit.backButton")
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
                        name={ resolveUserDisplayName(user) }
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
                                        content: t("console:common.modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.content"),
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
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConsumerUserEditPage;
