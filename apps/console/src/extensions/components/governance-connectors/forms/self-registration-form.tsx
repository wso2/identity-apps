/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Label } from "semantic-ui-react";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants
} from "../../../../features/server-configurations";
import { FormValidation } from "@wso2is/validation";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import get from "lodash-es/get";

/**
 * Form initial values interface.
 */
interface SelfRegistrationFormInitialValuesInterface {
    /**
     * Verify account after registration.
     */
    signUpConfirmation: boolean;
    /**
     * Account verification link expiry time.
     */
    verificationLinkExpiryTime: string;
    /**
     * Account lock on creation.
     */
    accountActivateImmediately: boolean;
}

/**
 * Interface for Self Registration Configuration Form props.
 */
interface SelfRegistrationFormPropsInterface extends TestableComponentInterface {
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
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

const NOTIFY_ACCOUNT_CONFIRMATION: string = "SelfRegistration.NotifyAccountConfirmation";
const AUTO_LOGIN_ENABLE: string = "SelfRegistration.AutoLogin.Enable";
const LOCK_ON_CREATION: string = "SelfRegistration.LockOnCreation";
const ACCOUNT_CONFIRMATION: string = "SelfRegistration.SendConfirmationOnCreation";

const allowedConnectorFields: string[] = [
    ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE,
    ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED,
    ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME,
    ServerConfigurationsConstants.RE_CAPTCHA,
    NOTIFY_ACCOUNT_CONFIRMATION,
    AUTO_LOGIN_ENABLE,
    LOCK_ON_CREATION
];

/**
 * Self Registration Configuration Form.
 *
 * @param {SelfRegistrationFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SelfRegistrationForm: FunctionComponent<SelfRegistrationFormPropsInterface> = (
    props: SelfRegistrationFormPropsInterface
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
        = useState<Map<string, ConnectorPropertyInterface>>(undefined);
    const [ initialFormValues, setInitialFormValues ]
        = useState<SelfRegistrationFormInitialValuesInterface>(undefined);
    const [ enableAccountConfirmation, setEnableAccountConfirmation ] = useState<boolean>(false);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(initialValues?.properties)) {
            return;
        }

        const resolvedInitialValues: Map<string, ConnectorPropertyInterface>
            = new Map<string, ConnectorPropertyInterface>();
        let resolvedInitialFormValues: SelfRegistrationFormInitialValuesInterface
            = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            if (allowedConnectorFields.includes(property.name)) {
                resolvedInitialValues.set(property.name, property);
            }
            if (property.name === LOCK_ON_CREATION && property.value === "false") {
                resolvedInitialFormValues = {
                    ...resolvedInitialFormValues,
                    accountActivateImmediately: true
                };
            }
            if (property.name === ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME) {
                resolvedInitialFormValues = {
                    ...resolvedInitialFormValues,
                    verificationLinkExpiryTime: property.value
                };
            }
            if (property.name === ACCOUNT_CONFIRMATION && property.value === "true") {
                setEnableAccountConfirmation(true);
                resolvedInitialFormValues = {
                    ...resolvedInitialFormValues,
                    signUpConfirmation: true
                };
            }
        });
        // Make accountActivateImmediately false if the account confirmation is false.
        if (get(resolvedInitialFormValues, "signUpConfirmation") !== true) {
            resolvedInitialFormValues.accountActivateImmediately = false;
        }
        setInitialConnectorValues(resolvedInitialValues);
        setInitialFormValues(resolvedInitialFormValues);
    }, [ initialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     *
     * @return Sanitized form values.
     */
    const getUpdatedConfigurations = (values) => {
        let data: any = {
            "SelfRegistration.NotifyAccountConfirmation": values.signUpConfirmation !== undefined
                ? !!values.signUpConfirmation
                : initialConnectorValues?.get("SelfRegistration.NotifyAccountConfirmation").value,
            "SelfRegistration.VerificationCode.ExpiryTime": values.verificationLinkExpiryTime !== undefined
                ? values.verificationLinkExpiryTime
                : initialConnectorValues?.get("SelfRegistration.VerificationCode.ExpiryTime").value,
            "SelfRegistration.LockOnCreation": (values.accountActivateImmediately !== undefined
                || values.signUpConfirmation !== undefined)
                ? !values.accountActivateImmediately && !!values.signUpConfirmation
                : initialConnectorValues?.get("SelfRegistration.LockOnCreation").value,
            "SelfRegistration.SendConfirmationOnCreation": values.signUpConfirmation !== undefined
                ? !!values.signUpConfirmation
                : initialConnectorValues?.get("SelfRegistration.SendConfirmationOnCreation").value
        };

        if (initialConnectorValues?.get("SelfRegistration.Notification.InternallyManage").value === "false" &&
            values.signUpConfirmation !== undefined && !!values.signUpConfirmation) {
            data = {
                ...data,
                "SelfRegistration.Notification.InternallyManage": true
            };
        }

        if (initialConnectorValues?.get("SelfRegistration.AutoLogin.Enable")?.value === "true") {
            data = {
                ...data,
                "SelfRegistration.AutoLogin.Enable": false
            };
        }

        // Temporarily make SelfRegistration.NotifyAccountConfirmation false.
        data = {
            ...data,
            "SelfRegistration.NotifyAccountConfirmation": false
        };

        return data;
    };

