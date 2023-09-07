/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import {
    PasswordExpiryInterface,
    PasswordHistoryCountInterface,
    ServerConfigurationConfig
} from "./models/server-configuration";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants,
    UpdateGovernanceConnectorConfigInterface
} from "../../features/server-configurations";
import { ValidationFormInterface } from "../../features/validation/models";
import { ExtendedDynamicConnector } from "../components/governance-connectors";
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


export const serverConfigurationConfig: ServerConfigurationConfig = {
    autoEnableConnectorToggleProperty: true,
    connectorPropertiesToShow: [
        "Recovery.ReCaptcha.Password.Enable",
        "Recovery.NotifySuccess",
        "Recovery.ExpiryTime"
    ],
    connectorToggleName: {
        "account-recovery": ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE,
        "account.lock.handler": ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE,
        "self-sign-up": ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE,
        "sso.login.recaptcha": ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE
    },
    connectorsToShow: [
        "account-recovery",
        "account.lock.handler",
        "self-sign-up",
        "sso.login.recaptcha"
    ],
    intendSettings: false,
    passwordExpiryComponent: (
        componentId: string,
        passwordExpiryEnabled: boolean,
        setPasswordExpiryEnabled: (state: boolean) => void,
        t: TFunction<"translation", undefined>
    ): ReactElement => {
        return generatePasswordExpiry(
            componentId,
            passwordExpiryEnabled,
            setPasswordExpiryEnabled,
            t
        );
    },
    passwordHistoryCountComponent: (
        componentId: string,
        passwordHistoryEnabled: boolean,
        setPasswordHistoryEnabled: (state: boolean) => void,
        t: TFunction<"translation", undefined>
    ): ReactElement => {
        return generatePasswordHistoryCount(
            componentId,
            passwordHistoryEnabled,
            setPasswordHistoryEnabled,
            t
        );
    },
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
    renderConnector: (
        connector: GovernanceConnectorInterface,
        connectorForm: ReactElement,
        connectorIllustration: string,
        connectorTitle: ReactNode,
        connectorSubHeading: ReactNode,
        _message: ReactNode
    ): ReactElement => {
        return (
            <ExtendedDynamicConnector
                connector={ connector }
                connectorForm={ connectorForm }
                connectorIllustration={ connectorIllustration }
                connectorSubHeading={ connectorSubHeading }
                connectorToggleName={ serverConfigurationConfig.connectorToggleName[ connector.name ] }
                data-testid="governance-connector-password-recovery"
            />
        );
    },
    renderConnectorWithinEmphasizedSegment: false,
    showConnectorsOnTheSidePanel: false,
    showGovernanceConnectorCategories: false,
    showPageHeading: false,
    usePasswordExpiry: useGetPasswordExpiryProperties,
    usePasswordHistory: useGetPasswordHistoryCount
};
