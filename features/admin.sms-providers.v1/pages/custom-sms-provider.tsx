/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import {
    renderAuthenticationSectionInfoBox,
    renderInputAdornmentOfSecret,
    showAuthSecretsHint
} from "@wso2is/admin.core.v1/helpers/external-api-authentication-helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, SelectFieldAdapter, TextFieldAdapter } from "@wso2is/form";
import {
    EmphasizedSegment,
    Heading,
    Hint,
    PrimaryButton
} from "@wso2is/react-components";
import { FormApi } from "final-form";
import React, { FunctionComponent, MutableRefObject, ReactElement, useState } from "react";
import { FormSpy } from "react-final-form";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import "@wso2is/admin.core.v1/styles/external-api-authentication.scss";
import { SMSProviderConstants } from "../constants/sms-provider-constants";
import { AuthType, DropdownChild } from "../models/sms-providers";
import "./sms-providers.scss";

interface CustomSMSProviderPageInterface extends IdentifiableComponentInterface {
    isLoading?: boolean;
    isReadOnly: boolean;
    "data-componentid": string;
    onSubmit: (values: any) => void;
    hasExistingConfig?: boolean;
    currentAuthType?: AuthType;
    endpointAuthType: AuthType;
    setEndpointAuthType: (authType: AuthType) => void;
    isAuthenticationUpdateFormState: boolean;
    setIsAuthenticationUpdateFormState: (state: boolean) => void;
    formState: MutableRefObject<FormApi<Record<string, unknown>, Partial<Record<string, unknown>>>>;
    onAuthenticationChange: () => void;
}

