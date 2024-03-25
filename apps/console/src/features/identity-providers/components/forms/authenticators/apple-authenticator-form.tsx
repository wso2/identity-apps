/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Code, FormSection, GenericIcon, Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, SemanticICONS } from "semantic-ui-react";
import { IdentityProviderManagementConstants } from "../../../constants";
import {
    AuthenticatorSettingsFormModes,
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface,
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../models";

/**
 * Interface for Apple Authenticator Form props.
 */
interface AppleAuthenticatorFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form is used in the edit view and rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form is used in the add wizards and all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    /**
     * Apple Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * Apple Authenticator configured initial values.
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
interface AppleAuthenticatorFormInitialValuesInterface {
    /**
     * Apple Authenticator callback URL field value.
     */
    callbackUrl: string;
    /**
     * Apple Authenticator scopes field value.
     */
    Scopes: string;
    /**
     * Apple Authenticator client id field value.
     */
    ClientId: string;
}

/**
 * Form fields interface.
 */
interface AppleAuthenticatorFormFieldsInterface {
    /**
     * Apple Authenticator additional query parameters field.
     */
    AdditionalQueryParams: CommonAuthenticatorFormFieldInterface;
    /**
     * Apple Authenticator callback URL field.
     */
    callbackUrl: CommonAuthenticatorFormFieldInterface;
    /**
     * Apple Authenticator client id field.
     */
    ClientId: CommonAuthenticatorFormFieldInterface;
    /**
     * Apple Authenticator key id field.
     */
    KeyId: CommonAuthenticatorFormFieldInterface;
    /**
     * Apple Authenticator private key field.
     */
    PrivateKey: CommonAuthenticatorFormFieldInterface;
    /**
     * Apple Authenticator scopes.
     */
    Scopes: CommonAuthenticatorFormFieldInterface;
    /**
     * Apple Authenticator client secret validity period field.
     */
    SecretValidityPeriod: CommonAuthenticatorFormFieldInterface;
    /**
     * Apple Authenticator team id field.
     */
    TeamId: CommonAuthenticatorFormFieldInterface;
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
    icon: SemanticICONS;
}

const FORM_ID: string = "apple-authenticator-form";

