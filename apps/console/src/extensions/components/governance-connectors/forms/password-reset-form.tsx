/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants
} from "../../../../features/server-configurations";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import { PasswordResetAPIRequestInterface, PasswordResetFormValuesInterface } from "../models/password-reset";

/**
 * Interface for Password Reset Configuration Form props.
 */
interface PasswordResetConfigurationFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

const FORM_ID: string = "governance-connectors-password-reset-form";

/**
 * Password Reset Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const PasswordResetConfigurationForm: FunctionComponent<
PasswordResetConfigurationFormPropsInterface> = (
    props: PasswordResetConfigurationFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isConnectorEnabled,
        isSubmitting,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<PasswordResetFormValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: PasswordResetFormValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            switch (property.name) {
                case ServerConfigurationsConstants.RECOVERY_LINK_PASSWORD_RESET:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        enableRecoveryLink: property.value === "true"
                    };

                    break;
                case ServerConfigurationsConstants.OTP_PASSWORD_RESET:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        enableOTP: property.value === "true"
                    };

                    break;
                case ServerConfigurationsConstants.OFFLINE_PASSWORD_RESET:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        enableOfflineOTP: property.value === "true"
                    };

                    break;
                case ServerConfigurationsConstants.ADMIN_FORCED_PASSWORD_RESET_EXPIRY_TIME:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        passwordResetExpiryTime: parseInt(property.value)
                    };

                    break;
            }
        });
        
        setInitialConnectorValues(resolvedInitialValues);        
    }, [ initialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: PasswordResetFormValuesInterface)
    : PasswordResetAPIRequestInterface => {
        const data: PasswordResetAPIRequestInterface = {
            "Recovery.AdminPasswordReset.ExpiryTime": values?.passwordResetExpiryTime?.toString(),
            "Recovery.AdminPasswordReset.OTP": values?.enableOTP,
            "Recovery.AdminPasswordReset.Offline": values?.enableOfflineOTP,
            "Recovery.AdminPasswordReset.RecoveryLink": values?.enableRecoveryLink
        };

        return data;
    };

    const getPropertyByName = (name: string): ConnectorPropertyInterface => {
        return initialValues?.properties?.find((property: ConnectorPropertyInterface) => property.name === name);
    };

    return (
        <div className={ "connector-form" }>
            <Form
                id={ FORM_ID }
                initialValues={ initialConnectorValues }
                onSubmit={ (values: any) => onSubmit(getUpdatedConfigurations(values)) }
                uncontrolledForm={ false }
            >
                <Field.Checkbox
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants
                            .RECOVERY_LINK_PASSWORD_RESET).description }
                    key={ getPropertyByName(ServerConfigurationsConstants
                        .RECOVERY_LINK_PASSWORD_RESET)?.name }
                    name="enableRecoveryLink"
                    label={
                        getPropertyByName(ServerConfigurationsConstants
                            .RECOVERY_LINK_PASSWORD_RESET)?.displayName }
                    required={ true }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-${getPropertyByName(ServerConfigurationsConstants
                        .RECOVERY_LINK_PASSWORD_RESET)?.name}` }
                />
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants
                            .RECOVERY_LINK_PASSWORD_RESET)?.description
                    }
                </Hint>
                <Field.Checkbox
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants
                            .OTP_PASSWORD_RESET).description }
                    key={ getPropertyByName(ServerConfigurationsConstants
                        .OTP_PASSWORD_RESET)?.name }
                    name="enableOTP"
                    label={
                        getPropertyByName(ServerConfigurationsConstants
                            .OTP_PASSWORD_RESET)?.displayName }
                    required={ true }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-${getPropertyByName(ServerConfigurationsConstants
                        .OTP_PASSWORD_RESET)?.name}` }
                />
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants
                            .OTP_PASSWORD_RESET)?.description
                    }
                </Hint>
                <Field.Checkbox
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants
                            .OFFLINE_PASSWORD_RESET).description }
                    key={ getPropertyByName(ServerConfigurationsConstants
                        .OFFLINE_PASSWORD_RESET)?.name }
                    name="enableOfflineOTP"
                    label={
                        getPropertyByName(ServerConfigurationsConstants
                            .OFFLINE_PASSWORD_RESET)?.displayName }
                    required={ true }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-${getPropertyByName(ServerConfigurationsConstants
                        .OFFLINE_PASSWORD_RESET)?.name}` }
                />
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants
                            .OFFLINE_PASSWORD_RESET)?.description
                    }
                </Hint>
                <Field.Input
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants
                            .ADMIN_FORCED_PASSWORD_RESET_EXPIRY_TIME).description }
                    key={ getPropertyByName(ServerConfigurationsConstants
                        .ADMIN_FORCED_PASSWORD_RESET_EXPIRY_TIME)?.name }
                    inputType="number"
                    minLength={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS.TIMEOUT_MIN_LENGTH }
                    maxLength={ null }
                    min={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS.TIMEOUT_MIN_LENGTH }
                    name="passwordResetExpiryTime"
                    label={
                        getPropertyByName(ServerConfigurationsConstants
                            .ADMIN_FORCED_PASSWORD_RESET_EXPIRY_TIME)?.displayName }
                    required={ true }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-${getPropertyByName(ServerConfigurationsConstants
                        .ADMIN_FORCED_PASSWORD_RESET_EXPIRY_TIME)?.name}` }
                />
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants
                            .ADMIN_FORCED_PASSWORD_RESET_EXPIRY_TIME)?.description
                    }
                </Hint>
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Password reset config update button"
                    name="update-button"
                    data-testid={ `${componentId}-submit-button` }
                    disabled={ isSubmitting }
                    loading={ isSubmitting }
                    label={ t("common:update") }
                    hidden={ !isConnectorEnabled || readOnly }
                />
            </Form>
        </div>
    );
};

/**
 * Default props for the component.
 */
PasswordResetConfigurationForm.defaultProps = {
    "data-componentid": "password-reset-edit-form"
};