const CustomSMSProvider: FunctionComponent<CustomSMSProviderPageInterface> = (
    props: CustomSMSProviderPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        isLoading,
        isReadOnly,
        onSubmit,
        hasExistingConfig,
        currentAuthType,
        endpointAuthType,
        setEndpointAuthType,
        isAuthenticationUpdateFormState,
        setIsAuthenticationUpdateFormState,
        formState,
        onAuthenticationChange
    } = props;

    const { t } = useTranslation();

    const [ showPrimarySecret, setShowPrimarySecret ] = useState<boolean>(false);
    const [ showSecondarySecret, setShowSecondarySecret ] = useState<boolean>(false);
    const [ localAuthType, setLocalAuthType ] = useState<AuthType>(endpointAuthType);
    const [ shouldShowAuthUpdateAlert, setShouldShowAuthUpdateAlert ] = useState<boolean>(false);

    const handleDropdownChange = (value: string) => {
        const authType: AuthType = value as AuthType;

        setLocalAuthType(authType);
        setEndpointAuthType(authType);
    };

    /**
     * Resets all authentication fields to their initial values to preserve existing data.
     * This is called when the user cancels editing the authentication configuration.
     */
    const resetAuthenticationFields = (): void => {
        if (formState.current) {
            const initialValues: Partial<Record<string, unknown>> = formState.current.getState()?.initialValues;

            formState.current.change("authType", initialValues?.authType ?? undefined);
            formState.current.change("userName", initialValues?.userName ?? "");
            formState.current.change("password", initialValues?.password ?? "");
            formState.current.change("clientId", initialValues?.clientId ?? "");
            formState.current.change("clientSecret", initialValues?.clientSecret ?? "");
            formState.current.change("tokenEndpoint", initialValues?.tokenEndpoint ?? "");
            formState.current.change("scopes", initialValues?.scopes ?? "");
            formState.current.change("accessToken", initialValues?.accessToken ?? "");
            formState.current.change("header", initialValues?.header ?? "");
            formState.current.change("value", initialValues?.value ?? "");
        }
    };

    const activeAuthType: AuthType = localAuthType || endpointAuthType;

    return (
        <EmphasizedSegment
            padded={ "very" }
            data-componentid={ `${componentId}-tab` }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <h2>{ t("smsProviders:form.custom.subHeading") }</h2>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="providerURL"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="providerURL"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-providerURL` }
                            name="providerURL"
                            type="text"
                            label={ t("smsProviders:form.custom.providerUrl.label") }
                            placeholder={ t("smsProviders:form.custom." +
                                "providerUrl.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("smsProviders:form.custom.providerUrl.hint") }
                                </Hint>
                            ) }

                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="contentType"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="contentType"
                            readOnly={ isReadOnly }
                            data-componentid={ `${componentId}-contentType` }
                            name="contentType"
                            type="text"
                            label={ t("smsProviders:form.custom.contentType.label") }
                            placeholder={ t("smsProviders:form.custom." +
                                "contentType.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("smsProviders:form.custom.contentType.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                            required
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="httpMethod"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="httpMethod"
                            readOnly={ isReadOnly }
                            required={ false }
                            data-componentid={ `${componentId}-httpMethod` }
                            name="httpMethod"
                            type="text"
                            label={ t("smsProviders:form.custom.httpMethod.label") }
                            placeholder={ t("smsProviders:form.custom.httpMethod.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("smsProviders:form.custom.httpMethod.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="headers"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="headers"
                            readOnly={ isReadOnly }
                            required={ false }
                            data-componentid={ `${componentId}-headers` }
                            name="headers"
                            type="text"
                            label={ t("smsProviders:form.custom.headers.label") }
                            placeholder={ t("smsProviders:form.custom.headers.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("smsProviders:form.custom.headers.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <FinalFormField
                            key="payload"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="payload"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-payload` }
                            name="payload"
                            type="text"
                            label={ t("smsProviders:form.custom.payload.label") }
                            placeholder={ t("smsProviders:form.custom.payload.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("smsProviders:form.custom.payload.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_TEMPLATE_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <div
                className="external-api-auth-config-page"
                id={ `${componentId}-authentication-section` }
            >
                <div className="form-wrapper">
                    <Divider className="divider-container" />
                    <Heading className="heading-container" as="h5">
                        { t("externalApiAuthentication:fields." +
                            "authenticationTypeDropdown.title") }
                    </Heading>

                    { (
                        (!hasExistingConfig || isAuthenticationUpdateFormState || !currentAuthType)
                    ) && (
                        <Box className="box-container">
                            <div className="box-field">
                                {
                                    (
                                        hasExistingConfig &&
                                        isAuthenticationUpdateFormState &&
                                        shouldShowAuthUpdateAlert
                                    ) && (
                                        <Alert
                                            severity="warning"
                                            className="authentication-update-alert"
                                            sx={ { mb: 2 } }
                                        >
                                            { t("smsProviders:form.custom.authentication.updateRequired") }
                                        </Alert>
                                    )
                                }
                                <FormSpy subscription={ { values: true } }>
                                    { ({ values }: { values: Record<string, unknown> }) => {
                                        const currentAuthType: string = values?.authType as string;

                                        if (currentAuthType && currentAuthType !== activeAuthType) {
                                            handleDropdownChange(currentAuthType);
                                        }

                                        return null;
                                    } }
                                </FormSpy>
                                <FinalFormField
                                    key="authType"
                                    ariaLabel="authType"
                                    readOnly={ isReadOnly }
                                    required={ true }
                                    data-componentid={ `${componentId}-authentication-dropdown` }
                                    name="authType"
                                    label={ t(
                                        "externalApiAuthentication:fields." +
                                        "authenticationTypeDropdown.label"
                                    ) }
                                    placeholder={ t(
                                        "externalApiAuthentication:fields." +
                                        "authenticationTypeDropdown.placeholder"
                                    ) }
                                    options={ SMSProviderConstants.AUTH_TYPES.map(
                                        (option: DropdownChild) => ({
                                            key: option.key,
                                            text: t(option.text),
                                            value: option.value
                                        })
                                    ) }
                                    component={ SelectFieldAdapter }
                                />
                                {
                                    showAuthSecretsHint(
                                        !!hasExistingConfig,
                                        t,
                                        Hint
                                    )
                                }

                                { activeAuthType === AuthType.BASIC && (
                                    <>
                                        <FinalFormField
                                            key="userName"
                                            ariaLabel="username"
                                            className="addon-field-wrapper"
                                            name="userName"
                                            type={ showPrimarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-username`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.username.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.username.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    showPrimarySecret,
                                                    () => setShowPrimarySecret(!showPrimarySecret),
                                                    componentId
                                                )
                                            } }
                                        />
                                        <FinalFormField
                                            key="password"
                                            ariaLabel="password"
                                            className="addon-field-wrapper"
                                            name="password"
                                            type={ showSecondarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-password`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.password.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.password.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    showSecondarySecret,
                                                    () => setShowSecondarySecret(!showSecondarySecret),
                                                    componentId
                                                )
                                            } }
                                        />
                                    </>
                                ) }

                                { activeAuthType === AuthType.CLIENT_CREDENTIAL && (
                                    <>
                                        <FinalFormField
                                            key="clientId"
                                            ariaLabel="clientId"
                                            className="addon-field-wrapper"
                                            name="clientId"
                                            type={ showPrimarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-clientId`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.clientID.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.clientID.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    showPrimarySecret,
                                                    () => setShowPrimarySecret(!showPrimarySecret),
                                                    componentId
                                                )
                                            } }
                                        />
                                        <FinalFormField
                                            key="clientSecret"
                                            ariaLabel="clientSecret"
                                            className="addon-field-wrapper"
                                            name="clientSecret"
                                            type={ showSecondarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-clientSecret`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "clientSecret.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "clientSecret.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    showSecondarySecret,
                                                    () => setShowSecondarySecret(!showSecondarySecret),
                                                    componentId
                                                )
                                            } }
                                        />
                                        <FinalFormField
                                            key="tokenEndpoint"
                                            ariaLabel="tokenEndpoint"
                                            className="addon-field-wrapper"
                                            name="tokenEndpoint"
                                            type="url"
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-tokenEndpoint`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "tokenEndpoint.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "tokenEndpoint.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 2048 }
                                            readOnly={ isReadOnly }
                                        />
                                        <FinalFormField
                                            key="scopes"
                                            ariaLabel="scopes"
                                            className="addon-field-wrapper"
                                            name="scopes"
                                            type="text"
                                            required={ false }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-scopes`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "scopes.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "scopes.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 500 }
                                            readOnly={ isReadOnly }
                                        />
                                    </>
                                ) }

                                { activeAuthType === AuthType.BEARER && (
                                    <>
                                        <FinalFormField
                                            key="accessToken"
                                            ariaLabel="accessToken"
                                            className="addon-field-wrapper"
                                            name="accessToken"
                                            type={ showPrimarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-accessToken`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "accessToken.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "accessToken.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 1000 }
                                            readOnly={ isReadOnly }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    showPrimarySecret,
                                                    () => setShowPrimarySecret(!showPrimarySecret),
                                                    componentId
                                                )
                                            } }
                                        />
                                    </>
                                ) }

                                { activeAuthType === AuthType.API_KEY && (
                                    <>
                                        <FinalFormField
                                            key="header"
                                            ariaLabel="header"
                                            className="addon-field-wrapper"
                                            name="header"
                                            type="text"
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-header`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "header.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "header.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                        />
                                        <FinalFormField
                                            key="value"
                                            ariaLabel="value"
                                            className="addon-field-wrapper"
                                            name="value"
                                            type={ showPrimarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-value`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "value.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "value.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 500 }
                                            readOnly={ isReadOnly }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    showPrimarySecret,
                                                    () => setShowPrimarySecret(!showPrimarySecret),
                                                    componentId
                                                )
                                            } }
                                        />
                                    </>
                                ) }

                                { isAuthenticationUpdateFormState && (
                                    <Button
                                        onClick={ () => {
                                            setShouldShowAuthUpdateAlert(false);
                                            setIsAuthenticationUpdateFormState(false);
                                            setLocalAuthType(currentAuthType);
                                            setEndpointAuthType(currentAuthType);
                                            resetAuthenticationFields();
                                        } }
                                        variant="outlined"
                                        size="small"
                                        className="secondary-button"
                                        data-componentid={ `${componentId}-cancel-edit-authentication-button` }
                                    >
                                        { t("actions:buttons.cancel") }
                                    </Button>
                                ) }
                            </div>
                        </Box>
                    ) }

                    {
                        (hasExistingConfig && !isAuthenticationUpdateFormState && currentAuthType) &&
                        renderAuthenticationSectionInfoBox(
                            currentAuthType,
                            componentId,
                            t,
                            onAuthenticationChange,
                            Alert,
                            AlertTitle,
                            Trans,
                            Button
                        )
                    }
                </div>
            </div>

            {
                !isReadOnly && (
                    <>
                        <Divider hidden />
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <PrimaryButton
                                        size="small"
                                        type="button"
                                        onClick={ () => {
                                            if (
                                                hasExistingConfig &&
                                                currentAuthType &&
                                                !isAuthenticationUpdateFormState
                                            ) {
                                                setShouldShowAuthUpdateAlert(true);
                                                setIsAuthenticationUpdateFormState(true);
                                            } else {
                                                onSubmit(formState.current?.getState().values);
                                            }
                                        } }
                                        ariaLabel="SMS provider form update button"
                                        data-componentid={ `${componentId}-update-button` }
                                        loading={ isLoading }
                                    >
                                        { "Submit" }
                                    </PrimaryButton>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </>
                )
            }
        </EmphasizedSegment>
    );
};

CustomSMSProvider.defaultProps = {
    "data-componentid": "custom-sms-provider"
};

export default CustomSMSProvider;
