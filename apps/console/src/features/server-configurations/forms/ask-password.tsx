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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { 
    DeprecatedFeatureInterface, 
    FeatureAccessConfigInterface, 
    IdentifiableComponentInterface 
} from "@wso2is/core/models";
import { Field, Form, FormFieldMessage } from "@wso2is/form";
import { ConfirmationModal, Hint, Text } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AppState } from "apps/console/src/features/core";
import { getUsernameConfiguration } from "apps/console/src/features/users/utils/user-management-utils";
import { useValidationConfigData } from "apps/console/src/features/validation/api";
import camelCase from "lodash-es/camelCase";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import { FeatureConfigInterface } from "modules/common/src/models/config";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Label } from "semantic-ui-react";
import { serverConfigurationConfig } from "../../../extensions/configs";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface } from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils";

/**
 * Interface for ask password form props.
 */
interface AskPasswordFormPropsInterface extends IdentifiableComponentInterface {
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

const FORM_ID: string = "governance-connectors-ask-password-form";

/**
 * Ask Password Form.
 *
 * @param props - Props injected to the component.
 * @returns Ask Password Form component.
 */
export const AskPasswordForm: FunctionComponent<AskPasswordFormPropsInterface> = (
    props: AskPasswordFormPropsInterface
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
        = useState<Map<string, ConnectorPropertyInterface>>(undefined);
    const [ initialFormValues, setInitialFormValues ]
        = useState<any>(undefined);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isReadOnly: boolean = useMemo(() => (
        !hasRequiredScopes(
            featureConfig?.governanceConnectors, featureConfig?.governanceConnectors?.scopes?.update, allowedScopes)
    ), [ featureConfig, allowedScopes ]);
    
    const gonvernanConnectorsConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.governanceConnectors);
    const passwordPatternConnector: DeprecatedFeatureInterface = gonvernanConnectorsConfig.deprecatedFeaturesToShow.find((feature) => {
        return feature?.name === "passwordPolicy";
    });


    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(initialValues?.properties)) {
            return;
        }

        const resolvedInitialValues: Map<string, ConnectorPropertyInterface>
            = new Map<string, ConnectorPropertyInterface>();
        let resolvedInitialFormValues: any
            = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {

            resolvedInitialValues.set(property.name, property);
            resolvedInitialFormValues = {
                ...resolvedInitialFormValues,
                [ property.name ]: property.value
            };
        });

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
        let data = {};

        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key) 
            && key !== ServerConfigurationsConstants.ASK_PASSWORD_ENABLE) {
                data = {
                    ...data,
                    [ GovernanceConnectorUtils.decodeConnectorPropertyName(key) ]: values[ key ]
                };
            }
        }

        return data;
    };   
   
    if (!initialConnectorValues) {
        return null;
    }

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ true }
            initialValues={ initialFormValues }
            onSubmit={ (values: Record<string, unknown>) => 
                onSubmit(getUpdatedConfigurations(values)) 
            }
        >
            <Field.Checkbox
                ariaLabel="EmailVerification.OTP.SendOTPInEmail"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.OTP.SendOTPInEmail") }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.OTP.SendOTPInEmail", 
                    "Send OTP in e-mail") }
                defaultValue={ initialFormValues?.[ 
                    "EmailVerification.OTP.SendOTPInEmail" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.OTP.SendOTPInEmail", 
                    "Enable to send OTP in verification e-mail instead of confirmation code.")
                }
            />
            <Field.Checkbox
                ariaLabel="EmailVerification.OTP.UseUppercaseCharactersInOTP"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.OTP.UseUppercaseCharactersInOTP") 
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.OTP.UseUppercaseCharactersInOTP", 
                    "Include uppercase characters in OTP") }
                defaultValue={ initialFormValues?.[ 
                    "EmailVerification.OTP.UseUppercaseCharactersInOTP" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.OTP.UseUppercaseCharactersInOTP", 
                    "Enable to include uppercase characters in SMS and e-mail OTPs.")
                }
            />
            <Field.Checkbox
                ariaLabel="EmailVerification.OTP.UseLowercaseCharactersInOTP"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.OTP.UseLowercaseCharactersInOTP") 
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.OTP.UseLowercaseCharactersInOTP", 
                    "Include lowercase characters in OTP") }
                defaultValue={ initialFormValues?.[ 
                    "EmailVerification.OTP.UseLowercaseCharactersInOTP" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.OTP.UseLowercaseCharactersInOTP", 
                    "Enable to include lowercase characters in SMS and e-mail OTPs.")
                }
            />
            <Field.Checkbox
                ariaLabel="EmailVerification.OTP.UseNumbersInOTP"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.OTP.UseNumbersInOTP") 
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.OTP.UseNumbersInOTP", 
                    "Include numbers in OTP") }
                defaultValue={ initialFormValues?.[ 
                    "EmailVerification.OTP.UseNumbersInOTP" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.OTP.UseNumbersInOTP", 
                    "Enable to include numbers in SMS and e-mail OTPs.")
                }
            />
            <Field.Input
                ariaLabel="EmailVerification.OTP.OTPLength"
                inputType="text"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.OTP.OTPLength"
                ) }
                type="text"
                width={ 16 }
                required={ true }
                placeholder={ "Enter OTP length" }
                labelPosition="top"
                minLength={ 3 }
                maxLength={ 100 }
                readOnly={ readOnly }
                initialValue={ initialFormValues?.[ "EmailVerification.OTP.OTPLength" ] }
                data-testid={ `${ testId }-otp-length` }
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.OTP.OTPLength", 
                    "OTP length") 
                }
                disabled={ !isConnectorEnabled }
            />
            <Hint>
                { GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.OTP.OTPLength", 
                    "Length of the OTP for SMS and e-mail verifications. OTP length must be 4-10.") 
                }
            </Hint>
            <Field.Checkbox
                ariaLabel="EmailVerification.LockOnCreation"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.LockOnCreation") 
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.LockOnCreation", 
                    "Enable account lock on creation") }
                defaultValue={ initialFormValues?.[ 
                    "EmailVerification.LockOnCreation" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.LockOnCreation", 
                    "The user account will be locked during user creation.")
                }
            />
            <Field.Checkbox
                ariaLabel="EmailVerification.AskPassword.AccountActivation"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.AskPassword.AccountActivation") 
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.AskPassword.AccountActivation", 
                    "Send account activation email") }
                defaultValue={ initialFormValues?.[ 
                    "EmailVerification.AskPassword.AccountActivation" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.AskPassword.AccountActivation", 
                    "Disable if account activation confirmation email is not required.")
                }
            />
            <Field.Input
                ariaLabel="EmailVerification.ExpiryTime"
                inputType="number"
                name="EmailVerification.ExpiryTime"
                min={
                    GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MIN_VALUE
                }
                max={
                    GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MAX_VALUE
                }
                width={ 10 }
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.ExpiryTime", 
                    "Email verification code expiry time") }
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
            <Field.Input
                ariaLabel="EmailVerification.AskPassword.ExpiryTime"
                inputType="number"
                name="EmailVerification.AskPassword.ExpiryTime"
                min={
                    GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MIN_VALUE
                }
                max={
                    GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MAX_VALUE
                }
                width={ 10 }
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.AskPassword.ExpiryTime", 
                    "Enable account lock on creation") }
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
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.AskPassword.ExpiryTime", 
                    "Set the time span that the ask password e-mail would be valid, " + 
                        "in minutes. (For infinite validity period, set -1).")
                }
            >
                <input/>
                <Label>mins</Label>
            </Field.Input>
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
    );
};

/**
 * Default props for the component.
 */
AskPasswordForm.defaultProps = {
    "data-componentid": "ask-password-edit-form"
};
