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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/forms";
import { Code, FormSection, GenericIcon, Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, SemanticICONS } from "semantic-ui-react";
import { ConnectionUIConstants } from "../../../../constants/connection-ui-constants";
import { FederatedAuthenticatorConstants } from "../../../../constants/federated-authenticator-constants";
import {
    AuthenticatorSettingsFormModes,
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface
} from "../../../../models/authenticators";
import { CommonPluggableComponentMetaPropertyInterface } from "../../../../models/connection";
import {
    applyMicrosoftTenantToEndpoint,
    extractMicrosoftTenant,
    isMicrosoftTenantValid
} from "../../../../utils/microsoft-authenticator-utils";

/**
 * Interface for Microsoft Authenticator Form props.
 */
interface MicrosoftAuthenticatorFormPropsInterface extends TestableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    /**
     * Microsoft Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * Microsoft Authenticator configured initial values.
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
interface MicrosoftAuthenticatorFormInitialValuesInterface {
    /**
     * Microsoft Authenticator client secret field value.
     */
    commonAuthQueryParams: string;
    /**
     * Microsoft Authenticator client secret field value.
     */
    ClientSecret: string;
    /**
     * Microsoft Authenticator callback URL field value.
     */
    callbackUrl: string;
    /**
     * Microsoft Authenticator client id field value.
     */
    ClientId: string;
    /**
     * Microsoft Authenticator scope values.
     */
    Scopes: string;
    /**
     * Directory (tenant) segment of the Microsoft authorization/token endpoints.
     */
    microsoftTenant: string;
}

/**
 * Form fields interface.
 */
interface MicrosoftAuthenticatorFormFieldsInterface {
    /**
     * Microsoft Authenticator client secret field value.
     */
    commonAuthQueryParams: CommonAuthenticatorFormFieldInterface;
    /**
     * Microsoft Authenticator client secret field.
     */
    ClientSecret: CommonAuthenticatorFormFieldInterface;
    /**
     * Microsoft Authenticator callback URL field.
     */
    callbackUrl: CommonAuthenticatorFormFieldInterface;
    /**
     * Microsoft Authenticator client id field value.
     */
    ClientId: CommonAuthenticatorFormFieldInterface;
    /**
     * Microsoft Authenticator scope values.
     */
    Scopes: CommonAuthenticatorFormFieldInterface;
}

/**
 * Scopes UI displaying interface.
 */
interface ScopeMetaInterface {
    /**
     * Scope description.
     */
    description: string;
    /**
     * Scope display name.
     */
    displayName: ReactNode;
    /**
     * Scope icon.
     */
    icon: SemanticICONS
}

const FORM_ID: string = "microsoft-authenticator-form";

