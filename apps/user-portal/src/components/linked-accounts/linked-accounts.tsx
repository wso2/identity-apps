/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    addAccountAssociation,
    getAssociations,
    getProfileInfo,
    removeAllLinkedAccounts,
    removeLinkedAccount,
    switchAccount
} from "../../api";
import { SettingsSectionIcons } from "../../configs";
import * as UIConstants from "../../constants/ui-constants";
import { AuthStateInterface, createEmptyNotification, LinkedAccountInterface, Notification } from "../../models";
import { AppState } from "../../store";
import { setProfileInfo } from "../../store/actions";
import { SettingsSection } from "../shared";
import { LinkedAccountsEdit } from "./linked-accounts-edit";
import { LinkedAccountsList } from "./linked-accounts-list";

/**
 * Prop types for the liked accounts component.
 */
interface LinkedAccountsProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Linked accounts component.
 *
 * @param {LinkedAccountsProps} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const LinkedAccounts: FunctionComponent<LinkedAccountsProps> = (props: LinkedAccountsProps): JSX.Element => {
    const [ linkedAccounts, setLinkedAccounts ] = useState<LinkedAccountInterface[]>([]);
    const [ editingForm, setEditingForm ] = useState({
        [ UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER ]: false
    });
    const { onNotificationFired } = props;
    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchLinkedAccounts();
    }, []);

    /**
     * Fetches linked accounts from the API.
     */
    const fetchLinkedAccounts = (): void => {
        let notification: Notification = createEmptyNotification();

        if (!profileDetails.profileInfo
            || (profileDetails.profileInfo
                && !profileDetails.profileInfo.name.givenName)) {
            getProfileInfo().then((infoResponse) => {
                getAssociations()
                    .then((associationsResponse) => {
                        setLinkedAccounts(associationsResponse);
                        dispatch(
                            setProfileInfo({
                                ...infoResponse,
                                associations: associationsResponse
                            })
                        );
                    })
                    .catch((error) => {
                        notification = {
                            description: t(
                                "views:components.linkedAccounts.notifications.getAssociations.error.description",
                                { description: error }
                            ),
                            message: t("views:components.linkedAccounts.notifications.getAssociations.error.message"),
                            otherProps: {
                                negative: true
                            },
                            visible: true
                        };
                    });
            });
            onNotificationFired(notification);
            return;
        }

        getAssociations()
            .then((response) => {
                setLinkedAccounts(response);
                dispatch(
                    setProfileInfo({
                        ...profileDetails.profileInfo,
                        associations: response
                    })
                );
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.getAssociations.error.description",
                        { description: error }
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.getAssociations.error.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
            })
            .finally(() => {
                onNotificationFired(notification);
            });
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param {Map<string, string | string[]>} values - Form values.
     * @param formName - Name of the form
     */
    const handleSubmit = (values: Map<string, string | string[]>, formName: string): void => {
        let notification: Notification = createEmptyNotification();
        const username = values.get("username");
        const password = values.get("password");
        const data = {
            password,
            properties: [
                {
                    key: "string",
                    value: "string"
                }
            ],
            userId: username
        };

        addAccountAssociation(data)
            .then(() => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.addAssociation.success.description"
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.addAssociation.success.message"
                    ),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                };

                // Hide form
                setEditingForm({
                    ...editingForm,
                    [ formName ]: false
                });

                // Re-fetch the linked accounts list.
                fetchLinkedAccounts();
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.addAssociation.genericError.description"
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.addAssociation.genericError.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };

                if (error.response && error.response.data && error.response.data.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.linkedAccounts.notifications.addAssociation.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.linkedAccounts.notifications.addAssociation.error.message"
                        ),
                    };
                }
            })
            .finally(() => {
                onNotificationFired(notification);
            });
    };

    /**
     * The following method handles the onClick event of the edit button.
     *
     * @param formName - Name of the form
     */
    const showFormEditView = (formName: string): void => {
        setEditingForm({
            ...editingForm,
            [ formName ]: true
        });
    };

    /**
     * The following method handles the onClick event of the cancel button.
     *
     * @param formName - Name of the form
     */
    const hideFormEditView = (formName: string): void => {
        setEditingForm({
            ...editingForm,
            [ formName ]: false
        });
    };

    /**
     * Handles the account switch click event.
     *
     * @param {LinkedAccountInterface} account - Target account.
     */
    const handleLinkedAccountSwitch = (account: LinkedAccountInterface) => {
        let notification: Notification = createEmptyNotification();

        switchAccount(account)
            .then(() => {
                // reload the page on successful account switch.
                window.location.reload();
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.switchAccount.genericError.description"
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.switchAccount.genericError.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.linkedAccounts.notifications.switchAccount.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.linkedAccounts.notifications.switchAccount.error.message"
                        ),
                    };
                }
                // TODO: Fire the notification.
            });
    };

    /**
     * Handles linked account remove action.
     */
    const handleLinkedAccountRemove = (id: string) => {
        let notification: Notification = createEmptyNotification();

        removeLinkedAccount(id)
            .then(() => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.removeAssociation.success.description"
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.removeAssociation.success.message"
                    ),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                };

                // Re-fetch the linked accounts list.
                fetchLinkedAccounts();
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.removeAssociation.genericError.description"
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.removeAssociation.genericError.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };

                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.linkedAccounts.notifications.removeAssociation.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.linkedAccounts.notifications.removeAssociation.error.message"
                        ),
                    };
                }
            })
            .finally(() => {
                onNotificationFired(notification);
            });
    };

    /**
     * Handles remove all linked accounts action.
     *
     * @remarks
     * This feature has been temporarily removed.
     * See {@link removeAllLinkedAccounts()} function for more details.
     */
    const handleAllLinkedAccountsRemove = () => {
        let notification: Notification = createEmptyNotification();

        removeAllLinkedAccounts()
            .then(() => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.removeAllAssociations.success.description"
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.removeAllAssociations.success.message"
                    ),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                };

                // Re-fetch the linked accounts list.
                fetchLinkedAccounts();
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.removeAllAssociations.genericError.description"
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.removeAllAssociations.genericError.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };

                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.linkedAccounts.notifications.removeAllAssociations.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.linkedAccounts.notifications.removeAllAssociations.error.message"
                        ),
                    };
                }
            })
            .finally(() => {
                onNotificationFired(notification);
            });
    };

    return (
        <SettingsSection
            description={ t("views:sections.linkedAccounts.description") }
            header={ t("views:sections.linkedAccounts.heading") }
            icon={ SettingsSectionIcons.associatedAccounts }
            iconMini={ SettingsSectionIcons.associatedAccountsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={ () => showFormEditView(UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER) }
            primaryAction={ t("views:sections.linkedAccounts.actionTitles.add") }
            primaryActionIcon="add"
            showActionBar={ !editingForm[ UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER ] }
        >
            {
                editingForm[ UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER ]
                    ? <LinkedAccountsEdit onFormEditViewHide={ hideFormEditView } onFormSubmit={ handleSubmit }/>
                    : (
                        <LinkedAccountsList
                            linkedAccounts={ linkedAccounts }
                            onLinkedAccountRemove={ handleLinkedAccountRemove }
                            onLinkedAccountSwitch={ handleLinkedAccountSwitch }
                        />
                    )
            }
        </SettingsSection>
    );
};
