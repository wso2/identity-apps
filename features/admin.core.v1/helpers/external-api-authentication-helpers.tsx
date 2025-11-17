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

import InputAdornment from "@oxygen-ui/react/InputAdornment";
import { FormApi } from "final-form";
import React, { MutableRefObject, ReactElement } from "react";
import { Icon } from "semantic-ui-react";

/**
 * Renders an input adornment with an eye icon to toggle secret visibility.
 *
 * @param showSecret - Whether the secret is currently visible
 * @param onClick - Callback function to toggle visibility
 * @param componentId - Optional component ID for data attributes
 * @returns ReactElement - The input adornment component
 */
export const renderInputAdornmentOfSecret = (
    showSecret: boolean,
    onClick: () => void,
    componentId?: string
): ReactElement => (
    <InputAdornment position="end">
        <Icon
            link={ true }
            className="list-icon reset-field-to-default-adornment"
            size="small"
            color="grey"
            name={ !showSecret ? "eye" : "eye slash" }
            data-componentid={ componentId
                ? `${componentId}-endpoint-authentication-property-secret-view-button`
                : "endpoint-authentication-property-secret-view-button" }
            onClick={ onClick }
        />
    </InputAdornment>
);

/**
 * Handles cancellation of authentication change by resetting authentication-related form fields.
 *
 * @param setIsAuthenticationUpdateFormState - State setter to control authentication update form visibility
 * @param formState - Reference to the form API to clear authentication fields
 */
export const handleAuthenticationChangeCancel = (
    setIsAuthenticationUpdateFormState: (value: boolean) => void,
    formState: MutableRefObject<FormApi<Record<string, unknown>, Partial<Record<string, unknown>>>>
): void => {
    setIsAuthenticationUpdateFormState(false);
    if (formState.current) {
        const initialAuthType = formState.current.getState()?.initialValues?.authType as string | undefined;
        formState.current.change("authType", initialAuthType ?? undefined);
        formState.current.change("userName", "");
        formState.current.change("password", "");
        formState.current.change("clientId", "");
        formState.current.change("clientSecret", "");
        formState.current.change("tokenEndpoint", "");
        formState.current.change("scopes", "");
    }
};

/**
 * Resolves the display name for the authentication type.
 *
 * @param authType - The authentication type (BASIC or CLIENT_CREDENTIAL)
 * @param t - Translation function to get localized strings
 * @returns The localized display name for the authentication type
 */
export const resolveAuthTypeDisplayName = (
    authType: string,
    t: (key: string) => string
): string => {
    if (!authType) {
        return "";
    }

    switch (authType) {
        case "BASIC":
            return t("externalApiAuthentication:fields.authentication.types.basic.name");
        case "CLIENT_CREDENTIAL":
            return t("externalApiAuthentication:fields.authentication.types.clientCredential.name");
        default:
            return "";
    }
};

/**
 * Renders a hint message for authentication secrets based on whether configuration exists.
 *
 * @param hasExistingConfig - Whether existing configuration is present
 * @param t - Translation function to get localized strings
 * @param Hint - The Hint component from react-components
 * @returns ReactElement - The hint component with appropriate message
 */
export const showAuthSecretsHint = (
    hasExistingConfig: boolean,
    t: (key: string) => string,
    Hint: any
): ReactElement => {
    if (hasExistingConfig) {
        return (
            <Hint className="hint-text" compact>
                { t("externalApiAuthentication:fields.authenticationTypeDropdown.hint.update") }
            </Hint>
        );
    } else {
        return (
            <Hint className="hint-text" compact>
                { t("externalApiAuthentication:fields.authenticationTypeDropdown.hint.create") }
            </Hint>
        );
    }
};

/**
 * Renders authentication property fields based on the authentication type.
 *
 * @param endpointAuthType - The authentication type (BASIC or CLIENT_CREDENTIAL)
 * @param showPrimarySecret - Whether the primary secret is visible
 * @param showSecondarySecret - Whether the secondary secret is visible
 * @param setShowPrimarySecret - Setter for primary secret visibility
 * @param setShowSecondarySecret - Setter for secondary secret visibility
 * @param componentId - Component ID for data attributes
 * @param t - Translation function to get localized strings
 * @param Field - The Field component from wso2is/form
 * @param AuthenticationType - The AuthenticationType enum
 * @returns ReactElement - The authentication fields or undefined
 */
