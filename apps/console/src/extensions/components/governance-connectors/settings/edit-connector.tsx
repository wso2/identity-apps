/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { SettingsSection } from "./settings-section";
import { AppConstants, history } from "../../../../features/core";
import { GovernanceConnectorInterface } from "../../../../features/server-configurations/models";
import { ServerConfigurationsConstants } from "../../../../features/server-configurations";
import { getSettingsSectionIcons } from "../../../../features/server-configurations/configs";

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
 * @param {EditConnectorProps} props - Props injected to the connector component.
 *
 * @return {React.ReactElement}
 */
export const EditConnector: FunctionComponent<EditConnectorProps> = (
    props: EditConnectorProps
): ReactElement => {
    const {
        connector,
        onUpdate,
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
            const enableProperty = connector.properties.find((property) => property.name === connectorToggleName);

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
            default:
                return connector?.friendlyName;
        }
    };

    const resolveConnectorDescription = (connector: GovernanceConnectorInterface): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity.connectorDescription")
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
            default:
                return (
                    connector?.description
                        ? connector.description
                        : connector?.friendlyName
                        && t("console:manage.features.governanceConnectors.connectorSubHeading", {
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
            connectorEnabled={ enableOption }
        >
            <Divider hidden/>
        </SettingsSection>
    );
};

/**
 * Default props for the component.
 */
EditConnector.defaultProps = {
    "data-testid": "dynamic-governance-connector"
};
