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

import { ProfileSchemaInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form, FormFieldMessage } from "@wso2is/form";
import { ConfirmationModal, Text } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AppState } from "apps/console/src/features/core";
import { getUsernameConfiguration } from "apps/console/src/features/users/utils/user-management-utils";
import { useValidationConfigData } from "apps/console/src/features/validation/api";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Label } from "semantic-ui-react";
import { serverConfigurationConfig } from "../../../extensions/configs";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface } from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils";

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
    /**
     * Auto login after self registration.
     */
    autoLogin: boolean;
    /**
     * Dynamic properties.
     */
    [ key: string ]: string | boolean;
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

const FORM_ID: string = "governance-connectors-self-registration-form";

/**
 * Self Registration Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Self Registration Configuration Form component.
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
    const [ enableAccountActivateImmediately, setEnableAccountActivateImmediately ] = useState<boolean>(false);
    const [ enableAutoLogin, setEnableAutoLogin ] = useState<boolean>(false);
    const [ isAutoLoginOptionAvailable, setAutoLoginOptionAvailable ] = useState<boolean>(true);
    const [ isFirstTimeAccountConfirmationUpdate, setFirstTimeAccountConfirmationUpdate ] = useState<boolean>(true);
    const [ showSignUpConfirmationEnableModal, setShowSignUpConfirmationEnableConfirmationModal ]
        = useState<boolean>(false);
    const [ isAlphanumericUsernameEnabled, setAlphanumericUsernameEnabled ] = useState<boolean>(false);
    const [ emailRequired, setEmailRequired ] = useState<boolean>(false);

    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);

    const {
        data: validationData
    } = useValidationConfigData();

    useEffect(() => {
        const emailSchema: ProfileSchemaInterface = profileSchemas
            .find((schema: ProfileSchemaInterface) => (schema.name === "emails"));

        if (emailSchema) {
            setEmailRequired(emailSchema.required);
        }
    }, []);

    useEffect(() => {
        if (validationData) {
            setAlphanumericUsernameEnabled(getUsernameConfiguration(validationData)?.enableValidator === "true");
        }
    }, [ validationData ]);

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

            if (serverConfigurationConfig.dynamicConnectors) {
                resolvedInitialValues.set(property.name, property);
                resolvedInitialFormValues = {
                    ...resolvedInitialFormValues,
                    [ property.name ]: property.value
                };
            } else {
                if (allowedConnectorFields.includes(property.name)) {
                    resolvedInitialValues.set(property.name, property);
                }
            }

            if (property.name === LOCK_ON_CREATION) {
                if (property.value === "false") {
                    setEnableAccountActivateImmediately(true);
                    resolvedInitialFormValues = {
                        ...resolvedInitialFormValues,
                        accountActivateImmediately: true
                    };
                } else {
                    setEnableAccountConfirmation(true);
                    setAutoLoginOptionAvailable(false);
                    resolvedInitialFormValues = {
                        ...resolvedInitialFormValues,
                        signUpConfirmation: true
                    };
                }
            }
            if (property.name === AUTO_LOGIN_ENABLE) {
                if (property.value === "false") {
                    resolvedInitialFormValues = {
                        ...resolvedInitialFormValues,
                        autoLogin: false
                    };
                } else {
                    setEnableAutoLogin(true);
                    resolvedInitialFormValues = {
                        ...resolvedInitialFormValues,
                        autoLogin: true
                    };
                }
            }
            if (property.name === ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME) {
                resolvedInitialFormValues = {
                    ...resolvedInitialFormValues,
                    verificationLinkExpiryTime: property.value
                };
            }
            if (property.name === ACCOUNT_CONFIRMATION) {
                if (property.value === "false") {
                    setEnableAccountConfirmation(false);
                    setAutoLoginOptionAvailable(true);
                    resolvedInitialFormValues = {
                        ...resolvedInitialFormValues,
                        signUpConfirmation: false
                    };
                } else {
                    setEnableAccountConfirmation(true);
                    resolvedInitialFormValues = {
                        ...resolvedInitialFormValues,
                        signUpConfirmation: true
                    };
                }
            }
        });

        if ((get(resolvedInitialFormValues, "SelfRegistration.SendConfirmationOnCreation") === "true") ||
        (get(resolvedInitialFormValues, "SelfRegistration.LockOnCreation") === "true")) {
            setEnableAccountConfirmation(true);
            resolvedInitialFormValues = {
                ...resolvedInitialFormValues,
                signUpConfirmation: true
            };
        }

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
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, unknown>) => {
        let data: {
            "SelfRegistration.AutoLogin.Enable": string | boolean;
            "SelfRegistration.LockOnCreation": string | boolean;
            "SelfRegistration.NotifyAccountConfirmation": string | boolean;
            "SelfRegistration.SendConfirmationOnCreation": string | boolean;
            "SelfRegistration.VerificationCode.ExpiryTime": string | boolean | unknown;
            "SelfRegistration.Notification.InternallyManage"?: string | boolean;
        } = {
            "SelfRegistration.AutoLogin.Enable": values.autoLogin !== undefined
                ? !!enableAutoLogin
                : initialConnectorValues?.get("SelfRegistration.AutoLogin.Enable").value,
            "SelfRegistration.LockOnCreation": values.accountActivateImmediately === true ||
            enableAccountConfirmation == false
                ? false
                : true,
            "SelfRegistration.NotifyAccountConfirmation": enableAccountConfirmation !== undefined
                ? !!enableAccountConfirmation
                : initialConnectorValues?.get("SelfRegistration.NotifyAccountConfirmation").value,
            "SelfRegistration.SendConfirmationOnCreation": enableAccountConfirmation !== undefined
                ? !!enableAccountConfirmation
                : initialConnectorValues?.get("SelfRegistration.SendConfirmationOnCreation").value,
            "SelfRegistration.VerificationCode.ExpiryTime": values.verificationLinkExpiryTime !== undefined
                ? values.verificationLinkExpiryTime
                : initialConnectorValues?.get("SelfRegistration.VerificationCode.ExpiryTime").value
        };

        if (initialConnectorValues?.get("SelfRegistration.Notification.InternallyManage").value === "false" &&
            enableAccountConfirmation !== undefined && !!enableAccountConfirmation) {
            data = {
                ...data,
                "SelfRegistration.Notification.InternallyManage": true
            };
        }

        if (serverConfigurationConfig.dynamicConnectors) {

            const keysToOmit: string[] = [
                "autoLogin",
                "accountActivateImmediately",
                "verificationLinkExpiryTime",
                "signUpConfirmation",
                "SelfRegistration.LockOnCreation",
                "SelfRegistration.VerificationCode.ExpiryTime",
                "SelfRegistration.SendConfirmationOnCreation",
                "SelfRegistration",
                "SelfRegistration.Notification.InternallyManage",
                "SelfRegistration.ReCaptcha",
                "SelfRegistration.AutoLogin.Enable",
                "SelfRegistration.VerificationCode.SMSOTP.ExpiryTime",
                "SelfRegistration.CallbackRegex",
                "SelfRegistration.SMSOTP.Regex"
            ];

            for (const key in values) {
                if (!keysToOmit.includes(key)) {
                    data = {
                        ...data,
                        [ GovernanceConnectorUtils.decodeConnectorPropertyName(key) ]: values[ key ]
                    };
                }
            }
        }

        return data;
    };

    const getAccountVerificationMsg = (): FormFieldMessage => {

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
     * Handle Sign up confirmation at value changes of its checkbox.
     *
     * @param updatedStatus - New config value of the Sign up confirmation checkbox.
     */
    const handleSignUpConfirmation = (updatedStatus: boolean): void => {

        if (updatedStatus && enableAutoLogin) {
            setShowSignUpConfirmationEnableConfirmationModal(true);
        } else {
            updateSignUpConfirmation(updatedStatus);
        }
    };

    /**
     * Handle Sign up confirmation and Auto login configurations at value changes of
     * Sign up confirmation checkbox.
     *
     * @param updatedStatus - New config value of the Sign up confirmation checkbox.
     */
    const updateSignUpConfirmation = (updatedStatus: boolean): void => {

        setEnableAccountConfirmation(updatedStatus);
        if (isFirstTimeAccountConfirmationUpdate && updatedStatus) {
            setAutoLoginOptionAvailable(false);
            setEnableAutoLogin(false);
        } else {
            if (updatedStatus) {
                if (enableAccountActivateImmediately) {
                    setAutoLoginOptionAvailable(true);
                } else {
                    setAutoLoginOptionAvailable(false);
                    setEnableAutoLogin(false);
                }
            } else {
                setAutoLoginOptionAvailable(true);
            }
        }

        setFirstTimeAccountConfirmationUpdate(false);
    };

    /**
     * Handle Auto login and Activate account immediately configurations at value changes of
     * Activate account immediately checkbox.
     *
     * @param updatedStatus - New config value of the Activate account immediately checkbox.
     */
    const handleAccountActivateImmediately = (updatedStatus: boolean): void => {

        setEnableAccountActivateImmediately(updatedStatus);
        setAutoLoginOptionAvailable(updatedStatus);
        if ( !updatedStatus ) {
            setEnableAutoLogin(false);
        }
    };

    /**
     * Shows the account verification confirmation modal.
     * @returns Account verification confirmation modal component.
     */
    const renderSignUpConfirmationEnableWarning = (): ReactElement => {

        return (
            <ConfirmationModal
                onClose={ (): void => setShowSignUpConfirmationEnableConfirmationModal(false) }
                type="warning"
                open={ showSignUpConfirmationEnableModal }
                primaryAction={ t("common:continue") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={
                    (): void => {
                        setShowSignUpConfirmationEnableConfirmationModal(false);
                    }
                }
                onPrimaryActionClick={
                    (): void => {
                        setShowSignUpConfirmationEnableConfirmationModal(false);
                        updateSignUpConfirmation(true);
                    }
                }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("extensions:manage.serverConfigurations.userOnboarding.selfRegistration.form.fields."
                        + "signUpConfirmation.confirmation.heading") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                >
                    { t("extensions:manage.serverConfigurations.userOnboarding.selfRegistration.form.fields."
                        + "signUpConfirmation.confirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    {
                        (
                            <Trans
                                i18nKey="extensions:manage.serverConfigurations.userOnboarding.selfRegistration.form.
                                    fields.signUpConfirmation.confirmation.content">
                                Auto login requires account to be activated immediately after the registration.
                                When you proceed, auto login will be disabled. You can always re-enable it,
                                when you select <strong>Activate account immediately</strong> option.
                            </Trans>
                        )
                    }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Validate input data.
     *
     * @param values - Form values.
     * @returns Form validation.
     */
    const validateForm = (values: SelfRegistrationFormInitialValuesInterface): {
        verificationLinkExpiryTime: undefined
    }=> {

        const errors: {
            verificationLinkExpiryTime: undefined
        } = {
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

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            validate={ validateForm }
            initialValues={ initialFormValues }
            onSubmit={ (values: Record<string, unknown>) =>
                onSubmit(getUpdatedConfigurations(values))
            }
        >
            <Field.Checkbox
                ariaLabel="signUpConfirmation"
                name="signUpConfirmation"
                label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                    "selfRegistration.form.fields.signUpConfirmation.label") }
                listen={ (value: boolean) => handleSignUpConfirmation(value) }
                checked={ enableAccountConfirmation }
                required={ false }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled || (isAlphanumericUsernameEnabled && !emailRequired) }
                width={ 16 }
                data-testid={ `${testId}-notify-account-confirmation` }
                hint={ enableAccountConfirmation && t ("extensions:manage.serverConfigurations.userOnboarding" +
                    ".selfRegistration.form.fields.signUpConfirmation.hint") }
                message={ getAccountVerificationMsg() }
            />
            {
                isAlphanumericUsernameEnabled && !emailRequired && (
                    <Text
                        compact
                        weight={ "300" }
                        className="field-compact-description pb-3 pt-0"
                        size={ "13px" }
                    >
                        { t ("extensions:manage.serverConfigurations.userOnboarding" +
                            ".selfRegistration.accountVerificationWarning") }
                    </Text>
                )
            }
            { enableAccountConfirmation && (
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
            ) }
            { enableAccountConfirmation && (
                <Field.Checkbox
                    ariaLabel="accountActivateImmediately"
                    className="toggle"
                    name="accountActivateImmediately"
                    label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                        "selfRegistration.form.fields.activateImmediately.label") }
                    required={ false }
                    listen={ (value: boolean) => handleAccountActivateImmediately(value) }
                    readOnly={ readOnly }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${testId}-account-activate-immediately` }
                    message={
                        {
                            content: t("extensions:manage.serverConfigurations.userOnboarding." +
                                "selfRegistration.form.fields.activateImmediately.msg"),
                            type: "info"
                        }
                    }
                />
            ) }
            <Field.Checkbox
                ariaLabel="autoLogin"
                name="autoLogin"
                label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                    "selfRegistration.form.fields.enableAutoLogin.label") }
                listen={ (value: boolean) => setEnableAutoLogin(value) }
                checked={ enableAutoLogin }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled || !isAutoLoginOptionAvailable }
                width={ 16 }
                data-componentid={ `${testId}-enable-auto-login` }
                hint={
                    t("extensions:manage.serverConfigurations.userOnboarding." +
                        "selfRegistration.form.fields.enableAutoLogin.hint")
                }
            />
            <Field.Checkbox
                ariaLabel="SelfRegistration.NotifyAccountConfirmation"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "SelfRegistration.NotifyAccountConfirmation")
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "SelfRegistration.NotifyAccountConfirmation",
                    "Send sign up confirmation email") }
                defaultValue={ initialFormValues?.[
                    "SelfRegistration.NotifyAccountConfirmation" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-notification-sign-up-confirmation` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "SelfRegistration.NotifyAccountConfirmation",
                    "Enable sending notification for self sign up confirmation.")
                }
            />
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
            { showSignUpConfirmationEnableModal && renderSignUpConfirmationEnableWarning() }
        </Form>
    );
};

/**
 * Default props for the component.
 */
SelfRegistrationForm.defaultProps = {
    "data-testid": "self-registration-edit-form"
};
