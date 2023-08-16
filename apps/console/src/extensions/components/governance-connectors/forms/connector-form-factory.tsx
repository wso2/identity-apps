/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { SelfRegistrationForm } from "./self-registration-form";
import { LoginAttemptSecurityConfigurationFrom } from "./login-attempt-security-form";
import { GovernanceConnectorInterface, ServerConfigurationsConstants } from "../../../../features/server-configurations";
import { PasswordRecoveryConfigurationForm } from "./password-recovery-form";
import { FeatureConfigInterface, AppState } from "../../../../features/core";
import { useSelector } from "react-redux";

/**
 * Proptypes for the connector form factory component.
 */
interface ConnectorFormFactoryInterface extends TestableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param {any} values - Resolved Form Values.
     */
    onSubmit: (values) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * ID of Connector.
     */
    connectorId: string;
    /**
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Connector form factory.
 *
 * @param {ConnectorFormFactoryInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const ConnectorFormFactory: FunctionComponent<ConnectorFormFactoryInterface> = (
    props: ConnectorFormFactoryInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        connectorId,
        isConnectorEnabled,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const isReadOnly = useMemo(
        () =>
            !hasRequiredScopes(
                featureConfig?.attributeDialects,
                featureConfig?.attributeDialects?.scopes?.update,
                allowedScopes
            ),
        [ featureConfig, allowedScopes ]
    );

    switch (connectorId) {
        case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
            return (
                <SelfRegistrationForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ isConnectorEnabled }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
            return (
                <LoginAttemptSecurityConfigurationFrom
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ isConnectorEnabled }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
            return (
                <PasswordRecoveryConfigurationForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ isConnectorEnabled }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        default:
            return null;
    }
};

/**
 * Default proptypes for the IDP authenticator for factory component.
 */
ConnectorFormFactory.defaultProps = {
    "data-testid": "connector-edit-settings-form-factory"
};
