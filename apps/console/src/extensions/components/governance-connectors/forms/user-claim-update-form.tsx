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
import { Label } from "semantic-ui-react";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants
} from "../../../../features/server-configurations";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import { UserClaimUpdateAPIRequestInterface, UserClaimUpdateFormValuesInterface } from "../models/user-claim-update";

/**
 * Interface for Password Recovery Configuration Form props.
 */
interface UserClaimUpdateConfigurationFormPropsInterface extends IdentifiableComponentInterface {
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

const FORM_ID: string = "governance-connectors-user-claim-update-form";

/**
 * Consent Information Controller Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const UserClaimUpdateConfigurationForm: FunctionComponent<
UserClaimUpdateConfigurationFormPropsInterface> = (
    props: UserClaimUpdateConfigurationFormPropsInterface
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
        = useState<UserClaimUpdateFormValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: UserClaimUpdateFormValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            switch (property.name) {
                case ServerConfigurationsConstants.EMAIL_VERIFICATION_ENABLE:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        enableEmailVerification: property.value === "true"
                    };

                    break;
                case ServerConfigurationsConstants.EMAIL_VERIFICATION_EXPIRY_TIME:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        emailVerificationExpiryTime: parseInt(property.value)
                    };

                    break;
                case ServerConfigurationsConstants.EMAIL_NOTIFICATION_ENABLE:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        enableEmailNotification: property.value === "true"
                    };

                    break;
                case ServerConfigurationsConstants.MOBILE_VERIFICATION_ENABLE:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        enableMobileVerification: property.value === "true"
                    };

                    break;
                case ServerConfigurationsConstants.MOBILE_VERIFICATION_EXPIRY_TIME:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        mobileVerificationExpiryTime: parseInt(property.value)
                    };

                    break;
                case ServerConfigurationsConstants.MOBILE_NOTIFICATION_ENABLE:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        enableMobileNotification: property.value === "true"
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
    const getUpdatedConfigurations = (values: UserClaimUpdateFormValuesInterface)
    : UserClaimUpdateAPIRequestInterface => {
        const data: UserClaimUpdateAPIRequestInterface = {
            "UserClaimUpdate.Email.EnableNotification": values?.enableEmailNotification,
            "UserClaimUpdate.Email.EnableVerification": values?.enableEmailVerification,
            "UserClaimUpdate.Email.VerificationCode.ExpiryTime": values?.emailVerificationExpiryTime?.toString(),
            "UserClaimUpdate.MobileNumber.EnableVerification": values?.enableMobileVerification,
            "UserClaimUpdate.MobileNumber.EnableVerificationByPrivilegedUser": values?.enableMobileNotification,
            "UserClaimUpdate.MobileNumber.VerificationCode.ExpiryTime": values.mobileVerificationExpiryTime?.toString()
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
                        getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_ENABLE)?.description }
                    key={ getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_ENABLE)?.name }
                    name="enableEmailVerification"
                    label={ getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_ENABLE)?.displayName }
                    required={ true }
                    maxLength={ null }
                    minLength={ null }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-
                        ${getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_ENABLE)?.name}` }
                />
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_ENABLE)?.description
                    }
                </Hint>
                <Field.Input
                    min={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS
                        .TIMEOUT_MIN_LENGTH }
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_EXPIRY_TIME)?.description }
                    inputType="number"
                    key={ getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_EXPIRY_TIME)?.name }
                    name="emailVerificationExpiryTime"
                    label={
                        getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_EXPIRY_TIME)?.displayName }
                    required={ true }
                    maxLength={ null }
                    minLength={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS
                        .TIMEOUT_MIN_LENGTH }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-
                        ${getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_EXPIRY_TIME)?.name}` }
                    labelPosition="right"
                >
                    <input/>
                    <Label
                        content={ "minutes" }
                    />
                </Field.Input>
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants.EMAIL_VERIFICATION_EXPIRY_TIME)?.description
                    }
                </Hint>
                <Field.Checkbox
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants.EMAIL_NOTIFICATION_ENABLE)?.description }
                    key={ getPropertyByName(ServerConfigurationsConstants.EMAIL_NOTIFICATION_ENABLE)?.name }
                    name="enableEmailNotification"
                    label={ getPropertyByName(ServerConfigurationsConstants.EMAIL_NOTIFICATION_ENABLE)?.displayName }
                    required={ true }
                    maxLength={ null }
                    minLength={ null }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-
                        ${getPropertyByName(ServerConfigurationsConstants.EMAIL_NOTIFICATION_ENABLE)?.name}` }
                />
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants.EMAIL_NOTIFICATION_ENABLE)?.description
                    }
                </Hint>
                <Field.Checkbox
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_ENABLE)?.description }
                    key={ getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_ENABLE)?.name }
                    name="enableMobileVerification"
                    label={ getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_ENABLE)?.displayName }
                    required={ true }
                    maxLength={ null }
                    minLength={ null }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-
                        ${getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_ENABLE)?.name}` }
                />
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_ENABLE)?.description
                    }
                </Hint>
                <Field.Input
                    min={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS
                        .TIMEOUT_MIN_LENGTH }
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_EXPIRY_TIME)?.description }
                    inputType="number"
                    key={ getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_EXPIRY_TIME)?.name }
                    name="mobileVerificationExpiryTime"
                    label={
                        getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_EXPIRY_TIME)?.displayName }
                    required={ true }
                    maxLength={ null }
                    minLength={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS
                        .TIMEOUT_MIN_LENGTH }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-
                        ${getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_EXPIRY_TIME)?.name}` }
                    labelPosition="right"
                >
                    <input/>
                    <Label
                        content={ "minutes" }
                    />
                </Field.Input>
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants.MOBILE_VERIFICATION_EXPIRY_TIME)?.description
                    }
                </Hint>
                <Field.Checkbox
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants.MOBILE_NOTIFICATION_ENABLE)?.description }
                    key={ getPropertyByName(ServerConfigurationsConstants.MOBILE_NOTIFICATION_ENABLE)?.name }
                    name="enableMobileNotification"
                    label={ getPropertyByName(ServerConfigurationsConstants.MOBILE_NOTIFICATION_ENABLE)?.displayName }
                    required={ true }
                    maxLength={ null }
                    minLength={ null }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-
                        ${getPropertyByName(ServerConfigurationsConstants.MOBILE_NOTIFICATION_ENABLE)?.name}` }
                />
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants.MOBILE_NOTIFICATION_ENABLE)?.description
                    }
                </Hint>
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="User claim update config update button"
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
UserClaimUpdateConfigurationForm.defaultProps = {
    "data-componentid": "user-claim-update-edit-form"
};
