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
import { CommonUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "semantic-ui-react";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../models/governance-connectors";

/**
 * Interface for Password Recovery Configuration Form props.
 */
interface PasswordRecoveryConfigurationFormPropsInterface extends TestableComponentInterface {
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

/**
 * Form initial values interface.
 */
interface PasswordRecoveryFormInitialValuesInterface {
    /**
     * Recovery link expiry time.
     */
    expiryTime: string;
    /**
     * Notify user on successful password recovery.
     */
    notifySuccess: boolean;
}

/**
 * Proptypes for the Password Recovery Form error messages.
 */
export interface PasswordRecoveryFormErrorValidationsInterface {
    /**
     * Recovery link expiry time field.
     */
    expiryTime: string;
}

const allowedConnectorFields: string[] = [
    ServerConfigurationsConstants.NOTIFY_SUCCESS,
    ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME
];

const FORM_ID: string = "governance-connectors-password-recovery-form";

/**
 * Password Recovery Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const PasswordRecoveryConfigurationForm: FunctionComponent<PasswordRecoveryConfigurationFormPropsInterface> = (
    props: PasswordRecoveryConfigurationFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isConnectorEnabled,
        isSubmitting,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<PasswordRecoveryFormInitialValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: PasswordRecoveryFormInitialValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            if (allowedConnectorFields.includes(property.name)) {
                if (property.name === ServerConfigurationsConstants.NOTIFY_SUCCESS) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        notifySuccess: CommonUtils.parseBoolean(property.value)
                    };
                } else if (property.name === ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        expiryTime: property.value
                    };
                }
            }
        });
        setInitialConnectorValues(resolvedInitialValues);
    }, [ initialValues ]);

    /**
     * Validate input data.
     *
     * @param values - Form values.
     * @returns Form validation.
     */
    const validateForm = (values: any):
        PasswordRecoveryFormErrorValidationsInterface => {

        const errors: PasswordRecoveryFormErrorValidationsInterface = {
            expiryTime: undefined
        };

        if (!values.expiryTime) {
            // Check for required error.
            errors.expiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.expiryTime.validations.empty");
        } else if (!FormValidation.isInteger(values.expiryTime as unknown as number)) {
            // Check for invalid input.
            errors.expiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.expiryTime.validations.invalid");
        } else if ((parseInt(values.expiryTime, 10) < GovernanceConnectorConstants
            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE)
            || (parseInt(values.expiryTime, 10) > GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE)) {
            // Check for invalid range.
            errors.expiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.expiryTime.validations.range");
        } else if (values.expiryTime &&
            !FormValidation.isLengthValid(values.expiryTime as string, GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH)) {
            // Check for invalid input length.
            errors.expiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.expiryTime.validations.maxLengthReached");
        }

        return errors;
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, any>) => {
        const data: {
            "Recovery.ExpiryTime": any;
            "Recovery.NotifySuccess": boolean;
        } = {
            "Recovery.ExpiryTime": values.expiryTime !== undefined
                ? values.expiryTime
                : initialConnectorValues?.expiryTime,
            "Recovery.NotifySuccess": values.notifySuccess !== undefined
                ? !!values.notifySuccess
                : initialConnectorValues?.notifySuccess
        };

        return data;
    };

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <div className={ "connector-form" }>
            <Form
                id={ FORM_ID }
                initialValues={ initialConnectorValues }
                onSubmit={ (values: Record<string, any>) => onSubmit(getUpdatedConfigurations(values)) }
                validate={ validateForm }
                uncontrolledForm={ false }
            >
                <Field.Checkbox
                    ariaLabel="notifyRecoverySuccess"
                    name="notifySuccess"
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.notifySuccess.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${testId}-notify-success` }
                />
                <Hint className={ "mb-5" }>
                    {
                        t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.notifySuccess.hint")
                    }
                </Hint>
                <Field.Input
                    ariaLabel="expiryTime"
                    inputType="number"
                    name="expiryTime"
                    min={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .EXPIRY_TIME_MIN_VALUE
                    }
                    max={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .EXPIRY_TIME_MAX_VALUE
                    }
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.expiryTime.label") }
                    placeholder={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.expiryTime.placeholder") }
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    labelPosition="right"
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${testId}-link-expiry-time` }
                >
                    <input/>
                    <Label
                        content={ "mins" }
                    />
                </Field.Input>
                <Hint className={ "mb-5" }>
                    {
                        t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.expiryTime.hint")
                    }
                </Hint>
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Password Recovery update button"
                    name="update-button"
                    data-testid={ `${testId}-submit-button` }
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
PasswordRecoveryConfigurationForm.defaultProps = {
    "data-testid": "password-recovery-edit-form"
};
