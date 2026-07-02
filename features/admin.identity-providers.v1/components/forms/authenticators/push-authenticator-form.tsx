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

import { ConnectionUIConstants } from "@wso2is/admin.connections.v1/constants/connection-ui-constants";
import { LocalAuthenticatorConstants } from "@wso2is/admin.connections.v1/constants/local-authenticator-constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/forms";
import { FormSpy } from "react-final-form";
import { Code, ConfirmationModal, Heading, Link } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isBoolean from "lodash-es/isBoolean";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Icon, Label, Message } from "semantic-ui-react";
import { useGetPushDeviceMgtConfig, updatePushDeviceMgtConfig } from "../../../api/push-device-mgt-configs";
import {
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface,
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    DeviceRegistrationNotificationChannel,
    PushDeviceMgtConfigInterface
} from "../../../models";
import "./push-authenticator-form.scss";

/**
 * Interface for the Push Authenticator Form props.
 */
interface PushAuthenticatorFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Push Authenticator Metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * Push Authenticator configured initial values.
     */
    initialValues: CommonAuthenticatorFormInitialValuesInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Flag to trigger form submit externally.
     */
    triggerSubmit: boolean;
    /**
     * Flag to enable/disable form submit button.
     */
    enableSubmitButton: boolean;
    /**
     * Flag to show/hide custom properties.
     * @remarks Not implemented ATM. Do this when needed.
     */
    showCustomProperties: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Form initial values interface.
 */
interface PushAuthenticatorFormInitialValuesInterface {
    /**
     * Enable number challenge.
     */
    PUSH_EnableNumberChallenge: boolean;
    /**
     * Enable progressive enrollment.
     */
    PUSH_EnableProgressiveEnrollment: boolean;
    /**
     * Resend notification after time in seconds.
     */
    PUSH_ResendNotificationTime: number;
    /**
     * Resend notification max attempts.
     */
    PUSH_ResendNotificationMaxAttempts: number;
    /**
     * Enable multiple device enrollment.
     */
    PUSH_EnableMultipleDeviceEnrollment: boolean;
    /**
     * Maximum device limit for multiple device enrollment.
     */
    PUSH_MaximumDeviceLimit: number;
    /**
     * Enable progressive enrollment for multiple devices.
     */
    PUSH_EnableMultipleDeviceProgressiveEnrollment: boolean;
    /**
     * Enable device registration notifications.
     */
    PUSH_EnableDeviceRegistrationNotification: boolean;
    /**
     * Channel used for device registration notifications. Either `email` or `push`.
     */
    PUSH_DeviceRegistrationNotificationType: string;
}

/**
 * Form fields interface.
 */
interface PushAuthenticatorFormFieldsInterface {
    /**
     * Enable number challenge.
     */
    PUSH_EnableNumberChallenge: CommonAuthenticatorFormFieldInterface;
    /**
     * Enable progressive enrollment.
     */
    PUSH_EnableProgressiveEnrollment: CommonAuthenticatorFormFieldInterface;
    /**
     * Resend notification after time in seconds.
     */
    PUSH_ResendNotificationTime: CommonAuthenticatorFormFieldInterface;
    /**
     * Resend notification max attempts.
     */
    PUSH_ResendNotificationMaxAttempts: CommonAuthenticatorFormFieldInterface;
    /**
     * Enable multiple device enrollment.
     */
    PUSH_EnableMultipleDeviceEnrollment: CommonAuthenticatorFormFieldInterface;
    /**
     * Maximum device limit for multiple device enrollment.
     */
    PUSH_MaximumDeviceLimit: CommonAuthenticatorFormFieldInterface;
    /**
     * Enable progressive enrollment for multiple devices.
     */
    PUSH_EnableMultipleDeviceProgressiveEnrollment: CommonAuthenticatorFormFieldInterface;
    /**
     * Enable device registration notifications.
     */
    PUSH_EnableDeviceRegistrationNotification: CommonAuthenticatorFormFieldInterface;
    /**
     * Channel used for device registration notifications.
     */
    PUSH_DeviceRegistrationNotificationType: CommonAuthenticatorFormFieldInterface;
}

/**
 * Proptypes for the Push Authenticator Form error messages.
 */
