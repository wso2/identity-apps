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

import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    addAccountAssociation,
    removeLinkedAccount
} from "../../api";
import { SettingsSectionIcons } from "../../configs";
import * as UIConstants from "../../constants/ui-constants";
import {
    AlertInterface,
    AlertLevels,
    LinkedAccountInterface
} from "../../models";
import { AppState } from "../../store";
import { getProfileLinkedAccounts, handleAccountSwitching } from "../../store/actions";
import { SettingsSection } from "../shared";
import { LinkedAccountsEdit } from "./linked-accounts-edit";
import { LinkedAccountsList } from "./linked-accounts-list";
import { refreshPage } from "../../utils";

/**
 * Prop types for the liked accounts component.
 */
interface LinkedAccountsProps {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Linked accounts component.
 *
 * @param {LinkedAccountsProps} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const LinkedAccounts: FunctionComponent<LinkedAccountsProps> = (props: LinkedAccountsProps): JSX.Element => {
    const [ editingForm, setEditingForm ] = useState({
        [ UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER ]: false
    });
    const { onAlertFired } = props;
    const linkedAccounts: LinkedAccountInterface[] = useSelector((state: AppState) => state.profile.linkedAccounts);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (_.isEmpty(linkedAccounts)) {
            dispatch(getProfileLinkedAccounts());
        }
    }, []);

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param {Map<string, string | string[]>} values - Form values.
     * @param formName - Name of the form
     */
    const handleSubmit = (values: Map<string, string | string[]>, formName: string): void => {
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
                onAlertFired({
                    description: t(
                        "userPortal:components.linkedAccounts.notifications.addAssociation.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "userPortal:components.linkedAccounts.notifications.addAssociation.success.message"
                    )
                });

                // Hide form
                setEditingForm({
                    ...editingForm,
                    [ formName ]: false
                });

                // Re-fetch the linked accounts list.
                dispatch(getProfileLinkedAccounts());
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    onAlertFired({
                        description: t(
                            "userPortal:components.linkedAccounts.notifications.addAssociation.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "userPortal:components.linkedAccounts.notifications.addAssociation.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "userPortal:components.linkedAccounts.notifications.addAssociation.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "userPortal:components.linkedAccounts.notifications.addAssociation.genericError.message"
                    )
                });
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
        try {
            dispatch(handleAccountSwitching(account));
            refreshPage();
        } catch (error) {
        
            if (error.response && error.response.data && error.response.detail) {
                onAlertFired({
                    description: t(
                        "userPortal:components.linkedAccounts.notifications.switchAccount.error.description",
                        { description: error.response.data.detail }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "userPortal:components.linkedAccounts.notifications.switchAccount.error.message"
                    )
                });

                return;
            }

            onAlertFired({
                description: t(
                    "userPortal:components.linkedAccounts.notifications.switchAccount.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "userPortal:components.linkedAccounts.notifications.switchAccount.genericError.message"
                )
            });
        }  
    };

    /**
     * Handles linked account remove action.
     */
    const handleLinkedAccountRemove = (id: string) => {
        removeLinkedAccount(id)
            .then(() => {
                onAlertFired({
                    description: t(
                        "userPortal:components.linkedAccounts.notifications.removeAssociation.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "userPortal:components.linkedAccounts.notifications.removeAssociation.success.message"
                    )
                });

                // Re-fetch the linked accounts list.
                dispatch(getProfileLinkedAccounts());
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "userPortal:components.linkedAccounts.notifications.removeAssociation.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "userPortal:components.linkedAccounts.notifications.removeAssociation.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "userPortal:components.linkedAccounts.notifications.removeAssociation.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "userPortal:components.linkedAccounts.notifications.removeAssociation.genericError.message"
                    )
                });
            });
    };

    return (
        <SettingsSection
            description={ t("userPortal:sections.linkedAccounts.description") }
            header={ t("userPortal:sections.linkedAccounts.heading") }
            icon={ SettingsSectionIcons.associatedAccounts }
            iconMini={ SettingsSectionIcons.associatedAccountsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={ () => showFormEditView(UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER) }
            primaryAction={ t("userPortal:sections.linkedAccounts.actionTitles.add") }
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
