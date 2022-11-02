/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { LinkedAccountsEdit } from "./linked-accounts-edit";
import { LinkedAccountsList } from "./linked-accounts-list";
import {
    addAccountAssociation,
    removeLinkedAccount
} from "../../api";
import { getSettingsSectionIcons } from "../../configs";
import { CommonConstants, UIConstants } from "../../constants";
import {
    AlertInterface,
    AlertLevels,
    LinkedAccountInterface
} from "../../models";
import { AppState } from "../../store";
import { getProfileLinkedAccounts, handleAccountSwitching, setActiveForm } from "../../store/actions";
import { refreshPage } from "../../utils";
import { SettingsSection } from "../shared";

/**
 * Prop types for the liked accounts component.
 * Also see {@link LinkedAccounts.defaultProps}
 */
interface LinkedAccountsProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Linked accounts component.
 *
 * @param props - Props injected to the component.
 * @returns Linked Accounts.
 */
export const LinkedAccounts: FunctionComponent<LinkedAccountsProps> = (props: LinkedAccountsProps): JSX.Element => {

    const {
        onAlertFired,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const linkedAccounts: LinkedAccountInterface[] = useSelector((state: AppState) => state.profile.linkedAccounts);
    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);
    const tenantDomain: string = useSelector((state: AppState) => state?.authenticationInformation?.tenantDomain);

    /**
     * Set the linked accounts.
     */
    useEffect(() => {
        if (isEmpty(linkedAccounts)) {
            dispatch(getProfileLinkedAccounts());
        }
    }, []);

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values - Form values.
     */
    const handleSubmit = (values: any): void => {
        const username = values.username;
        const password = values.password;
        const usernameSplit = username?.split("@");
        const superTenant = "carbon.super";
        let userId = username;

        if (usernameSplit?.length >= 1 && tenantDomain !== superTenant && !usernameSplit.includes(tenantDomain)) {
            userId = username + "@" + tenantDomain;
        }

        const data = {
            password,
            properties: [
                {
                    key: "string",
                    value: "string"
                }
            ],
            userId: userId
        };

        addAccountAssociation(data)
            .then(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.linkedAccounts.notifications.addAssociation.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.linkedAccounts.notifications.addAssociation.success.message"
                    )
                });

                dispatch(setActiveForm(null));

                // Re-fetch the linked accounts list.
                dispatch(getProfileLinkedAccounts());
            })
            .catch((error) => {
                onAlertFired({
                    description: error?.response?.data?.description ?? t(
                        "myAccount:components.linkedAccounts.notifications.addAssociation.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ? t("myAccount:components.linkedAccounts.notifications.addAssociation.error.message")
                        : t("myAccount:components.linkedAccounts.notifications.addAssociation.genericError.message")
                });
            });
    };

    /**
     * Handles the account switch click event.
     *
     * @param account - Target account.
     */
    const handleLinkedAccountSwitch = (account: LinkedAccountInterface): void => {
        try {
            dispatch(handleAccountSwitching(account));
            refreshPage();
        } catch (error) {

            if (error.response && error.response.data && error.response.detail) {
                onAlertFired({
                    description: t(
                        "myAccount:components.linkedAccounts.notifications.switchAccount.error.description",
                        { description: error.response.data.detail }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.linkedAccounts.notifications.switchAccount.error.message"
                    )
                });

                return;
            }

            onAlertFired({
                description: t(
                    "myAccount:components.linkedAccounts.notifications.switchAccount.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "myAccount:components.linkedAccounts.notifications.switchAccount.genericError.message"
                )
            });
        }
    };

    /**
     * Handles linked account remove action.
     *
     * @param id - User id.
     */
    const handleLinkedAccountRemove = (id: string): void => {
        removeLinkedAccount(id)
            .then(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.linkedAccounts.notifications.removeAssociation.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.linkedAccounts.notifications.removeAssociation.success.message"
                    )
                });

                // Re-fetch the linked accounts list.
                dispatch(getProfileLinkedAccounts());
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.linkedAccounts.notifications.removeAssociation.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.linkedAccounts.notifications.removeAssociation.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.linkedAccounts.notifications.removeAssociation.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.linkedAccounts.notifications.removeAssociation.genericError.message"
                    )
                });
            });
    };

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            description={ t("myAccount:sections.linkedAccounts.description") }
            header={ t("myAccount:sections.linkedAccounts.heading") }
            icon={ getSettingsSectionIcons().associatedAccounts }
            iconMini={ getSettingsSectionIcons().associatedAccountsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={
                () => dispatch(setActiveForm(
                    CommonConstants.PERSONAL_INFO + UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER))
            }
            primaryAction={ t("myAccount:sections.linkedAccounts.actionTitles.add") }
            primaryActionIcon="add"
            showActionBar={
                activeForm !== CommonConstants.PERSONAL_INFO + UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER }
        >
            {
                activeForm === CommonConstants.PERSONAL_INFO+UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER
                    ? (
                        <LinkedAccountsEdit
                            onFormEditViewHide={ () => {
                                dispatch(setActiveForm(null));
                            } }
                            onFormSubmit={ handleSubmit }
                        />
                    ) : (
                        <LinkedAccountsList
                            data-testid={ `${testId}-list` }
                            linkedAccounts={ linkedAccounts }
                            onLinkedAccountRemove={ handleLinkedAccountRemove }
                            onLinkedAccountSwitch={ handleLinkedAccountSwitch }
                        />
                    )
            }
        </SettingsSection>
    );
};

/**
 * Default props of {@link LinkedAccounts}
 * See type definitions in {@link LinkedAccountsProps}
 */
LinkedAccounts.defaultProps = {
    "data-testid": "linked-accounts"
};
