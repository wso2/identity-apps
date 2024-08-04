/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { List, Placeholder } from "semantic-ui-react";
import { EmailRecovery, SMSRecovery, SecurityQuestionsComponent } from "./options";
import { getPreference } from "../../api";
import { AppConstants } from "../../constants";
import {
    AlertInterface,
    AlertLevels,
    FeatureConfigInterface,
    PreferenceConnectorResponse,
    PreferenceProperty,
    PreferenceRequest
} from "../../models";
import { AppState } from "../../store";
import { SettingsSection } from "../shared";

/**
 * Prop types for AccountRecoveryComponent component.
 * Also see {@link AccountRecoveryComponent.defaultProps}
 */
interface AccountRecoveryProps extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * The AccountRecoveryComponent component in the Settings section
 *
 * @param props - Props injected to the component.
 * @returns Account Recovery Component.
 */
export const AccountRecoveryComponent: FunctionComponent<AccountRecoveryProps> = (
    props: AccountRecoveryProps
): ReactElement => {
    const { onAlertFired, featureConfig, ["data-testid"]: testId } = props;

    const { t } = useTranslation();
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const RECOVERY_CONNECTOR: string = "account-recovery";
    const RECOVERY_PASSWORD_QUESTION: string = "Recovery.Question.Password.Enable";
    const RECOVERY_PASSWORD_NOTIFICATION: string = "Recovery.Notification.Password.Enable";
    const RECOVERY_PASSWORD_NOTIFICATION_EMAIL_LINK: string = "Recovery.Notification.Password.emailLink.Enable";
    const RECOVERY_PASSWORD_NOTIFICATION_SMS_OTP: string = "Recovery.Notification.Password.smsOtp.Enable";
    const RECOVERY_USERNAME_NOTIFICATION: string = "Recovery.Notification.Username.Enable";
    const [ isQsRecoveryEnabled, setIsQsRecoveryEnabled ] = useState<boolean>(false);
    const [ isNotificationRecoveryEnabled, setIsNotificationRecoveryEnabled ] = useState<boolean>(false);
    const [ isNotificationRecoveryEmailLinkEnabled, setIsNotificationRecoveryEmailLinkEnabled ] =
        useState<boolean>(false);
    const [ isNotificationRecoverySMSOTPEnabled, setIsNotificationRecoverySMSOTPEnabled ] = useState<boolean>(false);
    const [ isUsernameRecoveryEnabled, setIsUsernameRecoveryEnabled ] = useState<boolean>(false);
    const [ isAccountRecoveryDetailsLoading, setIsAccountRecoveryDetailsLoading ] = useState<boolean>(false);

    /**
     * The following method gets the preference for account recovery.
     */
    const getPreferences = (): void => {
        setIsAccountRecoveryDetailsLoading(true);

        const recoveryConnector: PreferenceRequest[] = [
            {
                "connector-name": RECOVERY_CONNECTOR,
                properties: [
                    RECOVERY_PASSWORD_QUESTION,
                    RECOVERY_PASSWORD_NOTIFICATION,
                    RECOVERY_USERNAME_NOTIFICATION,
                    RECOVERY_PASSWORD_NOTIFICATION_EMAIL_LINK,
                    RECOVERY_PASSWORD_NOTIFICATION_SMS_OTP
                ]
            }
        ];

        getPreference(recoveryConnector)
            .then((response: PreferenceConnectorResponse[]) => {
                if (response) {
                    const passwordRecoveryOptions: PreferenceConnectorResponse[] = response;
                    const responseProperties: PreferenceProperty[] = passwordRecoveryOptions[0].properties;

                    responseProperties.forEach((prop: PreferenceProperty) => {
                        switch (prop.name) {
                            case RECOVERY_PASSWORD_QUESTION:
                                setIsQsRecoveryEnabled(prop.value.toLowerCase() === "true");

                                break;
                            case RECOVERY_PASSWORD_NOTIFICATION:
                                setIsNotificationRecoveryEnabled(prop.value.toLowerCase() === "true");

                                break;
                            case RECOVERY_PASSWORD_NOTIFICATION_EMAIL_LINK:
                                setIsNotificationRecoveryEmailLinkEnabled(prop.value.toLowerCase() === "true");

                                break;
                            case RECOVERY_PASSWORD_NOTIFICATION_SMS_OTP:
                                setIsNotificationRecoverySMSOTPEnabled(prop.value.toLowerCase() === "true");

                                break;
                            case RECOVERY_USERNAME_NOTIFICATION:
                                setIsUsernameRecoveryEnabled(prop.value.toLowerCase() === "true");

                                break;
                            default:
                                // Cases where prop.name doesn't match any of the above cases are not handled.
                                break;
                        }
                    });
                } else {
                    onAlertFired({
                        description: t(
                            "myAccount:components.accountRecovery.preference.notifications.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:components.accountRecovery.preference.notifications.genericError.message")
                    });
                }
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.accountRecovery.preference.notifications.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:components.accountRecovery.preference.notifications.error.message")
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.accountRecovery.preference.notifications.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:component.accountRecovery.preference.notifications.genericError.message")
                });
            })
            .finally(() => {
                setIsAccountRecoveryDetailsLoading(false);
            });
    };

    /**
     * Load account recovery preferences.
     */
    useEffect(() => {
        getPreferences();
    }, []);

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            description={ t("myAccount:sections.accountRecovery.description") }
            header={ t("myAccount:sections.accountRecovery.heading") }
            placeholder={
                !isAccountRecoveryDetailsLoading &&
                !(isQsRecoveryEnabled || isNotificationRecoveryEnabled || isUsernameRecoveryEnabled)
                    ? t("myAccount:sections.accountRecovery.emptyPlaceholderText")
                    : null
            }
        >
            { !isAccountRecoveryDetailsLoading ? (
                <List divided={ true } verticalAlign="middle" className="main-content-inner">
                    <List.Item className="inner-list-item">
                        { hasRequiredScopes(
                            featureConfig?.security,
                            featureConfig?.security?.scopes?.read,
                            allowedScopes
                        )  &&
                        isFeatureEnabled(
                            featureConfig?.security,
                            AppConstants.FEATURE_DICTIONARY.get("SECURITY_ACCOUNT_RECOVERY_CHALLENGE_QUESTIONS")
                        ) &&
                        isQsRecoveryEnabled ? (
                                <SecurityQuestionsComponent
                                    onAlertFired={ onAlertFired }
                                    data-testid={ `${testId}-settings-section-security-questions-component` }
                                />
                            ) : null }
                    </List.Item>
                    <List.Item className="inner-list-item">
                        { hasRequiredScopes(
                            featureConfig?.security,
                            featureConfig?.security?.scopes?.read,
                            allowedScopes
                        ) &&
                        isFeatureEnabled(
                            featureConfig?.security,
                            AppConstants.FEATURE_DICTIONARY.get("SECURITY_ACCOUNT_RECOVERY_EMAIL_RECOVERY")
                        ) &&
                        (isNotificationRecoveryEmailLinkEnabled || isUsernameRecoveryEnabled) ? (
                                <EmailRecovery
                                    onAlertFired={ onAlertFired }
                                    data-testid={ `${testId}-settings-section-email-recovery` }
                                />
                            ) : null }
                    </List.Item>
                    <List.Item className="inner-list-item">
                        { hasRequiredScopes(
                            featureConfig?.security,
                            featureConfig?.security?.scopes?.read,
                            allowedScopes
                        ) &&
                        isNotificationRecoverySMSOTPEnabled ? (
                                <SMSRecovery
                                    onAlertFired={ onAlertFired }
                                    data-componentid={ `${testId}-settings-section-sms-recovery` }
                                />
                            ) : null }
                    </List.Item>
                </List>
            ) : (
                <EmphasizedSegment className="placeholder-container">
                    <Placeholder fluid>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                </EmphasizedSegment>
            ) }
        </SettingsSection>
    );
};

/**
 * Default properties of {@link AccountRecoveryComponent}.
 * Also see {@link AccountRecoveryProps}
 */
AccountRecoveryComponent.defaultProps = {
    "data-testid": "account-recovery-component"
};