    const getAccountVerificationMsg = (): any => {

        if (!enableAccountConfirmation) {
            if (initialConnectorValues?.get(ServerConfigurationsConstants.RE_CAPTCHA)?.value === "true") {
                return {
                    content: t("extensions:manage.serverConfigurations.userOnboarding." +
                        "selfRegistration.form.fields.signUpConfirmation.recommendationMsg"),
                    type: "warning"
                };
            } else {
                return {
                    content: t("extensions:manage.serverConfigurations.userOnboarding." +
                            "selfRegistration.form.fields.signUpConfirmation.recommendationMsg") +
                        t("extensions:manage.serverConfigurations.userOnboarding." +
                            "selfRegistration.form.fields.signUpConfirmation.botMsg"),
                    type: "warning"
                };
            }
        }
    };

    /**
     * Validate input data.
     *
     * @param values
     */
    const validateForm = (values: any): any=> {

        const errors = {
            verificationLinkExpiryTime: undefined
        };

        if (!values.verificationLinkExpiryTime) {
            // Check for required error.
            errors.verificationLinkExpiryTime = t("extensions:manage.serverConfigurations.userOnboarding." +
                "selfRegistration.form.fields.expiryTime.validations.empty");
        } else if (!FormValidation.isInteger(values.verificationLinkExpiryTime as unknown as number)) {
            // Check for invalid input.
            errors.verificationLinkExpiryTime = t("extensions:manage.serverConfigurations.userOnboarding." +
                "selfRegistration.form.fields.expiryTime.validations.invalid");
        } else if ((parseInt(values.verificationLinkExpiryTime, 10) < GovernanceConnectorConstants
            .SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE)
            || (parseInt(values.verificationLinkExpiryTime, 10) > GovernanceConnectorConstants
                .SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE)) {
            // Check for invalid range.
            errors.verificationLinkExpiryTime = t("extensions:manage.serverConfigurations.userOnboarding." +
                "selfRegistration.form.fields.expiryTime.validations.range");
        } else if (values.verificationLinkExpiryTime &&
            !FormValidation.isLengthValid(values.verificationLinkExpiryTime as string, GovernanceConnectorConstants
                .SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH)) {
            // Check for invalid input length.
            errors.verificationLinkExpiryTime = t("extensions:manage.serverConfigurations.userOnboarding." +
                "selfRegistration.form.fields.expiryTime.validations.maxLengthReached");
        }

        return errors;
    };

    return (
        initialConnectorValues ?
            <Form
                initialValues={ initialFormValues }
                uncontrolledForm={ false }
                validate={ validateForm }
                onSubmit={ (values) => onSubmit(getUpdatedConfigurations(values)) }
            >
                <Field.Checkbox
                    ariaLabel="signUpConfirmation"
                    name="signUpConfirmation"
                    label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                        "selfRegistration.form.fields.signUpConfirmation.label") }
                    listen={ (value) => setEnableAccountConfirmation(value) }
                    required={ false }
                    readOnly={ readOnly }
                    disabled={ !isConnectorEnabled }
                    width={ 16 }
                    data-testid={ `${testId}-notify-account-confirmation` }
                    hint={ enableAccountConfirmation && t ("extensions:manage.serverConfigurations.userOnboarding" +
                        ".selfRegistration.form.fields.signUpConfirmation.hint") }
                    message={ getAccountVerificationMsg() }
                />
                { enableAccountConfirmation &&
                    <Field.Input
                        ariaLabel="verificationLinkExpiryTime"
                        inputType="number"
                        name="verificationLinkExpiryTime"
                        min={
                            GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                                .EXPIRY_TIME_MIN_VALUE
                        }
                        max={
                            GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                                .EXPIRY_TIME_MAX_VALUE
                        }
                        width={ 10 }
                        label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                            "selfRegistration.form.fields.expiryTime.label") }
                        required={ false }
                        hidden={ false }
                        placeholder={ t("extensions:manage.serverConfigurations.userOnboarding." +
                            "selfRegistration.form.fields.expiryTime.placeholder") }
                        maxLength={
                            GovernanceConnectorConstants
                                .SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                        }
                        labelPosition="right"
                        minLength={
                            GovernanceConnectorConstants
                                .SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                        }
                        readOnly={ readOnly }
                        disabled={ !isConnectorEnabled }
                        data-testid={ `${testId}-link-expiry-time` }
                    >
                        <input/>
                        <Label>mins</Label>
                    </Field.Input>
                }
                { enableAccountConfirmation &&
                    <Field.Checkbox
                        ariaLabel="accountActivateImmediately"
                        className="toggle"
                        name="accountActivateImmediately"
                        label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                            "selfRegistration.form.fields.activateImmediately.label") }
                        required={ false }
                        readOnly={ readOnly }
                        disabled={ !isConnectorEnabled }
                        data-testid={ `${testId}-notify-account-confirmation` }
                        message={
                            {
                                content: t("extensions:manage.serverConfigurations.userOnboarding." +
                                    "selfRegistration.form.fields.activateImmediately.msg"),
                                type: "info"
                            }
                        }
                    />
                }
                <Field.Button
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
            : null
    );
};

/**
 * Default props for the component.
 */
SelfRegistrationForm.defaultProps = {
    "data-testid": "self-registration-edit-form"
};
