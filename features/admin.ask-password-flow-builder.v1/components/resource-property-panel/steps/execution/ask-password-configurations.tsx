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

import Alert from "@oxygen-ui/react/Alert/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import Divider from "@oxygen-ui/react/Divider";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Stack from "@oxygen-ui/react/Stack/Stack";
import Switch from "@oxygen-ui/react/Switch";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    AskPasswordFormConstants,
    ConnectorPropertyInterface,
    GovernanceConnectorConstants,
    GovernanceConnectorInterface,
    RevertGovernanceConnectorConfigInterface,
    ServerConfigurationsConstants,
    getConnectorDetails,
    revertGovernanceConnectorProperties
} from "@wso2is/admin.server-configurations.v1";
import {
    AskPasswordFormUpdatableConfigsInterface,
    AskPasswordFormValuesInterface,
    VerificationOption
} from "@wso2is/admin.server-configurations.v1/models/ask-password";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { RadioChild } from "@wso2is/forms";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import "./ask-password-configurations.scss";
import { Dispatch } from "redux";
import useAskPasswordFlowBuilder from "../../../../hooks/use-ask-password-flow-builder";

/**
 * Proptypes for the Ask Password Form props interface.
 */
export interface AskPasswordConfigurationsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    connector: GovernanceConnectorInterface;
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

