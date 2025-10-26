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

import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronDownIcon } from "@oxygen-ui/react-icons";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    AskPasswordFormConstants
} from "@wso2is/admin.server-configurations.v1/constants/ask-password-constants";
import {
    GovernanceConnectorConstants
} from "@wso2is/admin.server-configurations.v1/constants/governance-connector-constants";
import {
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import {
    AskPasswordFormUpdatableConfigsInterface,
    AskPasswordFormValuesInterface,
    VerificationOption
} from "@wso2is/admin.server-configurations.v1/models/ask-password";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "@wso2is/admin.server-configurations.v1/models/governance-connectors";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { RadioChild } from "@wso2is/forms";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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

    const {
        setIsInvitedUserRegistrationConfigUpdated,
        setInvitedUserRegistrationConfig
    } = useAskPasswordFlowBuilder();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<AskPasswordFormValuesInterface>(undefined);
    const [
        isInviteUserToSetPasswordEnabled,
        setIsInviteUserToSetPasswordEnabled
    ]= useState<boolean>(false);
    const [ isUpperCaseEnabled, setIsUpperCaseEnabled ] = useState<boolean>(false);
    const [ isLowerCaseEnabled, setIsLowerCaseEnabled ] = useState<boolean>(false);
    const [ isNumericEnabled, setIsNumericEnabled ] = useState<boolean>(false);
    const [ askPasswordOption, setAskPasswordOption ] = useState<string>(VerificationOption.EMAIL_LINK);
    const [ expiryTime, setExpiryTime ] = useState<string>("");
    const [ otpLength, setOtpLength ] = useState<string>("");
    const [ enableAccountLockOnCreation, setEnableAccountLockOnCreation ] = useState<boolean>(false);
    const [ updatedConfigs, setUpdatedConfigs ] = useState<AskPasswordFormUpdatableConfigsInterface>(undefined);
    const [ otpAccordionExpanded, setOtpAccordionExpanded ] = useState<boolean>(false);

    const showSmsOtpAskPasswordFeatureStatusChip: boolean =
            useSelector((state: AppState) => state?.config?.ui?.showSmsOtpAskPasswordFeatureStatusChip);

    /**
     * Radio options for ask password.
     */
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

    // Sync expansion with askPasswordOption.
    useEffect(() => {
        if (askPasswordOption !== VerificationOption.EMAIL_LINK) {
            setOtpAccordionExpanded(true);
        } else {
            setOtpAccordionExpanded(false);
        }
    }, [ askPasswordOption ]);

    /**
     * Update states when initial values change.
    */
    useEffect(() => {
        if (!initialConnectorValues) return;
        setIsUpperCaseEnabled(initialConnectorValues.otpUseUppercase ?? false);
        setIsLowerCaseEnabled(initialConnectorValues.otpUseLowercase ?? false);
        setIsNumericEnabled(initialConnectorValues.otpUseNumeric ?? false);
        setExpiryTime(initialConnectorValues.expiryTime ?? "");
        setOtpLength(initialConnectorValues.otpLength ?? "");
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
            "EmailVerification.AskPassword.AccountActivation": false,
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

    /**
     * Update updatedConfigs whenever any field changes.
    */
    useEffect(() => {
        setUpdatedConfigs(getUpdatedConfigurations({
            enableAccountLockOnCreation: enableAccountLockOnCreation,
            enableInviteUserToSetPassword: isInviteUserToSetPasswordEnabled,
            expiryTime: expiryTime,
            otpLength: otpLength,
            otpUseLowercase: isLowerCaseEnabled,
            otpUseNumeric: isNumericEnabled,
            otpUseUppercase: isUpperCaseEnabled
        }));
    }, [
        isUpperCaseEnabled,
        isLowerCaseEnabled,
        isNumericEnabled,
        expiryTime,
        otpLength,
        enableAccountLockOnCreation,
        askPasswordOption
    ]);

    /**
     * Handles form value changes.
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

    return (
        <Stack gap={ 1 } data-componentid={ componentId }>
            <Stack gap={ 2 }>
                <Typography>
                    <Alert severity="info">
                        { t("flows:core.executions.confirmationCode.configurationHint") }
                    </Alert>
                </Typography>
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
                                    if (readOnly) return;
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
                                                disabled={ readOnly }
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
                    <Stack direction="column" spacing={ 2 }>
                        <Typography variant="body1" sx={ { minWidth: 100 } }>
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
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-link-expiry-time` }
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={ { alignSelf: "center" } }>
                                    mins
                            </Typography>
                        </Stack>
                        <FormHelperText>
                            { t("extensions:manage.serverConfigurations.userOnboarding." +
                                    "inviteUserToSetPassword.form.fields.expiryTime.hint") }
                        </FormHelperText>
                    </Stack>
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
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-account-lock-on-creation` }
                            />)
                        }
                        label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.form.fields.enableAccountLockOnCreation.label") }
                    />
                    <FormHelperText>
                        { t("extensions:manage.serverConfigurations.userOnboarding." +
                                "inviteUserToSetPassword.form.fields.enableAccountLockOnCreation.hint") }
                    </FormHelperText>
                    <br/>
                    <Accordion
                        expanded={ otpAccordionExpanded }
                        onChange={ () => setOtpAccordionExpanded((prev: boolean) => !prev) }
                    >
                        <AccordionSummary
                            expandIcon={ <ChevronDownIcon /> }
                            aria-controls="otp-config-content"
                            id="otp-config-header"
                        >
                            <Typography variant="h6">
                                { t("extensions:manage.serverConfigurations.userOnboarding." +
                                    "inviteUserToSetPassword.otpConfigHeading") }
                                { showSmsOtpAskPasswordFeatureStatusChip && (
                                    <Chip
                                        className="oxygen-menu-item-chip oxygen-chip-beta"
                                        sx={ { ml: 1 } }
                                    />
                                ) }
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
                                        disabled={ (isUpperCaseEnabled && !isLowerCaseEnabled && !isNumericEnabled)
                                            || askPasswordOption === VerificationOption.EMAIL_LINK }
                                        data-componentid={ `${ componentId }-sms-otp-uppercase` }
                                    />)
                                }
                                label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                                    "inviteUserToSetPassword.form.fields.askPasswordOtpUseUppercase.label") }
                            />
                            <FormHelperText>
                                { t("extensions:manage.serverConfigurations.userOnboarding." +
                                        "inviteUserToSetPassword.form.fields.askPasswordOtpUseUppercase.hint") }
                            </FormHelperText>
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
                                        disabled={ (!isUpperCaseEnabled && isLowerCaseEnabled && !isNumericEnabled)
                                            || askPasswordOption === VerificationOption.EMAIL_LINK }
                                        data-componentid={ `${ componentId }-sms-otp-lowercase` }
                                    />)
                                }
                                label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                                    "inviteUserToSetPassword.form.fields.askPasswordOtpUseLowercase.label") }
                            />
                            <FormHelperText>
                                { t("extensions:manage.serverConfigurations.userOnboarding." +
                                        "inviteUserToSetPassword.form.fields.askPasswordOtpUseLowercase.hint") }
                            </FormHelperText>
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
                                        disabled={ (!isUpperCaseEnabled && !isLowerCaseEnabled && isNumericEnabled)
                                            || askPasswordOption === VerificationOption.EMAIL_LINK }
                                        data-componentid={ `${ componentId }-sms-otp-numeric` }
                                    />)
                                }
                                label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                                    "inviteUserToSetPassword.form.fields.askPasswordOtpUseNumeric.label") }
                            />
                            <FormHelperText>
                                { t("extensions:manage.serverConfigurations.userOnboarding." +
                                        "inviteUserToSetPassword.form.fields.askPasswordOtpUseNumeric.hint") }
                            </FormHelperText>
                            <br/>
                            <Stack direction="column" spacing={ 2 }>
                                <Typography variant="body1" sx={ { minWidth: 100 } }>
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
                                        disabled={ askPasswordOption === VerificationOption.EMAIL_LINK  || readOnly }
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
                                <FormHelperText>
                                    { t("extensions:manage.serverConfigurations.userOnboarding." +
                                            "inviteUserToSetPassword.form.fields.askPasswordOtpLength.hint") }
                                </FormHelperText>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Stack>
            </Stack>
        </Stack>
    );
};
