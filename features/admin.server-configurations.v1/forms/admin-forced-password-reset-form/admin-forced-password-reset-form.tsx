/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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
export const AdminForcedPasswordResetForm: FunctionComponent<AdminForcedPasswordResetFormPropsInterface> = (
    props: AdminForcedPasswordResetFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isConnectorEnabled,
        isSubmitting,
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<AdminForcedPasswordResetFormValuesInterface>(undefined);
    const [ isForcePasswordResetEnabled, setIsForcePasswordResetEnabled ] = useState<boolean>(false);
    const [ resetOption, setResetOption ] = useState<string>(AdminForcedPasswordResetOption.EMAIL_LINK);

    const EMAIL_RECOVERY_RADIO_OPTIONS: RadioChild[] = [
        {
            label: "extensions:manage.serverConfigurations.accountRecovery.forcedPasswordRecovery.form.fields." +
                "enableEmailLinkBasedReset.label",
            value: AdminForcedPasswordResetOption.EMAIL_LINK
        },
        {
            label: "extensions:manage.serverConfigurations.accountRecovery.forcedPasswordRecovery.form.fields." +
                "enableEmailOTPBasedReset.label",
            value: AdminForcedPasswordResetOption.EMAIL_OTP
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
                    default:
                        // Invalid type is not handled since the form is generated based on the allowed fields.
                        break;
                }
            }
        });

        setInitialConnectorValues(resolvedInitialValues);
        setIsForcePasswordResetEnabled(resolvedInitialValues?.enableEmailLink || resolvedInitialValues?.enableEmailOtp);
        setResetOption(resolvedInitialValues?.enableEmailLink ?
            AdminForcedPasswordResetOption.EMAIL_LINK : AdminForcedPasswordResetOption.EMAIL_OTP);
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
                ? (resetOption === AdminForcedPasswordResetOption.EMAIL_OTP && isForcePasswordResetEnabled)
                : initialConnectorValues?.enableEmailOtp,
            "Recovery.AdminPasswordReset.RecoveryLink": resetOption !== undefined
                ? (resetOption === AdminForcedPasswordResetOption.EMAIL_LINK && isForcePasswordResetEnabled)
                : initialConnectorValues?.enableEmailLink
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
                <Field.Checkbox
                    ariaLabel="forcedPasswordRecovery"
                    name="forcedPasswordRecovery"
                    className="toggle"
                    label={ t("extensions:manage.serverConfigurations.accountRecovery.forcedPasswordRecovery.form." +
                        "heading.label") }
                    initialValue={ isForcePasswordResetEnabled }
                    listen={ (value: boolean) => setIsForcePasswordResetEnabled(value) }
                    readOnly={ readOnly }
                    disabled={ !isConnectorEnabled }
                    width={ 16 }
                    data-componentid={ `${ testId }-enable-admin-forced-password-reset` }
                    hint={  t("extensions:manage.serverConfigurations.accountRecovery.forcedPasswordRecovery.form." +
                        "heading.hint")
                    }
                />
                <Heading as="h6" className="sub-configuration-field sub-header">
                    { t( t("extensions:manage.serverConfigurations.accountRecovery.forcedPasswordRecovery.form." +
                        "subheading")) }
                </Heading>
                {
                    EMAIL_RECOVERY_RADIO_OPTIONS.map((option: RadioChild) => (
                        <Field.Radio
                            className="sub-configuration-field"
                            key={ option.value }
                            ariaLabel={ t(option.label) }
                            label={ t(option.label) }
                            name="recoveryOption"
                            type="radio"
                            value={ option.value }
                            checked={ resetOption === option.value }
                            listen={ () => setResetOption(option.value) }
                            disabled={ !isForcePasswordResetEnabled }
                            readOnly={ readOnly }
                            data-componentid={ `${ testId }-email-recovery-option-${ option.value }` }
                        />
                    ))
                }
                <Field.Input
                    className="sub-configuration-field sub-header"
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
                    disabled={ !isForcePasswordResetEnabled }
                    data-componentid={ `${ testId }-expiry-time` }
                >
                    <input/>
                    <label className="ui label">mins</label>
                </Field.Input>
                <Hint className="sub-configuration-field">
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "forcedPasswordRecovery.form.fields.expiryTime.hint") }
                </Hint>
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Self registration update button"
                    name="update-button"
                    data-testid={ `${testId}-submit-button` }
                    disabled={ !isConnectorEnabled || isSubmitting }
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
AdminForcedPasswordResetForm.defaultProps = {
    "data-componentid": "ask-password-edit-form"
};
