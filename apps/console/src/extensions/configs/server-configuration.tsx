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

import React, { ReactElement, ReactNode } from "react";
import { TFunction } from "react-i18next";
import { Card, Divider, Grid, Header } from "semantic-ui-react";
import {
    PasswordExpiryInterface,
    PasswordHistoryCountInterface,
    PasswordPoliciesInterface,
    ServerConfigurationConfig
} from "./models/server-configuration";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    GovernanceConnectorUtils,
    ServerConfigurationsConstants,
    UpdateGovernanceConnectorConfigInterface,
    UpdateGovernanceConnectorConfigPropertyInterface,
    UpdateMultipleGovernanceConnectorsInterface
} from "../../features/server-configurations";
import { ValidationFormInterface } from "../../features/validation/models";
import {
    updatePasswordExpiryProperties,
    useGetPasswordExpiryProperties
} from "../components/password-expiry/api/password-expiry";
import { generatePasswordExpiry } from "../components/password-expiry/components/password-expiry";
import {
    updatePasswordHistoryCount,
    useGetPasswordHistoryCount
} from "../components/password-history-count/api";
import { generatePasswordHistoryCount } from "../components/password-history-count/components";
import { updatePasswordPolicyProperties } from "../components/password-policies/api/password-policies";

export const serverConfigurationConfig: ServerConfigurationConfig = {
    autoEnableConnectorToggleProperty: false,
    backButtonDisabledConnectorIDs: [
        ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID
    ],
    connectorCategoriesToIgnore: [
        ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
        ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
    ],
    connectorCategoriesToShow: [
        ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID,
        ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
        ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
        ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
    ],
    connectorPropertiesToShow: [ "all" ],
    connectorStatusViewDisabledConnectorIDs: [
        ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID
    ],
    connectorToggleName: {
        "account-recovery": ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE,
        "account-recovery-username": ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE,
        "account.lock.handler": ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE,
        "multiattribute.login.handler": ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_ENABLE,
        "organization-self-service": ServerConfigurationsConstants.ORGANIZATION_SELF_SERVICE_ENABLE,
        "self-sign-up": ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE,
        "sso.login.recaptcha": ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE
    },
    connectorsToHide: [
        ServerConfigurationsConstants.ALTERNATIVE_LOGIN_IDENTIFIER,
        ServerConfigurationsConstants.PRIVATE_KEY_JWT_CLIENT_AUTH,
        ServerConfigurationsConstants.USERNAME_VALIDATION,
        ServerConfigurationsConstants.CONSENT_INFO_CONNECTOR_ID,
        ServerConfigurationsConstants.WSO2_ANALYTICS_ENGINE_CONNECTOR_CATEGORY_ID,
        ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID,
        ServerConfigurationsConstants.USER_CLAIM_UPDATE_CONNECTOR_ID
    ],
    connectorsToShow: [
        "account-recovery",
        "self-sign-up",
        "user-email-verification"
    ],
    customConnectors: [
        ServerConfigurationsConstants.SAML2_SSO_CONNECTOR_ID,
        ServerConfigurationsConstants.SESSION_MANAGEMENT_CONNECTOR_ID,
        ServerConfigurationsConstants.WS_FEDERATION_CONNECTOR_ID
    ],
    dynamicConnectors: true,
    extendedConnectors: [],
    intendSettings: false,
    passwordExpiryComponent: (
        componentId: string,
        passwordExpiryEnabled: boolean,
        setPasswordExpiryEnabled: (state: boolean) => void,
        t: TFunction<"translation", undefined>,
        isReadOnly: boolean = false
    ): ReactElement => {
        return generatePasswordExpiry(
            componentId,
            passwordExpiryEnabled,
            setPasswordExpiryEnabled,
            t,
            isReadOnly
        );
    },
    passwordHistoryCountComponent: (
        componentId: string,
        passwordHistoryEnabled: boolean,
        setPasswordHistoryEnabled: (state: boolean) => void,
        t: TFunction<"translation", undefined>,
        isReadOnly: boolean = false
    ): ReactElement => {
        return generatePasswordHistoryCount(
            componentId,
            passwordHistoryEnabled,
            setPasswordHistoryEnabled,
            t,
            isReadOnly
        );
    },
    predefinedConnectorCategories: [
        "UGFzc3dvcmQgUG9saWNpZXM",
        "VXNlciBPbmJvYXJkaW5n",
        "TG9naW4gQXR0ZW1wdHMgU2VjdXJpdHk",
        "QWNjb3VudCBNYW5hZ2VtZW50",
        "TXVsdGkgRmFjdG9yIEF1dGhlbnRpY2F0b3Jz"
    ],
    processInitialValues: (
        initialValues: ValidationFormInterface,
        passwordHistoryCount: GovernanceConnectorInterface,
        setPasswordHistoryEnabled: (state: boolean) => void
    ): PasswordHistoryCountInterface => {
        const isEnabled: boolean =
            passwordHistoryCount.properties.filter(
                (property: ConnectorPropertyInterface) =>
                    property.name === "passwordHistory.enable"
            )[ 0 ].value === "true";

        setPasswordHistoryEnabled(isEnabled);

        return {
            ...initialValues,
            passwordHistoryCount: parseInt(
                passwordHistoryCount.properties.filter(
                    (property: ConnectorPropertyInterface) =>
                        property.name === "passwordHistory.count"
                )[ 0 ].value
            ),
            passwordHistoryCountEnabled: isEnabled
        };
    },
    processPasswordCountSubmitData: (data: PasswordHistoryCountInterface) => {
        let passwordHistoryCount: number | undefined = parseInt((data.passwordHistoryCount as string));
        const passwordHistoryCountEnabled: boolean | undefined = data.passwordHistoryCountEnabled;

        delete data.passwordHistoryCount;
        delete data.passwordHistoryCountEnabled;

        if (passwordHistoryCountEnabled && passwordHistoryCount === 0) {
            passwordHistoryCount = 1;
        }

        const passwordHistoryCountData: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: [
                {
                    name: "passwordHistory.count",
                    value: passwordHistoryCount?.toString()
                },
                {
                    name: "passwordHistory.enable",
                    value: passwordHistoryCountEnabled?.toString()
                }
            ]
        };

        return updatePasswordHistoryCount(passwordHistoryCountData);
    },

    processPasswordExpiryInitialValues: (
        initialValues: ValidationFormInterface,
        passwordExpiry: GovernanceConnectorInterface,
        setPasswordExpiryEnabled: (state: boolean) => void
    ): PasswordExpiryInterface => {
        const isEnabled: boolean =
            passwordExpiry?.properties?.filter(
                (property: ConnectorPropertyInterface) =>
                    property.name === ServerConfigurationsConstants.PASSWORD_EXPIRY_ENABLE
            )[ 0 ].value === "true";

        setPasswordExpiryEnabled(isEnabled);

        return {
            ...initialValues,
            passwordExpiryEnabled: isEnabled,
            passwordExpiryTime: parseInt(
                passwordExpiry?.properties?.filter(
                    (property: ConnectorPropertyInterface) =>
                        property.name === ServerConfigurationsConstants.PASSWORD_EXPIRY_TIME
                )[ 0 ].value
            )
        };
    },
    processPasswordExpirySubmitData: (data: PasswordExpiryInterface) => {
        let passwordExpiryTime: number | undefined = parseInt((data.passwordExpiryTime as string));
        const passwordExpiryEnabled: boolean | undefined = data.passwordExpiryEnabled;

        delete data.passwordExpiryTime;
        delete data.passwordExpiryEnabled;

        if (passwordExpiryEnabled && passwordExpiryTime === 0) {
            passwordExpiryTime = 30;
        }

        const passwordExpiryData: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: [
                {
                    name: ServerConfigurationsConstants.PASSWORD_EXPIRY_ENABLE,
                    value: passwordExpiryEnabled?.toString()
                },
                {
                    name: ServerConfigurationsConstants.PASSWORD_EXPIRY_TIME,
                    value: passwordExpiryTime?.toString()
                }
            ]
        };

        return updatePasswordExpiryProperties(passwordExpiryData);
    },
    processPasswordPoliciesSubmitData: (data: PasswordPoliciesInterface, isLegacy: boolean) => {
        let passwordExpiryTime: number | undefined = parseInt((data.passwordExpiryTime as string));
        const passwordExpiryEnabled: boolean | undefined = data.passwordExpiryEnabled;
        let passwordHistoryCount: number | undefined = parseInt((data.passwordHistoryCount as string));
        const passwordHistoryCountEnabled: boolean | undefined = data.passwordHistoryCountEnabled;

        delete data.passwordExpiryTime;
        delete data.passwordExpiryEnabled;
        delete data.passwordHistoryCount;
        delete data.passwordHistoryCountEnabled;

        if (passwordExpiryEnabled && passwordExpiryTime === 0) {
            passwordExpiryTime = 30;
        }

        if (passwordHistoryCountEnabled && passwordHistoryCount === 0) {
            passwordHistoryCount = 1;
        }

        const legacyPasswordPoliciesData: {
            id: string, properties: UpdateGovernanceConnectorConfigPropertyInterface[] } = {
                id: ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID,
                properties: [
                    {
                        name: ServerConfigurationsConstants.PASSWORD_POLICY_ENABLE,
                        value: data[
                            GovernanceConnectorUtils.encodeConnectorPropertyName(
                                ServerConfigurationsConstants.PASSWORD_POLICY_ENABLE) ]?.toString()
                    },
                    {
                        name: ServerConfigurationsConstants.PASSWORD_POLICY_MIN_LENGTH,
                        value: data[
                            GovernanceConnectorUtils.encodeConnectorPropertyName(
                                ServerConfigurationsConstants.PASSWORD_POLICY_MIN_LENGTH) ]?.toString()
                    },
                    {
                        name: ServerConfigurationsConstants.PASSWORD_POLICY_MAX_LENGTH,
                        value: data[
                            GovernanceConnectorUtils.encodeConnectorPropertyName(
                                ServerConfigurationsConstants.PASSWORD_POLICY_MAX_LENGTH) ]?.toString()
                    },
                    {
                        name: ServerConfigurationsConstants.PASSWORD_POLICY_PATTERN,
                        value: data[
                            GovernanceConnectorUtils.encodeConnectorPropertyName(
                                ServerConfigurationsConstants.PASSWORD_POLICY_PATTERN) ]?.toString()
                    },
                    {
                        name: ServerConfigurationsConstants.PASSWORD_POLICY_ERROR_MESSAGE,
                        value: data[
                            GovernanceConnectorUtils.encodeConnectorPropertyName(
                                ServerConfigurationsConstants.PASSWORD_POLICY_ERROR_MESSAGE) ]?.toString()
                    }
                ]
            };

        const passwordPoliciesData: UpdateMultipleGovernanceConnectorsInterface = {
            connectors: [
                {
                    id: ServerConfigurationsConstants.PASSWORD_EXPIRY_CONNECTOR_ID,
                    properties: [
                        {
                            name: ServerConfigurationsConstants.PASSWORD_EXPIRY_ENABLE,
                            value: passwordExpiryEnabled?.toString()
                        },
                        {
                            name: ServerConfigurationsConstants.PASSWORD_EXPIRY_TIME,
                            value: passwordExpiryTime?.toString()
                        }
                    ]
                },
                {
                    id: ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID,
                    properties: [
                        {
                            name: ServerConfigurationsConstants.PASSWORD_HISTORY_COUNT,
                            value: passwordHistoryCount?.toString()
                        },
                        {
                            name: ServerConfigurationsConstants.PASSWORD_HISTORY_ENABLE,
                            value: passwordHistoryCountEnabled?.toString()
                        }
                    ]
                }
            ],
            operation: "UPDATE"
        };

        if (isLegacy) {
            passwordPoliciesData.connectors.push(legacyPasswordPoliciesData);
        }

        return updatePasswordPolicyProperties(passwordPoliciesData);
    },
    renderConnector: (
        connector: GovernanceConnectorInterface,
        connectorForm: ReactElement,
        connectorTitle: ReactNode,
        connectorSubHeading: ReactNode,
        message: ReactNode,
        connectorIllustration?: string
    ): ReactElement => {
        return (
            <Card fluid>
                <Card.Content className="connector-section-content">
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <Grid padded>
                                <Grid.Row>
                                    <Grid.Column width={ 16 }>
                                        <div
                                            className={ connectorIllustration ? "connector-section-with-image-bg" : "" }
                                            style={ {
                                                background: `url(${ connectorIllustration })`
                                            } }
                                        >
                                            <Header>
                                                { connectorTitle }
                                                <Header.Subheader>
                                                    { connectorSubHeading }
                                                </Header.Subheader>
                                            </Header>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            { message }
                            <Divider />
                            { connectorForm }
                        </Grid.Column>
                    </Grid.Row>
                </Card.Content>
            </Card>
        );
    },
    renderConnectorWithinEmphasizedSegment: false,
    showConnectorsOnTheSidePanel: false,
    showGovernanceConnectorCategories: false,
    showPageHeading: true,
    usePasswordExpiry: useGetPasswordExpiryProperties,
    usePasswordHistory: useGetPasswordHistoryCount
};
