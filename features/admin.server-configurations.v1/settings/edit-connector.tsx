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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SettingsSection } from "./settings-section";
import { AppConstants, history } from "../../admin.core.v1";
import { serverConfigurationConfig } from "../../admin.extensions.v1/configs";
import { getSettingsSectionIcons } from "../configs";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import { ConnectorPropertyInterface, GovernanceConnectorInterface } from "../models/governance-connectors";

/**
 * Prop types for the edit connector component.
 */
interface EditConnectorProps extends TestableComponentInterface {
    connector: GovernanceConnectorInterface;
    connectorToggleName: string;
    categoryID: string;
    onUpdate: () => void;
}

/**
 * Edit connector component.
 *
 * @param EditConnectorProps - Props injected to the connector component.
 *
 * @returns a React.ReactElement.
 */
export const EditConnector: FunctionComponent<EditConnectorProps> = (
    props: EditConnectorProps
): ReactElement => {
    const {
        connector,
        categoryID,
        connectorToggleName,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ enableOption, setEnableOption ] = useState<boolean>(undefined);

    /**
     * Initial connector status.
     */
    useEffect(() => {
        if (connector) {
            // Remove enable option UI elements for connectors that are not allowed to be disabled.
            if (serverConfigurationConfig.connectorStatusViewDisabledConnectorIDs.includes(connector.id)) return;

            const enableProperty: ConnectorPropertyInterface = connector.properties.find(
                (property: ConnectorPropertyInterface) => property.name === connectorToggleName
            );

            setEnableOption(enableProperty?.value === "true");
        }
    }, [ connector ]);

    const resolveConnectorTitle = (connector: GovernanceConnectorInterface): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity.heading")
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountRecovery.passwordRecovery.heading")
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.botDetection.heading")
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.userOnboarding.selfRegistration.heading")
                );
            case ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID:
                return t("extensions:manage.serverConfigurations.analytics.heading");
            default:
                return connector?.friendlyName;
        }
    };

    const resolveConnectorDescription = (connector: GovernanceConnectorInterface): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity." +
                        "connectorDescription")
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountRecovery.passwordRecovery.connectorDescription")
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.botDetection.connectorDescription")
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.userOnboarding.selfRegistration.connectorDescription")
                );
            case ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID:
                return t("extensions:manage.serverConfigurations.analytics.subHeading");
            default:
                return (
                    connector?.description
                        ? connector.description
                        : connector?.friendlyName
                        && t("governanceConnectors:connectorSubHeading", {
                            name: connector?.friendlyName
                        })
                );
        }
    };

    const resolveConnectorIcon = (connector: GovernanceConnectorInterface): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (
                    getSettingsSectionIcons().accountLock
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (
                    getSettingsSectionIcons().botDetection
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return (
                    getSettingsSectionIcons().accountRecovery
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                    getSettingsSectionIcons().selfRegistration
                );
            default:
                return null;
        }
    };

    /**
     * Handle connector advance setting selection.
     */
    const handleSelection = () => {
        history.push(AppConstants.getPaths()
            .get("GOVERNANCE_CONNECTOR_EDIT")
            .replace(":categoryId", categoryID)
            .replace(":connectorId", connector?.id));
    };

    return (
        <SettingsSection
            data-testid={ `${testId}-${connector?.id}-settings-section` }
            description={ resolveConnectorDescription(connector) }
            icon={ resolveConnectorIcon(connector) }
            header={ resolveConnectorTitle(connector) }
            onPrimaryActionClick={ handleSelection }
            primaryAction={ "Configure" }
            connectorEnabled={ connector?.id ===  ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID
                ? undefined
                : enableOption
            }
        >
        </SettingsSection>
    );
};

/**
 * Default props for the component.
 */
EditConnector.defaultProps = {
    "data-testid": "dynamic-governance-connector"
};
