/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { EmailProviderConstants } from "../constants/email-provider-constants";
import { AuthType, HTTPEmailAuthDropdownChild, HTTPEmailProviderFormInterface } from "../models/email-providers";

interface HttpBasedEmailProviderPageInterface extends IdentifiableComponentInterface {
    isLoading?: boolean;
    isReadOnly: boolean;
    onSubmit: (values: HTTPEmailProviderFormInterface) => void;
    hasExistingConfig?: boolean;
    currentAuthType?: AuthType;
    endpointAuthType: AuthType | null;
    setEndpointAuthType: (authType: AuthType) => void;
    isAuthenticationUpdateFormState: boolean;
    setIsAuthenticationUpdateFormState: (state: boolean) => void;
    formState: MutableRefObject<FormApi<Record<string, unknown>, Partial<Record<string, unknown>>> | null>;
    onAuthenticationChange: () => void;
}

const HttpBasedEmailProvider: FunctionComponent<HttpBasedEmailProviderPageInterface> = (
    props: HttpBasedEmailProviderPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        isLoading,
        isReadOnly,
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
    const [ localAuthType, setLocalAuthType ] = useState<AuthType | null>(endpointAuthType);
    const [ shouldShowAuthUpdateAlert, setShouldShowAuthUpdateAlert ] = useState<boolean>(false);
    const [ shouldShowAuthRequiredAlert, setShouldShowAuthRequiredAlert ] = useState<boolean>(false);
    const [ shouldShowMandatoryFieldsAlert, setShouldShowMandatoryFieldsAlert ] = useState<boolean>(false);

    const handleDropdownChange: (value: string) => void = (value: string): void => {
        setLocalAuthType(value as AuthType);
    };

    const resetAuthenticationFields: () => void = (): void => {
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
            formState.current.change("apiKeyHeader", initialValues?.apiKeyHeader ?? "");
            formState.current.change("apiKeyValue", initialValues?.apiKeyValue ?? "");
        }
    };

    const activeAuthType: AuthType | null = localAuthType || endpointAuthType;

    return (
        <EmphasizedSegment
            padded="very"
            data-componentid={ `${componentId}-tab` }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <h2>
                            { t("extensions:develop.emailProviders.form.httpProvider.subHeading") }
                        </h2>
                    </Grid.Column>
                </Grid.Row>
                { shouldShowMandatoryFieldsAlert && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <Alert severity="warning" sx={ { mb: 1 } }>
                                { t("extensions:develop.emailProviders.form.httpProvider.mandatoryFieldsRequired") }
                            </Alert>
                        </Grid.Column>
                    </Grid.Row>
                ) }
                <Grid.Row columns={ 1 }>
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
                            label={ t("extensions:develop.emailProviders.form.httpProvider.providerUrl.label") }
                            placeholder={
                                t("extensions:develop.emailProviders.form.httpProvider.providerUrl.placeholder")
                            }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.emailProviders.form.httpProvider.providerUrl.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="contentType"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="contentType"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-contentType` }
                            name="contentType"
                            label={ t("extensions:develop.emailProviders.form.httpProvider.contentType.label") }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.emailProviders.form.httpProvider.contentType.hint") }
                                </Hint>
                            ) }
                            component={ SelectFieldAdapter }
                            options={ EmailProviderConstants.HTTP_CONTENT_TYPE_OPTIONS }
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="httpMethod"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="httpMethod"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-httpMethod` }
                            name="httpMethod"
                            label={ t("extensions:develop.emailProviders.form.httpProvider.httpMethod.label") }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.emailProviders.form.httpProvider.httpMethod.hint") }
                                </Hint>
                            ) }
                            component={ SelectFieldAdapter }
                            options={ EmailProviderConstants.HTTP_METHOD_OPTIONS }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
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
                            label={ t("extensions:develop.emailProviders.form.httpProvider.headers.label") }
                            placeholder={ t("extensions:develop.emailProviders.form.httpProvider.headers.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.emailProviders.form.httpProvider.headers.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <FinalFormField
                            key="body"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="body"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-body` }
                            name="body"
                            type="text"
                            label={ t("extensions:develop.emailProviders.form.httpProvider.body.label") }
                            placeholder={ t("extensions:develop.emailProviders.form.httpProvider.body.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.emailProviders.form.httpProvider.body.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.HTTP_PROVIDER_BODY_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                            multiline
                            rows={ 10 }
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
                        { t("externalApiAuthentication:fields.authenticationTypeDropdown.title") }
                    </Heading>

                    { ((!hasExistingConfig || isAuthenticationUpdateFormState || !currentAuthType)) && (
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
                                            { t("extensions:develop.emailProviders.form.httpProvider" +
                                                ".authentication.updateRequired") }
                                        </Alert>
                                    )
                                }
                                <FormSpy
                                    subscription={ { values: true } }
                                    onChange={ (state: { values: Record<string, unknown> }) => {
                                        const values: Record<string, unknown> = state.values;
                                        const spyAuthType: string = values?.authType as string;
                                        const spyProviderURL: string = values?.providerURL as string;
                                        const spyContentType: string = values?.contentType as string;
                                        const spyBody: string = values?.body as string;
                                        const spyHttpMethod: string = values?.httpMethod as string;

                                        if (spyAuthType && spyAuthType !== activeAuthType) {
                                            handleDropdownChange(spyAuthType);
                                        }
                                        if (spyAuthType && shouldShowAuthRequiredAlert) {
                                            setShouldShowAuthRequiredAlert(false);
                                        }
                                        if (
                                            shouldShowMandatoryFieldsAlert &&
                                            spyProviderURL && spyContentType && spyBody && spyHttpMethod
                                        ) {
                                            setShouldShowMandatoryFieldsAlert(false);
                                        }
                                    } }
                                />
                                { shouldShowAuthRequiredAlert && !activeAuthType && (
                                    <Alert
                                        severity="warning"
                                        className="authentication-update-alert"
                                        sx={ { mb: 2 } }
                                    >
                                        { t("extensions:develop.emailProviders.form.httpProvider" +
                                            ".authentication.required") }
                                    </Alert>
                                ) }
                                <FinalFormField
                                    key="authType"
                                    ariaLabel="authType"
                                    readOnly={ isReadOnly }
                                    required={ true }
                                    data-componentid={ `${componentId}-authentication-dropdown` }
                                    name="authType"
                                    label={ t(
                                        "externalApiAuthentication:fields.authenticationTypeDropdown.label"
                                    ) }
                                    placeholder={ t(
                                        "externalApiAuthentication:fields.authenticationTypeDropdown.placeholder"
                                    ) }
                                    options={ EmailProviderConstants.HTTP_AUTH_TYPES.map(
                                        (option: HTTPEmailAuthDropdownChild) => ({
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
                                                "authenticationTypeDropdown.authProperties.clientSecret.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.clientSecret.placeholder"
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
                                                "authenticationTypeDropdown.authProperties.tokenEndpoint.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.tokenEndpoint.placeholder"
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
                                                "authenticationTypeDropdown.authProperties.scopes.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.scopes.placeholder"
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
                                                "authenticationTypeDropdown.authProperties.accessToken.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.accessToken.placeholder"
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
                                            key="apiKeyHeader"
                                            ariaLabel="apiKeyHeader"
                                            className="addon-field-wrapper"
                                            name="apiKeyHeader"
                                            type="text"
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-apiKeyHeader`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.header.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.header.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                        />
                                        <FinalFormField
                                            key="apiKeyValue"
                                            ariaLabel="apiKeyValue"
                                            className="addon-field-wrapper"
                                            name="apiKeyValue"
                                            type={ showPrimarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-apiKeyValue`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.value.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.value.placeholder"
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
                                                const formValues: Partial<Record<string, unknown>> =
                                                    formState.current?.getState().values ?? {};

                                                const hasMissingFields: boolean = (
                                                    !formValues?.providerURL ||
                                                    !formValues?.contentType ||
                                                    !formValues?.httpMethod ||
                                                    !formValues?.body
                                                );

                                                if (hasMissingFields) {
                                                    setShouldShowMandatoryFieldsAlert(true);

                                                    return;
                                                }
                                                if (!formValues?.authType) {
                                                    setShouldShowAuthRequiredAlert(true);

                                                    return;
                                                }
                                                formState.current?.submit();
                                            }
                                        } }
                                        ariaLabel="Email provider form update button"
                                        data-componentid={ `${componentId}-update-button` }
                                        loading={ isLoading }
                                    >
                                        { t("extensions:develop.emailProviders.updateButton") }
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

HttpBasedEmailProvider.defaultProps = {
    "data-componentid": "http-based-email-provider"
};

export default HttpBasedEmailProvider;
