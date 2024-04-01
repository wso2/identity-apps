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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { AdminForcedPasswordResetForm } from "./admin-forced-password-reset";
import { AnalyticsConfigurationForm } from "./analytics-form";
import { AskPasswordForm } from "./ask-password";
import { LoginAttemptSecurityConfigurationFrom } from "./login-attempt-security-form";
import { MultiAttributeLoginForm } from "./multi-attribute-login";
import { PasswordRecoveryConfigurationForm } from "./password-recovery-form";
import { SelfRegistrationForm } from "./self-registration-form";
import { UsernameRecoveryConfigurationForm } from "./username-recovery-form";
import { AppState, FeatureConfigInterface, history } from "../../admin-core-v1";
import DynamicConnectorForm from "../components/governance-connectors/dynamic-connector-form";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import { ConnectorPropertyInterface, GovernanceConnectorInterface } from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils/governance-connector-utils";

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
     * @param any - values - Resolved Form Values.
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
 * @param ConnectorFormFactoryInterface - Props injected to the component.
 * @returns a ReactElement
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

    const isReadOnly: boolean = useMemo(
        () =>
            !hasRequiredScopes(
                featureConfig?.governanceConnectors,
                featureConfig?.governanceConnectors?.scopes?.update,
                allowedScopes
            ),
        [ featureConfig, allowedScopes ]
    );

    const path: string[] = history?.location?.pathname?.split("/");
    const type: string = path && path[ path.length - 3 ];

    const getConnectorInitialValues = (connector: GovernanceConnectorInterface) => {
        const values: Record<string, string | boolean>= {};

        connector?.properties.map((property: ConnectorPropertyInterface) => {
            if (property.value === "true") {
                values[ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) ] = true;
            } else if (property.value === "false") {
                values[ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) ] = false;
            } else {
                values[ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) ] = property.value;
            }
        });

        return values;
    };

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
            if (type === "username") {
                return (
                    <UsernameRecoveryConfigurationForm
                        onSubmit={ onSubmit }
                        initialValues={ initialValues }
                        readOnly={ isReadOnly }
                    />
                );
            }

            return (
                <PasswordRecoveryConfigurationForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ isConnectorEnabled }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID:
            return (
                <AnalyticsConfigurationForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ true }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID:
            return (
                <AskPasswordForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ true }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID:
            return (
                <MultiAttributeLoginForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ isConnectorEnabled }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.ADMIN_FORCED_PASSWORD_RESET:
            return (
                <AdminForcedPasswordResetForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ isConnectorEnabled }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        default:
            return (
                <DynamicConnectorForm
                    onSubmit={ onSubmit }
                    connector={ initialValues }
                    props={ initialValues }
                    initialValues={ getConnectorInitialValues(initialValues) }
                    form={ kebabCase(initialValues?.friendlyName) + "-form" }
                    data-testid={ `${ testId }-${ initialValues?.friendlyName }-form` }
                    isSubmitting={ isSubmitting }
                />
            );
    }
};

/**
 * Default proptypes for the IDP authenticator for factory component.
 */
ConnectorFormFactory.defaultProps = {
    "data-testid": "connector-edit-settings-form-factory"
};