interface PushAuthenticatorFormErrorValidationsInterface {
    /**
     * Enable number challenge.
     */
    PUSH_EnableNumberChallenge: string;
    /**
     * Enable progressive enrollment.
     */
    PUSH_EnableProgressiveEnrollment: string;
    /**
     * Resend notification after time in seconds.
     */
    PUSH_ResendNotificationTime: string;
    /**
     * Resend notification max attempts.
     */
    PUSH_ResendNotificationMaxAttempts: string;
    /**
     * Enable multiple device enrollment.
     */
    PUSH_EnableMultipleDeviceEnrollment: string;
    /**
     * Maximum device limit for multiple device enrollment.
     */
    PUSH_MaximumDeviceLimit: string;
    /**
     * Enable progressive enrollment for multiple devices.
     */
    PUSH_EnableMultipleDeviceProgressiveEnrollment: string;
    /**
     * Enable device registration notifications.
     */
    PUSH_EnableDeviceRegistrationNotification: string;
    /**
     * Channel used for device registration notifications.
     */
    PUSH_DeviceRegistrationNotificationType: string;
}

const FORM_ID: string = "push-authenticator-form";

/**
 * Channels available for device registration notifications.
 */
const EMAIL_NOTIFICATION_TYPE: string = "email";
const PUSH_NOTIFICATION_TYPE: string = "push";

