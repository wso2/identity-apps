/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { CommonUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { RadioChild } from "@wso2is/forms";
import { Heading, Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GovernanceConnectorConstants } from "../../constants";
import { AdminForcedPasswordResetFormConstants } from "../../constants/admin-forced-password-reset-constants";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import {
    AdminForcedPasswordResetFormPropsInterface,
    AdminForcedPasswordResetFormUpdatableConfigInterface,
    AdminForcedPasswordResetFormValuesInterface,
    AdminForcedPasswordResetOption
} from "../../models/admin-forced-password-reset";
import {
    ConnectorPropertyInterface } from "../../models/governance-connectors";
import "./admin-forced-password-reset-form.scss";

const FORM_ID: string = "governance-connectors-ask-password-form";

/**
 * Admin Forced Password Reset Form.
 *
 * @param props - Props injected to the component.
 * @returns Admin Forced Password Form component.
 */
export const AdminForcedPasswordResetForm: FunctionComponent<AdminForcedPasswordResetFormPropsInterface> = ({
    initialValues,
    onSubmit,
    readOnly,
    isConnectorEnabled,
    isSubmitting,
    ["data-componentid"]: componentId = "ask-password-edit-form"
} : AdminForcedPasswordResetFormPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<AdminForcedPasswordResetFormValuesInterface>(undefined);
    const [ resetOption, setResetOption ] = useState<string>(AdminForcedPasswordResetOption.EMAIL_LINK);

    const RECOVERY_RADIO_OPTIONS: RadioChild[] = [
        {
            label: "extensions:manage.serverConfigurations.accountRecovery.forcedPasswordRecovery.form.fields." +
                "enableEmailLinkBasedReset.label",
            value: AdminForcedPasswordResetOption.EMAIL_LINK
        },
        {
            label: "extensions:manage.serverConfigurations.accountRecovery.forcedPasswordRecovery.form.fields." +
                "enableEmailOTPBasedReset.label",
            value: AdminForcedPasswordResetOption.EMAIL_OTP
        },
        {
            label: "extensions:manage.serverConfigurations.accountRecovery.forcedPasswordRecovery.form.fields." +
                "enableSMSOTPBasedReset.label",
            value: AdminForcedPasswordResetOption.SMS_OTP
        }
    ];

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: AdminForcedPasswordResetFormValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            if (AdminForcedPasswordResetFormConstants.allowedConnectorFields.includes(property?.name)) {
                switch (property.name) {
                    case ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_EMAIL_LINK:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableEmailLink: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_EMAIL_OTP:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableEmailOtp: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ADMIN_FORCED_PASSWORD_RESET_EXPIRY_TIME:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            expiryTime: property.value
                        };

                        break;
                    case ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_SMS_OTP:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableSmsOtp: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    default:
                        // Invalid type is not handled since the form is generated based on the allowed fields.
                        break;
                }
            }
        });

        setInitialConnectorValues(resolvedInitialValues);

        // Set the default value for the reset option.
        let resetOptionValue: string = AdminForcedPasswordResetOption.EMAIL_LINK;

        if (resolvedInitialValues?.enableSmsOtp) {
            resetOptionValue = AdminForcedPasswordResetOption.SMS_OTP;
        } else if (resolvedInitialValues?.enableEmailOtp) {
            resetOptionValue = AdminForcedPasswordResetOption.EMAIL_OTP;
        }
        setResetOption(resetOptionValue);
    }, [ initialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, any>) => {
        const data: AdminForcedPasswordResetFormUpdatableConfigInterface = {
            "Recovery.AdminPasswordReset.ExpiryTime": values.expiryTime !== undefined
                ? values.expiryTime
                : initialConnectorValues?.expiryTime,
            "Recovery.AdminPasswordReset.OTP": resetOption !== undefined
                ? (resetOption === AdminForcedPasswordResetOption.EMAIL_OTP)
                : initialConnectorValues?.enableEmailOtp,
            "Recovery.AdminPasswordReset.Offline": false,
            "Recovery.AdminPasswordReset.RecoveryLink": resetOption !== undefined
                ? (resetOption === AdminForcedPasswordResetOption.EMAIL_LINK)
                : initialConnectorValues?.enableEmailLink,
            "Recovery.AdminPasswordReset.SMSOTP": resetOption !== undefined
                ? (resetOption === AdminForcedPasswordResetOption.SMS_OTP)
                : initialConnectorValues?.enableSmsOtp
        };

        return data;
    };

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <div className="connector-form admin-forced-password-reset-form">
            <Form
                id={ FORM_ID }
                uncontrolledForm={ false }
                initialValues={ initialConnectorValues }
                onSubmit={ (values: Record<string, unknown>) =>
                    onSubmit(getUpdatedConfigurations(values))
                }
            >
                <Heading as="h6" className="sub-header">
                    { t("extensions:manage.serverConfigurations.accountRecovery.forcedPasswordRecovery.form." +
                        "subheading") }
                </Heading>
                {
                    RECOVERY_RADIO_OPTIONS.map((option: RadioChild) => (
                        <Field.Radio
                            className="ui radio checkbox"
                            key={ option.value }
                            ariaLabel={ t(option.label) }
                            label={ t(option.label) }
                            name="recoveryOption"
                            type="radio"
                            value={ option.value }
                            checked={ resetOption === option.value }
                            listen={ () => setResetOption(option.value) }
                            readOnly={ readOnly }
                            data-componentid={ `${ componentId }-email-recovery-option-${ option.value }` }
                        />
                    ))
                }
                <Field.Input
                    className="sub-header"
                    ariaLabel="expiryTime"
                    inputType="number"
                    name="expiryTime"
                    min={
                        GovernanceConnectorConstants.FORCED_PASSWORD_RESET_FORM_FIELD_CONSTRAINTS.
                            EXPIRY_TIME_MIN_VALUE
                    }
                    max={
                        GovernanceConnectorConstants.FORCED_PASSWORD_RESET_FORM_FIELD_CONSTRAINTS.
                            EXPIRY_TIME_MAX_VALUE
                    }
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                                "forcedPasswordRecovery.form.fields.expiryTime.label") }
                    placeholder={ t("extensions:manage.serverConfigurations.accountRecovery." +
                                        "forcedPasswordRecovery.form.fields.expiryTime.placeholder") }
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants.FORCED_PASSWORD_RESET_FORM_FIELD_CONSTRAINTS.
                            EXPIRY_TIME_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants.FORCED_PASSWORD_RESET_FORM_FIELD_CONSTRAINTS.
                            EXPIRY_TIME_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    labelPosition="right"
                    data-componentid={ `${ componentId }-expiry-time` }
                >
                    <input/>
                    <label className="ui label">mins</label>
                </Field.Input>
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "forcedPasswordRecovery.form.fields.expiryTime.hint") }
                </Hint>
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Self registration update button"
                    name="update-button"
                    data-componentid={ `${ componentId }-submit-button` }
                    disabled={ !isConnectorEnabled || isSubmitting }
                    loading={ isSubmitting }
                    label={ t("common:update") }
                    hidden={ !isConnectorEnabled || readOnly }
                />
            </Form>
        </div>
    );
};