export const renderEndpointAuthPropertyFields = (
    endpointAuthType: string,
    showPrimarySecret: boolean,
    showSecondarySecret: boolean,
    setShowPrimarySecret: (show: boolean) => void,
    setShowSecondarySecret: (show: boolean) => void,
    componentId: string,
    t: (key: string) => string,
    Field: any,
    AuthenticationType: any
): ReactElement => {
    switch (endpointAuthType) {
        case AuthenticationType.BASIC:
            return (
                <>
                    <Field.Input
                        ariaLabel="username"
                        className="addon-field-wrapper"
                        name="userName"
                        label={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties.username.label"
                        ) }
                        placeholder={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties." +
                            "username.placeholder"
                        ) }
                        inputType="password"
                        type={ showPrimarySecret ? "text" : "password" }
                        InputProps={ {
                            endAdornment: renderInputAdornmentOfSecret(
                                showPrimarySecret,
                                () => setShowPrimarySecret(!showPrimarySecret),
                                componentId
                            )
                        } }
                        required={ true }
                        maxLength={ 100 }
                        minLength={ 0 }
                        data-componentid={ `${componentId}-endpoint-authentication-property-username` }
                        width={ 16 }
                    />
                    <Field.Input
                        ariaLabel="password"
                        className="addon-field-wrapper"
                        label={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties.password.label"
                        ) }
                        placeholder={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties." +
                            "password.placeholder"
                        ) }
                        name="password"
                        inputType="password"
                        type={ showSecondarySecret ? "text" : "password" }
                        InputProps={ {
                            endAdornment: renderInputAdornmentOfSecret(showSecondarySecret, () =>
                                setShowSecondarySecret(!showSecondarySecret), componentId
                            )
                        } }
                        required={ true }
                        maxLength={ 100 }
                        minLength={ 0 }
                        data-componentid={ `${componentId}-endpoint-authentication-property-password` }
                        width={ 16 }
                    />
                </>
            );
        case AuthenticationType.CLIENT_CREDENTIAL:
            return (
                <>
                    <Field.Input
                        ariaLabel="clientId"
                        className="addon-field-wrapper"
                        name="clientId"
                        inputType="password"
                        type={ showPrimarySecret ? "text" : "password" }
                        InputProps={ {
                            endAdornment: renderInputAdornmentOfSecret(
                                showPrimarySecret,
                                () => setShowPrimarySecret(!showPrimarySecret),
                                componentId
                            )
                        } }
                        label={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties.clientID.label"
                        ) }
                        placeholder={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties." +
                            "clientID.placeholder"
                        ) }
                        required={ true }
                        maxLength={ 100 }
                        minLength={ 0 }
                        data-componentid={ `${componentId}-endpoint-authentication-property-clientId` }
                        width={ 16 }
                    />
                    <Field.Input
                        ariaLabel="clientSecret"
                        className="addon-field-wrapper"
                        name="clientSecret"
                        inputType="password"
                        type={ showSecondarySecret ? "text" : "password" }
                        InputProps={ {
                            endAdornment: renderInputAdornmentOfSecret(showSecondarySecret, () =>
                                setShowSecondarySecret(!showSecondarySecret), componentId
                            )
                        } }
                        label={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties." +
                            "clientSecret.label"
                        ) }
                        placeholder={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties." +
                            "clientSecret.placeholder"
                        ) }
                        required={ true }
                        maxLength={ 100 }
                        minLength={ 0 }
                        data-componentid={ `${componentId}-endpoint-authentication-property-clientSecret` }
                        width={ 16 }
                    />
                    <Field.Input
                        ariaLabel="tokenEndpoint"
                        name="tokenEndpoint"
                        inputType="text"
                        type={ "text" }
                        label={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties." +
                            "tokenEndpoint.label"
                        ) }
                        placeholder={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties." +
                            "tokenEndpoint.placeholder"
                        ) }
                        required={ true }
                        maxLength={ 100 }
                        minLength={ 0 }
                        data-componentid={ `${componentId}-endpoint-authentication-property-tokenEndpoint` }
                        width={ 16 }
                    />
                    <Field.Input
                        ariaLabel="scopes"
                        name="scopes"
                        inputType="text"
                        type={ "text" }
                        label={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties.scopes.label"
                        ) }
                        placeholder={ t(
                            "externalApiAuthentication:fields.authenticationTypeDropdown.authProperties." +
                            "scopes.placeholder"
                        ) }
                        required={ true }
                        maxLength={ 100 }
                        minLength={ 0 }
                        data-componentid={ `${componentId}-endpoint-authentication-property-scopes` }
                        width={ 16 }
                    />
                </>
            );
        default:
            break;
    }
};

/**
 * Renders an information box for authentication section when config already exists.
 *
 * @param currentAuthType - The current authentication type configured
 * @param componentId - Component ID for data attributes
 * @param t - Translation function to get localized strings
 * @param handleAuthenticationChange - Callback function to handle authentication change
 * @param Alert - The Alert component from Oxygen UI
 * @param AlertTitle - The AlertTitle component from Oxygen UI
 * @param Trans - The Trans component from react-i18next
 * @param Button - The Button component from Oxygen UI
 * @returns ReactElement - The authentication section info box
 */
export const renderAuthenticationSectionInfoBox = (
    currentAuthType: string,
    componentId: string,
    t: (key: string, options?: any) => string,
    handleAuthenticationChange: () => void,
    Alert: any,
    AlertTitle: any,
    Trans: any,
    Button: any
): ReactElement => {
    return (
        <Alert className="alert-nutral" icon={ false }>
            <AlertTitle
                className="alert-title"
                data-componentid={ `${componentId}-authentication-info-box-title` }
            >
                <Trans
                    i18nKey={
                        t("actions:fields.authentication.info.title.otherAuthType",
                            {
                                authType: resolveAuthTypeDisplayName(
                                    currentAuthType,
                                    t
                                )
                            } )
                    }
                    components={ { strong: <strong/> } }
                />
            </AlertTitle>
            <Trans
                i18nKey={ t("actions:fields.authentication.info.message") }
            >
                If you are changing the authentication, be aware that the authentication secrets of
                the external endpoint need to be updated.
            </Trans>
            <div>
                <Button
                    onClick={ handleAuthenticationChange }
                    variant="outlined"
                    size="small"
                    className={ "secondary-button" }
                    data-componentid={ `${ componentId }-change-authentication-button` }
                >
                    { t("actions:buttons.changeAuthentication") }
                </Button>
            </div>
        </Alert>
    );
};