/**
 * Microsoft Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const MicrosoftAuthenticatorForm: FunctionComponent<MicrosoftAuthenticatorFormPropsInterface> = (
    props: MicrosoftAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        metadata,
        mode,
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ formFields, setFormFields ] = useState<MicrosoftAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<MicrosoftAuthenticatorFormInitialValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: MicrosoftAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: MicrosoftAuthenticatorFormInitialValuesInterface = null;

        originalInitialValues.properties.map((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties
                .find((meta: CommonPluggableComponentMetaPropertyInterface) => meta.key === value.key);

            resolvedFormFields = {
                ...resolvedFormFields,
                [ value.key ]: {
                    meta,
                    value: value.value
                }
            };

            resolvedInitialValues = {
                ...resolvedInitialValues,
                [ value.key ]: value.value
            };
        });

        // Derive the Directory (tenant) value from the configured authorization endpoint and seed it
        // as a virtual form field. It is applied back to both endpoints on submit.
        const authorizationEndpoint: string = originalInitialValues.properties.find(
            (property: CommonAuthenticatorFormPropertyInterface) =>
                property.key === FederatedAuthenticatorConstants.AUTHORIZATION_ENDPOINT_URL_KEY
        )?.value;

        resolvedInitialValues = {
            ...resolvedInitialValues,
            microsoftTenant: extractMicrosoftTenant(authorizationEndpoint)
        };

        setFormFields(resolvedFormFields);
        setInitialValues(resolvedInitialValues);
    }, [ originalInitialValues ]);

    /**
     * Validates the Directory (tenant) field. Empty is handled by the field's `required` flag;
     * non-empty values must be a recognised tenant (keyword, GUID, or domain).
     *
     * @param value - The user-entered tenant value.
     * @returns An error message when invalid, otherwise `undefined`.
     */
    const validateMicrosoftTenant = (value: string): string | undefined => {
        if (!isEmpty(value) && !isMicrosoftTenantValid(value)) {
            return t("authenticationProvider:forms.authenticatorSettings.microsoft.tenant.validations.invalid");
        }

        return undefined;
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     *
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: MicrosoftAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: any[] = [];

        for (const [ key, value ] of Object.entries(values)) {
            // The tenant field is virtual; it is applied to the endpoints below, not saved as-is.
            if (key === undefined || key === "microsoftTenant") {
                continue;
            }

            properties.push({ key, value });
        }

        // Apply the selected tenant to the authorization/token endpoints, preserving the rest of
        // each existing endpoint URL. An empty value falls back to the `common` default.
        const tenant: string = (values?.microsoftTenant ?? "").toString().trim()
            || FederatedAuthenticatorConstants.MICROSOFT_DEFAULT_TENANT;
        const endpointFallbacks: { fallback: string; key: string }[] = [
            {
                fallback: FederatedAuthenticatorConstants.MICROSOFT_AUTHORIZE_ENDPOINT,
                key: FederatedAuthenticatorConstants.AUTHORIZATION_ENDPOINT_URL_KEY
            },
            {
                fallback: FederatedAuthenticatorConstants.MICROSOFT_TOKEN_ENDPOINT,
                key: FederatedAuthenticatorConstants.TOKEN_ENDPOINT_URL_KEY
            }
        ];

        endpointFallbacks.forEach(({ fallback, key }: { fallback: string; key: string }) => {
            const existingValue: string = originalInitialValues?.properties?.find(
                (property: CommonAuthenticatorFormPropertyInterface) => property.key === key
            )?.value;
            const resolvedValue: string = applyMicrosoftTenantToEndpoint(existingValue, fallback, tenant);
            const existingProperty: { key: string; value: string } =
                properties.find((property: { key: string; value: string }) => property.key === key);

            if (existingProperty) {
                existingProperty.value = resolvedValue;
            } else {
                properties.push({ key, value: resolvedValue });
            }
        });

        return {
            ...originalInitialValues,
            properties
        };
    };

    /**
     * Resolve metadata for UI rendering of scopes.
     *
     * @param scope - Input scope.
     *
     * @returns resolved Scope Metadata
     */
    const resolveScopeMetadata = (scope: string): ScopeMetaInterface => {

        if (scope === FederatedAuthenticatorConstants.MICROSOFT_SCOPE_DICTIONARY.EMAIL) {
            return {
                description: t("authenticationProvider:forms" +
                    ".authenticatorSettings.microsoft.scopes.list.email.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { FederatedAuthenticatorConstants.MICROSOFT_SCOPE_DICTIONARY.EMAIL }
                    </Code>
                ),
                icon: "envelope outline"
            };
        }

        if (scope === FederatedAuthenticatorConstants.MICROSOFT_SCOPE_DICTIONARY.OPENID) {
            return {
                description: t("authenticationProvider:forms" +
                    ".authenticatorSettings.microsoft.scopes.list.openid.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { FederatedAuthenticatorConstants.MICROSOFT_SCOPE_DICTIONARY.OPENID }
                    </Code>
                ),
                icon: "openid"
            };
        }

        if (scope === FederatedAuthenticatorConstants.MICROSOFT_SCOPE_DICTIONARY.PROFILE) {
            return {
                description: t("authenticationProvider:forms" +
                    ".authenticatorSettings.microsoft.scopes.list.profile.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { FederatedAuthenticatorConstants.MICROSOFT_SCOPE_DICTIONARY.PROFILE }
                    </Code>
                ),
                icon: "user outline"
            };
        }

        return {
            description: "",
            displayName: scope,
            icon: "key"
        };
    };

    /**
     * Extracts scopes as an array.
     *
     * Input - "scope=openid email profile"
     * Output - [ "openid", "email", "profile" ]
     *
     * @param rawScopes - Raw String.
     *
     * @returns list of scopes
     */
    const extractScopes = (rawScopes: string): string[] => {

        let scopes: string[] = [];

        try {
            scopes = new URLSearchParams(rawScopes).get("scope").split(" ");
        } catch(e) {
            // Silent any issues occurred when trying to scroll.
            // Add debug logs here one a logger is added.
            // Tracked here https://github.comz/wso2/product-is/issues/11650.
        }

        return scopes;
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: Record<string, any>) => onSubmit(getUpdatedConfigurations(values as any)) }
            initialValues={ initialValues }
        >
            <Field.Input
                ariaLabel="Microsoft authenticator client ID"
                inputType="default"
                name="ClientId"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.clientId.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.clientId.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".microsoft.clientId.hint"
                        }
                    >
                        The <Code>Client ID</Code> you received from Microsoft for your OAuth app.
                    </Trans>
                ) }
                required={ formFields?.ClientId?.meta?.isMandatory }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.ClientId?.meta?.readOnly
                    )
                }
                value={ formFields?.ClientId?.value }
                maxLength={ ConnectionUIConstants
                    .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MAX_LENGTH as number }
                minLength={
                    ConnectionUIConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ testId }-client-id` }
            />
            <Field.Input
                ariaLabel="Microsoft authenticator client secret"
                className="addon-field-wrapper"
                inputType="password"
                type="password"
                name="ClientSecret"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.clientSecret.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.clientSecret.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".microsoft.clientSecret.hint"
                        }
                    >
                        The <Code>App secret</Code> value of the Microsoft application.
                    </Trans>
                ) }
                required={ formFields?.ClientSecret?.meta?.isMandatory }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.ClientSecret?.meta?.readOnly
                    )
                }
                value={ formFields?.ClientSecret?.value }
                maxLength={ formFields?.ClientSecret?.meta?.maxLength }
                minLength={
                    ConnectionUIConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_SECRET_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ testId }-client-secret` }
            />
            <Field.Input
                ariaLabel="Microsoft authenticator directory tenant ID"
                inputType="default"
                name="microsoftTenant"
                label={ t("authenticationProvider:forms.authenticatorSettings.microsoft.tenant.label") }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings.microsoft.tenant.placeholder")
                }
                hint={ (
                    <>
                        <Trans
                            i18nKey={
                                "authenticationProvider:forms.authenticatorSettings.microsoft.tenant.hint"
                            }
                        >
                            Keep <Code>common</Code> to allow sign-in from any Microsoft organization, or
                            enter your Directory (tenant) ID or domain (e.g. <Code>contoso.onmicrosoft.com</Code>)
                            to restrict sign-in to a single organization.
                        </Trans>
                        { " " }
                        <Trans
                            i18nKey={
                                "authenticationProvider:forms.authenticatorSettings.microsoft.tenant.info"
                            }
                        >
                            If your Microsoft app registration uses &quot;Accounts in this organizational
                            directory only&quot; (single-tenant), enter your tenant ID here. Leaving
                            <Code>common</Code> will cause every sign-in through this connection to fail.
                        </Trans>
                    </>
                ) }
                required={ true }
                requiredErrorMessage={
                    t("authenticationProvider:forms.authenticatorSettings.microsoft.tenant.validations.required")
                }
                validation={ (value: string) => validateMicrosoftTenant(value?.toString()) }
                readOnly={ readOnly }
                value={ initialValues?.microsoftTenant }
                maxLength={ 256 }
                minLength={ 1 }
                width={ 16 }
                data-testid={ `${ testId }-directory-tenant` }
            />
            <Field.Input
                ariaLabel="Microsoft authenticator authorized redirect URL"
                inputType="copy_input"
                name="callbackUrl"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.callbackUrl.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.callbackUrl.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.callbackUrl.hint")
                }
                required={ formFields?.callbackUrl?.meta?.isMandatory }
                value={ formFields?.callbackUrl?.value }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.callbackUrl?.meta?.readOnly
                    )
                }
                maxLength={ formFields?.callbackUrl?.meta?.maxLength }
                minLength={
                    ConnectionUIConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CALLBACK_URL_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ testId }-authorized-redirect-url` }
            />
            <Field.Scopes
                ariaLabel={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.scopes.ariaLabel")
                }
                inputType="default"
                name={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.scopes.heading")
                }
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.scopes.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.scopes.placeholder")
                }
                hint="The types of access provided for the connected apps to access data from Microsoft."
                required={ formFields?.Scopes?.meta?.isMandatory }
                value={ formFields?.Scopes?.value }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.Scopes?.meta?.readOnly
                    )
                }
                maxLength={ formFields?.ClientId?.meta?.maxLength }
                minLength={
                    ConnectionUIConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ testId }-additional-query-parameters` }
            />
            <Field.QueryParams
                ariaLabel={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.commonAuthQueryParams.ariaLabel")
                }
                inputType="default"
                name="commonAuthQueryParams"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.commonAuthQueryParams.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.commonAuthQueryParams.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".microsoft.commonAuthQueryParams.hint")
                }
                required={ formFields?.commonAuthQueryParams?.meta?.isMandatory }
                value={ formFields?.commonAuthQueryParams?.value }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.commonAuthQueryParams?.meta?.readOnly
                    )
                }
                maxLength={ formFields?.ClientId?.meta?.maxLength }
                minLength={
                    ConnectionUIConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ testId }-additional-query-parameters` }
            />
            {
                (formFields?.Scopes?.value
                    && !isEmpty(extractScopes(formFields.Scopes.value))) && (
                    <FormSection
                        heading={
                            t("authenticationProvider:forms" +
                                ".authenticatorSettings.microsoft.scopes.heading")
                        }
                    >
                        <div className="authenticator-dynamic-properties">
                            {
                                extractScopes(formFields.Scopes.value)
                                    .map((scope: string, index: number) => {

                                        const scopeMeta: ScopeMetaInterface = resolveScopeMetadata(scope);

                                        return (
                                            <div
                                                key={ index }
                                                className="authenticator-dynamic-property"
                                                data-testid={ scope }
                                            >
                                                <div className="authenticator-dynamic-property-name-container">
                                                    <GenericIcon
                                                        square
                                                        inline
                                                        transparent
                                                        icon={ <Icon name={ scopeMeta.icon }/> }
                                                        size="micro"
                                                        className="scope-icon"
                                                        spaced="right"
                                                        verticalAlign="top"
                                                    />
                                                    <div data-testid={ `${ scope }-name` }>
                                                        { scopeMeta.displayName }
                                                    </div>
                                                </div>
                                                <div
                                                    className="authenticator-dynamic-property-description"
                                                    data-testid={ `${ scope }-description` }
                                                >
                                                    { scopeMeta.description }
                                                </div>
                                            </div>
                                        );
                                    })
                            }
                        </div>
                        <Hint compact>
                            <Trans
                                i18nKey={
                                    "authenticationProvider:forms" +
                                    ".authenticatorSettings.microsoft.scopes.hint"
                                }
                            >
                                Scopes provide a way for connected apps to access data from Microsoft.
                                Click <a
                                    href={
                                        "https://learn.microsoft.com/en-us/azure/active-directory/"+
                                        "develop/v2-permissions-and-consent"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >here</a> to learn more.
                            </Trans>
                        </Hint>
                    </FormSection>
                )
            }
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Microsoft authenticator update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={ readOnly }
            />
        </Form>
    );
};

/**
 * Default props for the component.
 */
MicrosoftAuthenticatorForm.defaultProps = {
    "data-testid": "microsoft-authenticator-form",
    enableSubmitButton: true
};