/**
 * Apple Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AppleAuthenticatorForm: FunctionComponent<AppleAuthenticatorFormPropsInterface> = (
    props: AppleAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        metadata,
        mode,
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ formFields, setFormFields ] = useState<AppleAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<AppleAuthenticatorFormInitialValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: AppleAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: AppleAuthenticatorFormInitialValuesInterface = null;

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

        setFormFields(resolvedFormFields);
        setInitialValues(resolvedInitialValues);
    }, [ originalInitialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: AppleAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: CommonPluggableComponentPropertyInterface[] = [];
        const originalValues: Record<string, unknown> = {};
        let regenerateSecret: boolean = false;

        originalInitialValues?.properties?.map((entry: CommonPluggableComponentPropertyInterface) => {
            originalValues[entry.key] = entry.value;
        });

        for (const [ key, value ] of Object.entries(values)) {
            if (key !== undefined) {
                properties.push({
                    key: key,
                    value: value
                });

                // Check if the client secret should be regenerated.
                if (!regenerateSecret
                    && IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SECRET_REGENERATIVE_FIELDS.indexOf(key) !== -1
                    && originalValues[key]
                    && value !== originalValues[key]) {
                    regenerateSecret = true;
                }
            }
        }

        // Set the client secret regenerate property.
        if (regenerateSecret === true) {
            properties.push({
                key: IdentityProviderManagementConstants.APPLE_SECRET_REGENERATE_ATTRIBUTE_KEY,
                value: "true"
            });
        }

        return {
            ...originalInitialValues,
            properties
        };
    };

    /**
     * Resolve metadata for UI rendering of scopes.
     *
     * @param scope - Input scope.
     * @returns Scope metadata.
     */
    const resolveScopeMetadata = (scope: string): ScopeMetaInterface => {

        if (scope === IdentityProviderManagementConstants.APPLE_SCOPE_DICTIONARY.EMAIL) {
            return {
                description: t("authenticationProvider:forms" +
                    ".authenticatorSettings.apple.scopes.list.email.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { IdentityProviderManagementConstants.APPLE_SCOPE_DICTIONARY.EMAIL }
                    </Code>
                ),
                icon: "envelope outline"
            };
        }

        if (scope === IdentityProviderManagementConstants.APPLE_SCOPE_DICTIONARY.NAME) {
            return {
                description: t("authenticationProvider:forms" +
                    ".authenticatorSettings.apple.scopes.list.name.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { IdentityProviderManagementConstants.APPLE_SCOPE_DICTIONARY.NAME }
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

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ 
                (values: Record<string, any>) => 
                    onSubmit(getUpdatedConfigurations(values as AppleAuthenticatorFormInitialValuesInterface)) 
            }
            initialValues={ initialValues }
        >
            <Field.Input
                ariaLabel="Apple authenticator client ID"
                inputType="default"
                name="ClientId"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.clientId.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.clientId.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.clientId.hint")
                }
                required={ formFields?.ClientId?.meta?.isMandatory }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.ClientId?.meta?.readOnly
                    )
                }
                value={ formFields?.ClientId?.value }
                maxLength={ formFields?.ClientId?.meta?.maxLength }
                minLength={
                    IdentityProviderManagementConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ componentId }-client-id` }
            />
            <Field.Input
                ariaLabel="Apple authenticator team ID"
                inputType="default"
                name="TeamId"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.teamId.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.teamId.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.teamId.hint")
                }
                required={ formFields?.TeamId?.meta?.isMandatory }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.TeamId?.meta?.readOnly
                    )
                }
                value={ formFields?.TeamId?.value }
                maxLength={ 
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.TEAM_ID_MAX_LENGTH as number
                }
                minLength={
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.TEAM_ID_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ componentId }-team-id` }
            />
            <Field.Input
                ariaLabel="Apple authenticator key ID"
                inputType="default"
                name="KeyId"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.keyId.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.keyId.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.keyId.hint")
                }
                required={ formFields?.KeyId?.meta?.isMandatory }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.KeyId?.meta?.readOnly
                    )
                }
                value={ formFields?.KeyId?.value }
                maxLength={ 
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.KEY_ID_MAX_LENGTH as number
                }
                minLength={
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.KEY_ID_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ componentId }-key-id` }
            />
            <Field.Input
                ariaLabel="Apple authenticator private key"
                inputType="password"
                type="password"
                name="PrivateKey"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.privateKey.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.privateKey.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.privateKey.hint")
                }
                required={ formFields?.PrivateKey?.meta?.isMandatory }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.PrivateKey?.meta?.readOnly
                    )
                }
                value={ formFields?.PrivateKey?.value }
                maxLength={ 
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.PRIVATE_KEY_MAX_LENGTH as number
                }
                minLength={
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.PRIVATE_KEY_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ componentId }-private-key` }
            />
            <Field.Input
                ariaLabel="Client secret validity period"
                inputType="default"
                name="SecretValidityPeriod"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.secretValidityPeriod.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.secretValidityPeriod.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.secretValidityPeriod.hint")
                }
                required={ formFields?.SecretValidityPeriod?.meta?.isMandatory }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.SecretValidityPeriod?.meta?.readOnly
                    )
                }
                value={ formFields?.SecretValidityPeriod?.value }
                maxLength={ 
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                        .SECRET_VALIDITY_PERIOD_MAX_LENGTH as number
                }
                minLength={
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                        .SECRET_VALIDITY_PERIOD_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ componentId }-secret-validity-period` }
            />
            <Field.Input
                ariaLabel="Apple authenticator authorized redirect URL"
                inputType="copy_input"
                name="callbackUrl"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.callbackUrl.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.callbackUrl.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.callbackUrl.hint")
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
                    IdentityProviderManagementConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CALLBACK_URL_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ componentId }-authorized-redirect-url` }
            />
            <Field.Input
                ariaLabel="Additional query parameters"
                inputType="default"
                name="AdditionalQueryParameters"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.additionalQueryParameters.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.additionalQueryParameters.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".apple.additionalQueryParameters.hint")
                }
                required={ formFields?.AdditionalQueryParams?.meta?.isMandatory }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.AdditionalQueryParams?.meta?.readOnly
                    )
                }
                value={ formFields?.AdditionalQueryParams?.value }
                maxLength={ 
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                        .ADDITIONAL_QUERY_PARAMS_MAX_LENGTH as number
                }
                minLength={
                    IdentityProviderManagementConstants
                        .APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                        .ADDITIONAL_QUERY_PARAMS_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ componentId }-additional-query-parameters` }
            />
            {
                formFields?.Scopes?.value
                && formFields.Scopes.value.split
                && formFields.Scopes.value.split(",").length > 0
                && (
                    <FormSection
                        heading={
                            t("authenticationProvider:forms" +
                                ".authenticatorSettings.apple.scopes.heading")
                        }
                    >
                        <div className="authenticator-dynamic-properties">
                            {
                                formFields.Scopes.value
                                    .split(",")
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
                                    ".authenticatorSettings.apple.scopes.hint"
                                }
                            >
                                The type of access provided for the connected apps to access data from Apple.
                                Click <a
                                    href={
                                        "https://developer.apple.com/documentation/sign_in_with_apple" + 
                                        "/clientconfigi/3230955-scope"
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
                ariaLabel="Apple authenticator update button"
                name="update-button"
                data-testid={ `${ componentId }-submit-button` }
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
AppleAuthenticatorForm.defaultProps = {
    "data-componentid": "apple-authenticator-form",
    enableSubmitButton: true
};