/**
 * Push Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const PushAuthenticatorForm: FunctionComponent<PushAuthenticatorFormPropsInterface> = (
    props: PushAuthenticatorFormPropsInterface
): ReactElement => {
    const { 
        metadata,
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const { isSubOrganization } = useGetCurrentOrganizationType();
    const dispatch: Dispatch = useDispatch();

    // This can be used when `meta` support is there.
    const [ , setFormFields ] = useState<PushAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<PushAuthenticatorFormInitialValuesInterface>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isProgressiveEnrollmentEnabled, setIsProgressiveEnrollmentEnabled ] = useState<boolean>(false);
    const [ isMultipleDeviceEnrollmentEnabled, setIsMultipleDeviceEnrollmentEnabled ] = useState<boolean>(false);
    const [ isMultipleDeviceProgressiveEnrollmentEnabled, setIsMultipleDeviceProgressiveEnrollmentEnabled ] = useState<
        boolean
    >(false);
    const [isDeviceRegistrationNotificationEnabled, setIsDeviceRegistrationNotificationEnabled] = useState<boolean>(
        false
    );
    const [
        showMultipleDeviceProgressiveEnrollmentConfirmation,
        setShowMultipleDeviceProgressiveEnrollmentConfirmation
    ] = useState<boolean>(false);
    const formChangeRef: MutableRefObject<((name: string, value: unknown) => void) | null> = useRef<
        ((name: string, value: unknown) => void) | null
    >(null);

    const isReadOnly: boolean = isSubOrganization() || readOnly;

    const {
        data: pushDeviceMgtConfig,
        isLoading: isPushDeviceMgtConfigLoading,
        mutate: mutatePushDeviceMgtConfig
    } = useGetPushDeviceMgtConfig(!isSubOrganization());

    // Server-level upper bound sourced from the console deployment config
    // (`ui.pushDeviceManagement.maxDeviceLimitUpperBound`).
    const configuredMaxDeviceLimitUpperBound: number = useSelector(
        (state: AppState) => state?.config?.ui?.pushDeviceManagement?.maxDeviceLimitUpperBound
    );
    const maxDeviceLimitUpperBound: number =
        configuredMaxDeviceLimitUpperBound ??
        ConnectionUIConstants.PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.MAXIMUM_DEVICE_LIMIT_MAX_VALUE;

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties) || isPushDeviceMgtConfigLoading) {
            return;
        }

        const {
            resolvedFormFields,
            resolvedInitialValues
        } = resolveFormFields();

        setFormFields(resolvedFormFields);
        setInitialValues(resolvedInitialValues);
        setIsProgressiveEnrollmentEnabled(resolvedInitialValues?.PUSH_EnableProgressiveEnrollment ?? false);
        setIsMultipleDeviceEnrollmentEnabled(pushDeviceMgtConfig?.enableMultipleDeviceEnrollment ?? false);
        setIsMultipleDeviceProgressiveEnrollmentEnabled(
            resolvedInitialValues?.PUSH_EnableMultipleDeviceProgressiveEnrollment ?? false
        );
        setIsDeviceRegistrationNotificationEnabled(
            resolvedInitialValues?.PUSH_EnableDeviceRegistrationNotification ?? false
        );
    }, [ originalInitialValues, pushDeviceMgtConfig, isPushDeviceMgtConfigLoading ]);

    const resolveFormFields = () => {
        let resolvedFormFields: PushAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: PushAuthenticatorFormInitialValuesInterface = null;

        originalInitialValues.properties.forEach((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties
                .find((meta: CommonPluggableComponentMetaPropertyInterface) => meta.key === value.key);

            const moderatedName: string = value.name.replace(/\./g, "_");

            // Converting resend time from seconds to minutes.
            if (moderatedName === LocalAuthenticatorConstants.MODERATED_PUSH_RESEND_NOTIFICATION_TIME_KEY) {
                const resendTimeInMinutes: number = Math.round(parseInt(value.value,10) / 60);

                resolvedInitialValues = {
                    ...resolvedInitialValues,
                    [moderatedName]: resendTimeInMinutes
                };
                resolvedFormFields = {
                    ...resolvedFormFields,
                    [moderatedName]: {
                        meta,
                        value: resendTimeInMinutes.toString()
                    }
                };
            } else {
                resolvedFormFields = {
                    ...resolvedFormFields,
                    [moderatedName]: {
                        meta,
                        value: (value.value === "true" || value.value === "false")
                            ? JSON.parse(value.value)
                            : value.value
                    }
                };

                resolvedInitialValues = {
                    ...resolvedInitialValues,
                    [moderatedName]: (value.value === "true" || value.value === "false")
                        ? JSON.parse(value.value)
                        : value.value
                };
            }
        });

        // Merge push device management config values fetched from the dedicated endpoint.
        if (pushDeviceMgtConfig) {
            const configuredChannels: DeviceRegistrationNotificationChannel[] =
                pushDeviceMgtConfig.deviceRegistrationNotificationChannels ?? [];
            const isRegistrationNotificationEnabled: boolean =
                Boolean(pushDeviceMgtConfig.enableDeviceRegistrationNotifications);
            // Email takes precedence as the default channel when both / none are set,
            // since the form exposes only a single-choice radio.
            const registrationNotificationType: string =
                configuredChannels.includes(DeviceRegistrationNotificationChannel.PUSH_NOTIFICATION) &&
                !configuredChannels.includes(DeviceRegistrationNotificationChannel.EMAIL)
                    ? PUSH_NOTIFICATION_TYPE
                    : EMAIL_NOTIFICATION_TYPE;

            resolvedFormFields = {
                ...resolvedFormFields,
                PUSH_DeviceRegistrationNotificationType: {
                    meta: (null as unknown) as CommonPluggableComponentMetaPropertyInterface,
                    value: registrationNotificationType
                },
                PUSH_EnableDeviceRegistrationNotification: {
                    meta: (null as unknown) as CommonPluggableComponentMetaPropertyInterface,
                    value: isRegistrationNotificationEnabled.toString()
                },
                PUSH_EnableMultipleDeviceEnrollment: {
                    meta: (null as unknown) as CommonPluggableComponentMetaPropertyInterface,
                    value: pushDeviceMgtConfig.enableMultipleDeviceEnrollment.toString()
                },
                PUSH_MaximumDeviceLimit: {
                    meta: (null as unknown) as CommonPluggableComponentMetaPropertyInterface,
                    value: pushDeviceMgtConfig.maximumDeviceLimit.toString()
                }
            };
            resolvedInitialValues = {
                ...resolvedInitialValues,
                PUSH_DeviceRegistrationNotificationType: registrationNotificationType,
                PUSH_EnableDeviceRegistrationNotification: isRegistrationNotificationEnabled,
                PUSH_EnableMultipleDeviceEnrollment: pushDeviceMgtConfig.enableMultipleDeviceEnrollment,
                PUSH_MaximumDeviceLimit: pushDeviceMgtConfig.maximumDeviceLimit
            };
        }

        return {
            resolvedFormFields,
            resolvedInitialValues
        };
    };

    /**
     * Prepare form values for submitting.
     * Splits device management fields out to be sent to the dedicated endpoint,
     * and returns the remaining authenticator properties.
     *
     * @param values - Form values.
     * @returns Sanitized form values for the authenticator endpoint.
     */
    const getUpdatedConfigurations = (values: PushAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {
        const properties: CommonPluggableComponentPropertyInterface[] = [];

        const deviceMgtPropertyKeys: Set<string> = new Set([
            "PUSH_DeviceRegistrationNotificationType",
            "PUSH_EnableDeviceRegistrationNotification",
            "PUSH_EnableMultipleDeviceEnrollment",
            "PUSH_MaximumDeviceLimit"
        ]);

        for (const [ name, value ] of Object.entries(values)) {
            if (name == undefined || deviceMgtPropertyKeys.has(name)) {
                continue;
            }

                const moderatedName: string = name.replace(/_/g, ".");

            if (name === LocalAuthenticatorConstants.MODERATED_PUSH_RESEND_NOTIFICATION_TIME_KEY) {
                const timeInSeconds: number = value * 60;

                properties.push({
                    name: moderatedName,
                    value: timeInSeconds.toString()
                });

                continue;
            }

            properties.push({
                name: moderatedName,
                value: isBoolean(value) ? value.toString() : value
            });
        }

        return {
            ...originalInitialValues,
            properties
        };
    };

    /**
     * Extracts push device management config from the form values.
     *
     * @param values - Form values.
     * @returns Push device management configuration.
     */
    const getUpdatedPushDeviceMgtConfig = (
        values: PushAuthenticatorFormInitialValuesInterface
    ): PushDeviceMgtConfigInterface => {
        const selectedChannel: DeviceRegistrationNotificationChannel =
            values.PUSH_DeviceRegistrationNotificationType === PUSH_NOTIFICATION_TYPE
                ? DeviceRegistrationNotificationChannel.PUSH_NOTIFICATION
                : DeviceRegistrationNotificationChannel.EMAIL;

        return {
            deviceRegistrationNotificationChannels: [ selectedChannel ],
            enableDeviceRegistrationNotifications: Boolean(values.PUSH_EnableDeviceRegistrationNotification),
            enableMultipleDeviceEnrollment: values.PUSH_EnableMultipleDeviceEnrollment,
            maximumDeviceLimit: values.PUSH_EnableMultipleDeviceEnrollment ? Number(values.PUSH_MaximumDeviceLimit) : 1
        };
    };

    /**
     * Handles the form submit by calling both the authenticator settings endpoint
     * and the push device management configuration endpoint.
     *
     * @param values - Form values.
     */
    const handleFormSubmit = (values: PushAuthenticatorFormInitialValuesInterface): void => {
        setIsSubmitting(true);

        const deviceMgtConfig: PushDeviceMgtConfigInterface = getUpdatedPushDeviceMgtConfig(values);
        const authenticatorConfig: CommonAuthenticatorFormInitialValuesInterface = getUpdatedConfigurations(values);

        updatePushDeviceMgtConfig(deviceMgtConfig)
            .then(() => {
                onSubmit(authenticatorConfig);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(
                        addAlert({
                            description: t(
                                "authenticationProvider:notifications.updatePushAuthenticator.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t("authenticationProvider:notifications.updatePushAuthenticator.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t(
                                "authenticationProvider:notifications.updatePushAuthenticator.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "authenticationProvider:notifications.updatePushAuthenticator.genericError.message"
                            )
                        })
                    );
                }

                // Re-fetch the config so the form validates against the latest
                // server-enforced upper bound (it may have changed since page load).
                mutatePushDeviceMgtConfig();
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation
     */
    const validateForm = (values: PushAuthenticatorFormInitialValuesInterface):
        PushAuthenticatorFormErrorValidationsInterface => {

        const errors: PushAuthenticatorFormErrorValidationsInterface = {
            PUSH_EnableNumberChallenge: undefined,
            PUSH_EnableProgressiveEnrollment: undefined,
            PUSH_ResendNotificationMaxAttempts: undefined,
            PUSH_ResendNotificationTime: undefined,
            PUSH_EnableMultipleDeviceEnrollment: undefined,
            PUSH_EnableMultipleDeviceProgressiveEnrollment: undefined,
            PUSH_MaximumDeviceLimit: undefined,
            PUSH_EnableDeviceRegistrationNotification: undefined,
            PUSH_DeviceRegistrationNotificationType: undefined
        };

        if (!values.PUSH_ResendNotificationMaxAttempts) {
            // Check for required error.
            errors.PUSH_ResendNotificationMaxAttempts = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.allowedResendAttemptsCount.validations.required");
        } else if (!FormValidation.isInteger(values.PUSH_ResendNotificationMaxAttempts as unknown as number)) {
            // Check for invalid input.
            errors.PUSH_ResendNotificationMaxAttempts = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.allowedResendAttemptsCount.validations.invalid");
        } else if (values.PUSH_ResendNotificationMaxAttempts < ConnectionUIConstants
            .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MIN_VALUE
            || (values.PUSH_ResendNotificationMaxAttempts > ConnectionUIConstants
                .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MAX_VALUE)) {
            // Check for invalid range.
            errors.PUSH_ResendNotificationMaxAttempts = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.allowedResendAttemptsCount.validations.range");
        }

        if (values.PUSH_EnableMultipleDeviceEnrollment) {
            if (!values.PUSH_MaximumDeviceLimit) {
                errors.PUSH_MaximumDeviceLimit = t(
                    "authenticationProvider:forms" +
                        ".authenticatorSettings.push.maximumDeviceLimit.validations.required"
                );
            } else if (!FormValidation.isInteger((values.PUSH_MaximumDeviceLimit as unknown) as number)) {
                errors.PUSH_MaximumDeviceLimit = t(
                    "authenticationProvider:forms" +
                        ".authenticatorSettings.push.maximumDeviceLimit.validations.invalid"
                );
            } else if (
                values.PUSH_MaximumDeviceLimit <
                    ConnectionUIConstants.PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                        .MAXIMUM_DEVICE_LIMIT_MIN_VALUE ||
                values.PUSH_MaximumDeviceLimit > maxDeviceLimitUpperBound
            ) {
                errors.PUSH_MaximumDeviceLimit = t(
                    "authenticationProvider:forms" + ".authenticatorSettings.push.maximumDeviceLimit.validations.range",
                    {
                        max: maxDeviceLimitUpperBound,
                        min:
                            ConnectionUIConstants.PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                .MAXIMUM_DEVICE_LIMIT_MIN_VALUE
                    }
                );
            }
        }

        if (!values.PUSH_ResendNotificationTime) {
            // Check for required error.
            errors.PUSH_ResendNotificationTime = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.resendInterval.validations.required");
        } else if (!FormValidation.isInteger(values.PUSH_ResendNotificationTime as unknown as number)) {
            // Check for invalid input.
            errors.PUSH_ResendNotificationTime = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.resendInterval.validations.invalid");
        } else if (values.PUSH_ResendNotificationTime < ConnectionUIConstants
            .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MIN_VALUE
            || (values.PUSH_ResendNotificationTime > ConnectionUIConstants
                .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MAX_VALUE)) {
            // Check for invalid range.
            errors.PUSH_ResendNotificationTime = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.resendInterval.validations.range");
        }

        return errors;
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: Record<string, any>) =>{
                handleFormSubmit(values as PushAuthenticatorFormInitialValuesInterface);
            } }
            initialValues={ initialValues }
            validate={ validateForm }
        >
            <FormSpy subscription={{}}>
                {({ form }: { form: { change: (name: string, value: unknown) => void } }) => {
                    formChangeRef.current = form.change;

                    return null;
                }}
            </FormSpy>
            {
                !isSubOrganization() && (
                    <Message info>
                        <Icon name="info circle" />
                        <Trans
                            i18nKey={
                                "authenticationProvider:forms.authenticatorSettings" +
                                ".push.hint"
                            }
                        >
                            Ensure that an
                            <Link
                                external={ false }
                                onClick={ () => {
                                    history.push(
                                        AppConstants.getPaths().get("PUSH_PROVIDER")
                                    );
                                } }
                            >{" "}Push Provider
                            </Link>
                            &nbsp;is configured for the push notifications to be sent.
                        </Trans>
                    </Message>
                )
            }
            <Field.Checkbox
                ariaLabel="Enable number challenge"
                name="PUSH_EnableNumberChallenge"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.enableNumberChallenge.label")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.enableNumberChallenge.hint"
                        }
                    >
                        Please check this checkbox to enable number challenge during authentication.
                    </Trans>)
                }
                readOnly={ isReadOnly }
                width={ 16 }
                data-componentid={ `${ componentId }-push-enable-number-challenge-checkbox` }
            />
            <Field.Input
                ariaLabel="Push Notification Resend Interval"
                inputType="number"
                name="PUSH_ResendNotificationTime"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.resendInterval.label")
                }
                labelPosition="right"
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.resendInterval.placeholder")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.resendInterval.hint"
                        }
                    >
                        Please pich a value between <Code>1 minute</Code> & <Code>10 minutes</Code>.
                    </Trans>)
                }
                required={ true }
                readOnly={ isReadOnly }
                min={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MIN_VALUE
                }
                maxLength={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MAX_LENGTH
                }
                minLength={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MIN_LENGTH
                }
                width={ 12 }
                data-componentid={ `${ componentId }-push-resend-interval-input` }
            >
                <input />
                <Label>
                    {
                        t("authenticationProvider:forms.authenticatorSettings" +
                            ".push.resendInterval.unit")
                    }
                </Label>
            </Field.Input>
            <Field.Input
                ariaLabel="Push Notification Resend Attempts"
                inputType="number"
                name="PUSH_ResendNotificationMaxAttempts"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.allowedResendAttemptsCount.label")
                }
                labelPosition="right"
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.allowedResendAttemptsCount.placeholder")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.allowedResendAttemptsCount.hint"
                        }
                    >
                        Users will be limited to the specified resend attempt count when trying to resend the
                         push notification.
                    </Trans>)
                }
                required={ true }
                readOnly={ isReadOnly }
                min={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MIN_VALUE
                }
                maxLength={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MAX_LENGTH
                }
                minLength={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MIN_LENGTH
                }
                width={ 12 }
                data-componentid={ `${ componentId }-push-allowed-resend-attempts-input` }
            >
                <input />
                <Label>
                    {
                        t("authenticationProvider:forms.authenticatorSettings" +
                            ".push.allowedResendAttemptsCount.unit")
                    }
                </Label>
            </Field.Input>

            <Divider />

            <Heading as="h4">
                {t("authenticationProvider:forms.authenticatorSettings" + ".push.deviceManagementSettings.label")}
            </Heading>


            <Field.Checkbox
                ariaLabel="Enable device registration notifications"
                name="PUSH_EnableDeviceRegistrationNotification"
                label={t(
                    "authenticationProvider:forms.authenticatorSettings" +
                        ".push.enableDeviceRegistrationNotification.label"
                )}
                hint={
                    <Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.enableDeviceRegistrationNotification.hint"
                        }
                    >
                        When enabled, users will be notified when a new device is registered for push authentication.
                    </Trans>
                }
                readOnly={isReadOnly}
                width={16}
                listen={(value: boolean) => {
                    setIsDeviceRegistrationNotificationEnabled(value);
                    // Email is the default notification channel when the option is enabled.
                    if (value) {
                        formChangeRef.current?.("PUSH_DeviceRegistrationNotificationType", EMAIL_NOTIFICATION_TYPE);
                    }
                }}
                data-componentid={`${componentId}-push-enable-device-registration-notification-checkbox`}
            />
            {isDeviceRegistrationNotificationEnabled && (
                <Field.Radio
                    className="push-authenticator-nested-setting"
                    ariaLabel="Send device registration notifications via email"
                    name="PUSH_DeviceRegistrationNotificationType"
                    label={t(
                        "authenticationProvider:forms.authenticatorSettings" +
                            ".push.deviceRegistrationNotificationType.options.email"
                    )}
                    value={EMAIL_NOTIFICATION_TYPE}
                    readOnly={isReadOnly}
                    data-componentid={`${componentId}-push-device-registration-email-notification-radio`}
                />
            )}
            {isDeviceRegistrationNotificationEnabled && (
                <Field.Radio
                    className="push-authenticator-nested-setting"
                    ariaLabel="Send device registration notifications via push notification"
                    name="PUSH_DeviceRegistrationNotificationType"
                    label={t(
                        "authenticationProvider:forms.authenticatorSettings" +
                            ".push.deviceRegistrationNotificationType.options.push"
                    )}
                    value={PUSH_NOTIFICATION_TYPE}
                    readOnly={isReadOnly}
                    data-componentid={`${componentId}-push-device-registration-push-notification-radio`}
                />
            )}

            <Field.Checkbox
                ariaLabel="Enable progressive enrollment"
                name="PUSH_EnableProgressiveEnrollment"
                label={t(
                    "authenticationProvider:forms.authenticatorSettings" + ".push.enableProgressiveEnrollment.label"
                )}
                hint={
                    <Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.enableProgressiveEnrollment.hint"
                        }
                    >
                        Please check this checkbox to enable progressive enrollment.
                    </Trans>
                }
                readOnly={isReadOnly}
                width={16}
                listen={(value: boolean) => {
                    setIsProgressiveEnrollmentEnabled(value);
                    // Multiple-device progressive enrollment is nested under this option, so
                    // turning progressive enrollment off must also reset the nested setting.
                    if (!value) {
                        formChangeRef.current?.("PUSH_EnableMultipleDeviceProgressiveEnrollment", false);
                        setIsMultipleDeviceProgressiveEnrollmentEnabled(false);
                    }
                }}
                data-componentid={`${componentId}-push-enable-progressive-enrollment-checkbox`}
            />

            <Field.Checkbox
                ariaLabel="Enable multiple device enrollment"
                name="PUSH_EnableMultipleDeviceEnrollment"
                label={t(
                    "authenticationProvider:forms.authenticatorSettings" + ".push.enableMultipleDeviceEnrollment.label"
                )}
                hint={
                    <Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.enableMultipleDeviceEnrollment.hint"
                        }
                    >
                        Please check this checkbox to enable multiple device enrollment.
                    </Trans>
                }
                readOnly={isReadOnly}
                width={16}
                listen={(value: boolean) => {
                    setIsMultipleDeviceEnrollmentEnabled(value);
                    if (value) {
                        // Restore the configured limit when re-enabled. A limit of 1 is only
                        // valid for single device mode, so fall back to the allowed minimum.
                        // Clamp to the server-enforced upper bound in case it was lowered
                        // after the limit was originally configured.
                        const configuredLimit: number = pushDeviceMgtConfig?.maximumDeviceLimit;
                        const minLimit: number =
                            ConnectionUIConstants.PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                .MAXIMUM_DEVICE_LIMIT_MIN_VALUE;

                        formChangeRef.current?.(
                            "PUSH_MaximumDeviceLimit",
                            configuredLimit >= minLimit ? Math.min(configuredLimit, maxDeviceLimitUpperBound) : minLimit
                        );
                    } else {
                        formChangeRef.current?.("PUSH_MaximumDeviceLimit", 1);
                        // Multiple-device progressive enrollment is nested under this option, so
                        // turning multiple device enrollment off must also reset the nested setting.
                        formChangeRef.current?.("PUSH_EnableMultipleDeviceProgressiveEnrollment", false);
                        setIsMultipleDeviceProgressiveEnrollmentEnabled(false);
                    }
                }}
                data-componentid={`${componentId}-push-enable-multiple-device-enrollment-checkbox`}
            />
            {isMultipleDeviceEnrollmentEnabled && (
                <Field.Input
                    className="push-authenticator-nested-setting"
                    ariaLabel="Maximum Device Limit For Multiple Device Enrollment"
                    inputType="number"
                    name="PUSH_MaximumDeviceLimit"
                    label={t("authenticationProvider:forms.authenticatorSettings" + ".push.maximumDeviceLimit.label")}
                    labelPosition="right"
                    placeholder={t(
                        "authenticationProvider:forms.authenticatorSettings" + ".push.maximumDeviceLimit.placeholder"
                    )}
                    hint={
                        <Trans
                            i18nKey={
                                "authenticationProvider:forms.authenticatorSettings" + ".push.maximumDeviceLimit.hint"
                            }
                        >
                            Users will be limited to the specified device limit when multiple device enrollment is
                            enabled.
                        </Trans>
                    }
                    required={true}
                    readOnly={isReadOnly}
                    min={
                        ConnectionUIConstants.PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                            .MAXIMUM_DEVICE_LIMIT_MIN_VALUE
                    }
                    max={maxDeviceLimitUpperBound}
                    maxLength={String(maxDeviceLimitUpperBound).length}
                    minLength={
                        ConnectionUIConstants.PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                            .MAXIMUM_DEVICE_LIMIT_MIN_LENGTH
                    }
                    width={12}
                    data-componentid={`${componentId}-push-maximum-device-limit-input`}
                >
                    <input />
                    <Label>
                        {t("authenticationProvider:forms.authenticatorSettings" + ".push.maximumDeviceLimit.unit")}
                    </Label>
                </Field.Input>
            )}
            {isMultipleDeviceEnrollmentEnabled && isProgressiveEnrollmentEnabled && (
                <Field.Checkbox
                    className="push-authenticator-nested-setting"
                    ariaLabel="Enable progressive enrollment for multiple devices"
                    name="PUSH_EnableMultipleDeviceProgressiveEnrollment"
                    label={t(
                        "authenticationProvider:forms.authenticatorSettings" +
                            ".push.enableMultipleDeviceProgressiveEnrollment.label"
                    )}
                    hint={
                        <Trans
                            i18nKey={
                                "authenticationProvider:forms.authenticatorSettings" +
                                ".push.enableMultipleDeviceProgressiveEnrollment.hint"
                            }
                        >
                            Please check this checkbox to enable progressive enrollment when multiple device
                            enrollment is enabled.
                        </Trans>
                    }
                    readOnly={isReadOnly}
                    width={16}
                    listen={(value: boolean) => {
                        if (value) {
                            // Enabling is security-sensitive, so revert the optimistic toggle and
                            // gate it behind an explicit confirmation. The checkbox is flipped back
                            // on only after the user confirms in the modal.
                            formChangeRef.current?.("PUSH_EnableMultipleDeviceProgressiveEnrollment", false);
                            setShowMultipleDeviceProgressiveEnrollmentConfirmation(true);
                        } else {
                            setIsMultipleDeviceProgressiveEnrollmentEnabled(false);
                        }
                    }}
                    data-componentid={`${componentId}-push-enable-multiple-device-progressive-enrollment-checkbox`}
                />
            )}
            {isMultipleDeviceEnrollmentEnabled &&
                isProgressiveEnrollmentEnabled &&
                isMultipleDeviceProgressiveEnrollmentEnabled && (
                <Message
                    warning
                    className="push-authenticator-nested-setting"
                    data-componentid={`${componentId}-push-multiple-device-progressive-enrollment-warning`}
                >
                    <Icon name="warning sign" />
                    {t(
                        "authenticationProvider:forms.authenticatorSettings.push" +
                            ".enableMultipleDeviceProgressiveEnrollment.securityWarning"
                    )}
                </Message>
            )}
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Push Authenticator update button"
                name="update-button"
                data-componentid={ `${ componentId }-submit-button` }
                disabled={ isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={ isReadOnly }
            />
            {showMultipleDeviceProgressiveEnrollmentConfirmation && (
                <ConfirmationModal
                    type="warning"
                    open={showMultipleDeviceProgressiveEnrollmentConfirmation}
                    assertionType="checkbox"
                    assertionHint={t(
                        "authenticationProvider:confirmations" +
                            ".enableMultipleDeviceProgressiveEnrollment.assertionHint"
                    )}
                    primaryAction={t("common:confirm")}
                    secondaryAction={t("common:cancel")}
                    onClose={(): void => setShowMultipleDeviceProgressiveEnrollmentConfirmation(false)}
                    onSecondaryActionClick={(): void => setShowMultipleDeviceProgressiveEnrollmentConfirmation(false)}
                    onPrimaryActionClick={(): void => {
                        formChangeRef.current?.("PUSH_EnableMultipleDeviceProgressiveEnrollment", true);
                        setIsMultipleDeviceProgressiveEnrollmentEnabled(true);
                        setShowMultipleDeviceProgressiveEnrollmentConfirmation(false);
                    }}
                    closeOnDimmerClick={false}
                    data-componentid={`${componentId}-push-multiple-device-progressive-enrollment-confirmation`}
                >
                    <ConfirmationModal.Header
                        data-componentid={`${componentId}-push-multiple-device-progressive-enrollment-confirmation-header`}
                    >
                        {t(
                            "authenticationProvider:confirmations" + ".enableMultipleDeviceProgressiveEnrollment.header"
                        )}
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        warning
                        data-componentid={`${componentId}-push-multiple-device-progressive-enrollment-confirmation-message`}
                    >
                        {t(
                            "authenticationProvider:confirmations" +
                                ".enableMultipleDeviceProgressiveEnrollment.message"
                        )}
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={`${componentId}-push-multiple-device-progressive-enrollment-confirmation-content`}
                    >
                        {t(
                            "authenticationProvider:confirmations" +
                                ".enableMultipleDeviceProgressiveEnrollment.content"
                        )}
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            )}
        </Form>
    );
};

/**
 * Default props for the component.
 */
PushAuthenticatorForm.defaultProps = {
    "data-componentid": "push-authenticator-form",
    enableSubmitButton: true
};