/**
 * Ask Password Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AskPasswordConfigurations: FunctionComponent<AskPasswordConfigurationsPropsInterface> = (
    props: AskPasswordConfigurationsPropsInterface
): ReactElement => {

    const {
        connector,
        readOnly,
        ["data-componentid"]: componentId = "ask-password-edit-form"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        setConnector,
        setIsInvitedUserRegistrationConfigUpdated,
        setInvitedUserRegistrationConfig
    } = useAskPasswordFlowBuilder();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<AskPasswordFormValuesInterface>(undefined);
    const [ isInviteUserToSetPasswordEnabled, setIsInviteUserToSetPasswordEnabled ]= useState<boolean>(false);
    const [ isUpperCaseEnabled, setIsUpperCaseEnabled ] = useState<boolean>(false);
    const [ isLowerCaseEnabled, setIsLowerCaseEnabled ] = useState<boolean>(false);
    const [ isNumericEnabled, setIsNumericEnabled ] = useState<boolean>(false);
    const [ askPasswordOption, setAskPasswordOption ] = useState<string>(VerificationOption.EMAIL_LINK);
    const [ expiryTime, setExpiryTime ] = useState<string>("");
    const [ otpLength, setOtpLength ] = useState<string>("");
    const [ enableAccountActivationEmail, setEnableAccountActivationEmail ] = useState<boolean>(false);
    const [ enableAccountLockOnCreation, setEnableAccountLockOnCreation ] = useState<boolean>(false);
    const [ updatedConfigs, setUpdatedConfigs ] = useState<AskPasswordFormUpdatableConfigsInterface>(undefined);

    const showSmsOtpAskPasswordFeatureStatusChip: boolean =
            useSelector((state: AppState) => state?.config?.ui?.showSmsOtpAskPasswordFeatureStatusChip);

    /* Radio options for ask password */
    const EMAIL_ASK_PASSWORD_RADIO_OPTIONS: RadioChild[] = [
        {
            label: "extensions:manage.serverConfigurations.userOnboarding." +
                    "inviteUserToSetPassword.form.fields.emailAskPasswordOptions.emailLink.label",
            value: VerificationOption.EMAIL_LINK
        },
        {
            label: "extensions:manage.serverConfigurations.userOnboarding." +
                    "inviteUserToSetPassword.form.fields.emailAskPasswordOptions.emailOtp.label",
            value: VerificationOption.EMAIL_OTP
        },
        {
            label: "extensions:manage.serverConfigurations.userOnboarding." +
                    "inviteUserToSetPassword.form.fields.emailAskPasswordOptions.smsOtp.label",
            value: VerificationOption.SMS_OTP
        }
    ];

    /* Update states when initial values change
    *
    */
    useEffect(() => {
        if (!initialConnectorValues) return;
        setIsInviteUserToSetPasswordEnabled(initialConnectorValues.enableInviteUserToSetPassword ?? false);
        setIsUpperCaseEnabled(initialConnectorValues.otpUseUppercase ?? false);
        setIsLowerCaseEnabled(initialConnectorValues.otpUseLowercase ?? false);
        setIsNumericEnabled(initialConnectorValues.otpUseNumeric ?? false);
        setExpiryTime(initialConnectorValues.expiryTime ?? "");
        setOtpLength(initialConnectorValues.otpLength ?? "");
        setEnableAccountActivationEmail(initialConnectorValues.enableAccountActivationEmail ?? false);
        setEnableAccountLockOnCreation(initialConnectorValues.enableAccountLockOnCreation ?? false);

        if (initialConnectorValues.enableSmsOtp) {
            setAskPasswordOption(VerificationOption.SMS_OTP);
        } else if (initialConnectorValues.enableEmailOtp) {
            setAskPasswordOption(VerificationOption.EMAIL_OTP);
        } else {
            setAskPasswordOption(VerificationOption.EMAIL_LINK);
        }
    }, [ initialConnectorValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, any>) => {

        const data: AskPasswordFormUpdatableConfigsInterface = {
            "EmailVerification.AskPassword.AccountActivation": values.enableAccountActivationEmail !== undefined
                ? values.enableAccountActivationEmail
                : initialConnectorValues?.enableAccountActivationEmail,
            "EmailVerification.AskPassword.EmailOTP": askPasswordOption === VerificationOption.EMAIL_OTP,
            "EmailVerification.AskPassword.ExpiryTime": values.expiryTime !== undefined
                ? values.expiryTime
                : initialConnectorValues?.expiryTime,
            "EmailVerification.AskPassword.SMSOTP": askPasswordOption === VerificationOption.SMS_OTP,
            "EmailVerification.Enable": values.enableInviteUserToSetPassword !== undefined
                ? values.enableInviteUserToSetPassword
                : initialConnectorValues?.enableInviteUserToSetPassword,
            "EmailVerification.LockOnCreation": values.enableAccountLockOnCreation !== undefined
                ? values.enableAccountLockOnCreation
                : initialConnectorValues?.enableAccountLockOnCreation,
            "EmailVerification.OTP.OTPLength": values.otpLength !== undefined
                ? values.otpLength
                : initialConnectorValues?.otpLength,
            "EmailVerification.OTP.UseLowercaseCharactersInOTP": values.otpUseLowercase !== undefined
                ? values.otpUseLowercase
                : initialConnectorValues?.otpUseLowercase,
            "EmailVerification.OTP.UseNumbersInOTP": values.otpUseNumeric !== undefined
                ? values.otpUseNumeric
                : initialConnectorValues?.otpUseNumeric,
            "EmailVerification.OTP.UseUppercaseCharactersInOTP": values.otpUseUppercase !== undefined
                ? values.otpUseUppercase
                : initialConnectorValues?.otpUseUppercase
        };

        return data;
    };

    /*
    * Update updatedConfigs whenever any field changes
    *
    */
    useEffect(() => {
        setUpdatedConfigs(getUpdatedConfigurations({
            enableAccountActivationEmail: enableAccountActivationEmail,
            enableAccountLockOnCreation: enableAccountLockOnCreation,
            enableInviteUserToSetPassword: isInviteUserToSetPasswordEnabled,
            expiryTime: expiryTime,
            otpLength: otpLength,
            otpUseLowercase: isLowerCaseEnabled,
            otpUseNumeric: isNumericEnabled,
            otpUseUppercase: isUpperCaseEnabled
        }));
    }, [
        isInviteUserToSetPasswordEnabled,
        isUpperCaseEnabled,
        isLowerCaseEnabled,
        isNumericEnabled,
        expiryTime,
        otpLength,
        enableAccountActivationEmail,
        enableAccountLockOnCreation,
        askPasswordOption
    ]);

    /**
     * Handles form value changes.
     *
     */
    useEffect(() => {

        setInvitedUserRegistrationConfig(updatedConfigs);
        setIsInvitedUserRegistrationConfigUpdated(true);
    }, [
        updatedConfigs
    ]);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(connector?.properties)) {
            return;
        }

        let resolvedInitialValues: AskPasswordFormValuesInterface = null;

        connector.properties.map((property: ConnectorPropertyInterface) => {
            if (AskPasswordFormConstants.allowedConnectorFields.includes(property?.name)) {
                switch (property.name) {
                    case ServerConfigurationsConstants.ASK_PASSWORD_ENABLE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableInviteUserToSetPassword: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_LOCK_ON_CREATION:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableAccountLockOnCreation: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_ACCOUNT_ACTIVATION:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableAccountActivationEmail: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_EXPIRY_TIME:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            expiryTime: property.value
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_EMAIL_OTP:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableEmailOtp: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_SMS_OTP:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableSmsOtp: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_LOWERCASE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpUseLowercase: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_NUMERIC:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpUseNumeric: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_UPPERCASE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpUseUppercase: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_LENGTH:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpLength: property.value
                        };

                        break;
                    default:
                        // Invalid type is not handled since the form is generated based on the allowed fields.
                        break;
                }
            }
        });
        setInitialConnectorValues(resolvedInitialValues);
        setIsInviteUserToSetPasswordEnabled(resolvedInitialValues?.enableInviteUserToSetPassword);
        setIsUpperCaseEnabled(resolvedInitialValues?.otpUseUppercase);
        setIsLowerCaseEnabled(resolvedInitialValues?.otpUseLowercase);
        setIsNumericEnabled(resolvedInitialValues?.otpUseNumeric);
        setExpiryTime(resolvedInitialValues?.expiryTime);
        setOtpLength(resolvedInitialValues?.otpLength);
        setEnableAccountActivationEmail(resolvedInitialValues?.enableAccountActivationEmail);
        setEnableAccountLockOnCreation(resolvedInitialValues?.enableAccountLockOnCreation);
        if (resolvedInitialValues?.enableSmsOtp) {
            setAskPasswordOption(VerificationOption.SMS_OTP);
        } else if (resolvedInitialValues?.enableEmailOtp) {
            setAskPasswordOption(VerificationOption.EMAIL_OTP);
        } else {
            setAskPasswordOption(VerificationOption.EMAIL_LINK);
        }
    }, [ connector ]);

    if (!initialConnectorValues) {
        return null;
    }

    const connectorToggle = (): ReactElement =>  {
        return (
            <FormControlLabel
                control={
                    (<Switch
                        checked={ isInviteUserToSetPasswordEnabled }
                        onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                            setIsInviteUserToSetPasswordEnabled(event.target.checked)
                        }
                        disabled={ readOnly }
                        data-componentid={ `${ componentId }-invite-user-to-set-password-toggle` }
                    />)
                }
                label={
                    isInviteUserToSetPasswordEnabled
                        ? t("extensions:manage.serverConfigurations.generalEnabledLabel")
                        : t("extensions:manage.serverConfigurations.generalDisabledLabel")
                }
            />
        );
    };

    const handleRevertSuccess = () => {
        // Show Oxygen UI Alert using Alert and AlertTitle components
        dispatch({
            payload: {
                alert: (
                    <Alert severity="success">
                        <AlertTitle>
                            { t("governanceConnectors:notifications.revertConnector.success.message") }
                        </AlertTitle>
                        { t("governanceConnectors:notifications.revertConnector.success.description") }
                    </Alert>
                )
            },
            type: "SHOW_OXYGEN_ALERT"
        });
    };

    const handleRevertError = () => {
        dispatch({
            payload: {
                alert: (
                    <Alert severity="error">
                        <AlertTitle>
                            { t("governanceConnectors:notifications.revertConnector.error.message") }
                        </AlertTitle>
                        { t("governanceConnectors:notifications.revertConnector.error.description") }
                    </Alert>
                )
            },
            type: "SHOW_OXYGEN_ALERT"
        });
    };

    const loadConnectorDetails = () => {
        getConnectorDetails(
            ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
            ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID
        ).then((response: GovernanceConnectorInterface) => {
            // Set connector categoryID if not available
            if (!response?.categoryId) {
                response.categoryId = ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID;
            }
            setConnector(response);
        }).catch(() => {
            setConnector(undefined);
        });
    };

    const onAskPasswordRevert = () => {
        const revertRequest: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.ASK_PASSWORD_ENABLE,
                ServerConfigurationsConstants.ASK_PASSWORD_LOCK_ON_CREATION,
                ServerConfigurationsConstants.ASK_PASSWORD_ACCOUNT_ACTIVATION,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_EXPIRY_TIME,
                ServerConfigurationsConstants.ASK_PASSWORD_EMAIL_OTP,
                ServerConfigurationsConstants.ASK_PASSWORD_SMS_OTP,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_LOWERCASE,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_NUMERIC,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_UPPERCASE,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_LENGTH
            ]
        };

        revertGovernanceConnectorProperties(
            ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
            ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID,
            revertRequest
        )
            .then(() => {
                handleRevertSuccess();
            })
            .catch(() => {
                handleRevertError();
            }).finally(() => {
                loadConnectorDetails();
            });
    };

    return (
        <Stack gap={ 1 } data-componentid={ componentId }>
            <Stack gap={ 2 }>
                <Typography variant="h6">
                    { t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.subHeading") }
                </Typography>
                <Divider />
                <Typography>
                    <Alert severity="info">
                        Allow users to set their own passwords during admin-initiated onboarding
                        and configure related settings.
                    </Alert>
                </Typography>
                { ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE ? connectorToggle() : null }
                <Stack gap={ 1 }>
                    <Typography variant="body1">
                        { t("extensions:manage.serverConfigurations.userOnboarding." +
                        "inviteUserToSetPassword.form.fields.emailAskPasswordOptions.header") }
                    </Typography>
                    <Stack direction="column" spacing={ 1 } sx={ { pl: 3 } } >
                        <Box>
                            <RadioGroup
                                aria-label="ask-password-option"
                                name="askPasswordOption"
                                value={ askPasswordOption }
                                onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
                                    if (!isInviteUserToSetPasswordEnabled || readOnly) return;
                                    setAskPasswordOption(event.target.value as VerificationOption);
                                } }
                                row={ false }
                            >
                                { EMAIL_ASK_PASSWORD_RADIO_OPTIONS.map((option: RadioChild) => (
                                    <FormControlLabel
                                        key={ option.value }
                                        value={ option.value }
                                        control={
                                            (<Radio
                                                disabled={ !isInviteUserToSetPasswordEnabled || readOnly }
                                                data-componentid={
                                                    `${ componentId }-ask-password-option-${ option.value }`
                                                }
                                            />)
                                        }
                                        label={ t(option.label) }
                                    />
                                )) }
                            </RadioGroup>
                        </Box>
                    </Stack>
                    <br/>
                    <Stack direction="row" spacing={ 2 }>
                        <Typography variant="body1" sx={ { maxWidth: 180, minWidth: 100 } }>
                            { t("extensions:manage.serverConfigurations.userOnboarding." +
                                "inviteUserToSetPassword.form.fields.expiryTime.label") }
                        </Typography>
                        <Stack direction="row" spacing={ 0.5 }>
                            <TextField
                                component="text"
                                type="number"
                                aria-label="expiryTime"
                                name="expiryTime"
                                value={ expiryTime }
                                onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                                    setExpiryTime(event.target.value) }
                                placeholder={
                                    t("extensions:manage.serverConfigurations.userOnboarding." +
                                        "inviteUserToSetPassword.form.fields.expiryTime.placeholder") +
                                    " (-1: indefinite, 0: immediate)"
                                }
                                required={ false }
                                inputProps={ {
                                    max: GovernanceConnectorConstants
                                        .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE,
                                    maxLength: GovernanceConnectorConstants
                                        .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH,
                                    min: -1
                                } }
                                disabled={ !isInviteUserToSetPasswordEnabled || readOnly }
                                data-componentid={ `${ componentId }-link-expiry-time` }
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={ { alignSelf: "center" } }>
                                    mins
                            </Typography>
                        </Stack>
                    </Stack>
                    <FormControlLabel
                        control={
                            (<Checkbox
                                aria-label="enableAccountActivationEmail"
                                name="enableAccountActivationEmail"
                                checked={ enableAccountActivationEmail }
                                onChange={
                                    (event: React.ChangeEvent<HTMLInputElement>) =>
                                        setEnableAccountActivationEmail(event.target.checked)
                                }
                                required={ false }
                                disabled={ !isInviteUserToSetPasswordEnabled || readOnly }
                                data-componentid={ `${ componentId }-account-activation-email` }
                            />)
                        }
                        label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.form.fields.enableAccountActivationEmail.label") }
                    />
                    <FormControlLabel
                        control={
                            (<Checkbox
                                aria-label="enableAccountLockOnCreation"
                                name="enableAccountLockOnCreation"
                                checked={ enableAccountLockOnCreation }
                                onChange={
                                    (event: React.ChangeEvent<HTMLInputElement>) =>
                                        setEnableAccountLockOnCreation(event.target.checked)
                                }
                                required={ false }
                                disabled={ !isInviteUserToSetPasswordEnabled || readOnly }
                                data-componentid={ `${ componentId }-account-lock-on-creation` }
                            />)
                        }
                        label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.form.fields.enableAccountLockOnCreation.label") }
                    />
                    <Divider/>
                    <Typography variant="body1">
                        { t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.otpConfigHeading") }
                        { showSmsOtpAskPasswordFeatureStatusChip && (
                            <Chip
                                className="oxygen-menu-item-chip oxygen-chip-beta"
                                sx={ { ml: 1 } }
                            />
                        ) }
                    </Typography>
                    <FormControlLabel
                        control={
                            (<Checkbox
                                aria-label="otpUseUppercase"
                                name="otpUseUppercase"
                                checked={ isUpperCaseEnabled }
                                onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                                    setIsUpperCaseEnabled(event.target.checked) }
                                required={ false }
                                readOnly={ readOnly }
                                disabled={ !isInviteUserToSetPasswordEnabled
                                    || (isUpperCaseEnabled && !isLowerCaseEnabled && !isNumericEnabled)
                                    || askPasswordOption === VerificationOption.EMAIL_LINK }
                                data-componentid={ `${ componentId }-sms-otp-uppercase` }
                            />)
                        }
                        label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.form.fields.askPasswordOtpUseUppercase.label") }
                    />
                    <FormControlLabel
                        control={
                            (<Checkbox
                                aria-label="otpUseLowercase"
                                name="otpUseLowercase"
                                checked={ isLowerCaseEnabled }
                                onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                                    setIsLowerCaseEnabled(event.target.checked) }
                                required={ false }
                                readOnly={ readOnly }
                                disabled={ !isInviteUserToSetPasswordEnabled
                                    || (!isUpperCaseEnabled && isLowerCaseEnabled && !isNumericEnabled)
                                    || askPasswordOption === VerificationOption.EMAIL_LINK }
                                data-componentid={ `${ componentId }-sms-otp-lowercase` }
                            />)
                        }
                        label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.form.fields.askPasswordOtpUseLowercase.label") }
                    />
                    <FormControlLabel
                        control={
                            (<Checkbox
                                aria-label="otpUseNumeric"
                                name="otpUseNumeric"
                                checked={ isNumericEnabled }
                                onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                                    setIsNumericEnabled(event.target.checked) }
                                required={ false }
                                readOnly={ readOnly }
                                disabled={ !isInviteUserToSetPasswordEnabled
                                    || (!isUpperCaseEnabled && !isLowerCaseEnabled && isNumericEnabled)
                                    || askPasswordOption === VerificationOption.EMAIL_LINK }
                                data-componentid={ `${ componentId }-sms-otp-numeric` }
                            />)
                        }
                        label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.form.fields.askPasswordOtpUseNumeric.label") }
                    />
                    <br/>
                    <Stack direction="row" spacing={ 2 }>
                        <Typography variant="body1" sx={ { alignSelf: "center", maxWidth: 180, minWidth: 150 } }>
                            { t("extensions:manage.serverConfigurations.userOnboarding." +
                                "inviteUserToSetPassword.form.fields.askPasswordOtpLength.label") }
                        </Typography>
                        <Stack direction="row" spacing={ 0.5 }>
                            <TextField
                                component="text"
                                type="number"
                                aria-label="otpLength"
                                name="otpLength"
                                value={ otpLength }
                                onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                                    setOtpLength(event.target.value) }
                                placeholder="OTP Length"
                                required={ false }
                                inputProps={ {
                                    max: GovernanceConnectorConstants
                                        .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.OTP_CODE_LENGTH_MAX_VALUE,
                                    maxLength: GovernanceConnectorConstants
                                        .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.OTP_CODE_LENGTH_MAX_LENGTH,
                                    min: GovernanceConnectorConstants
                                        .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.OTP_CODE_LENGTH_MIN_VALUE,
                                    minLength: GovernanceConnectorConstants
                                        .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.OTP_CODE_LENGTH_MIN_LENGTH
                                } }
                                disabled={ !isInviteUserToSetPasswordEnabled
                                    || askPasswordOption === VerificationOption.EMAIL_LINK  || readOnly }
                                data-componentid={ `${ componentId }-otp-length` }
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={ { alignSelf: "center" } }
                            >
                                characters
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <br/>
                <Box display="flex" alignItems="center">
                    <Alert
                        severity="error"
                        sx={ { alignItems: "center", display: "flex", flex: 1, mb: 0 } }
                        action={
                            (<Button
                                color="inherit"
                                size="small"
                                sx={ { alignSelf: "center" } }
                                onClick={ () => { onAskPasswordRevert(); } }
                            >
                                Revert
                            </Button>)
                        }
                    >
                        { t("governanceConnectors:dangerZone.heading") }
                    </Alert>
                </Box>
            </Stack>
        </Stack>
    );
};
