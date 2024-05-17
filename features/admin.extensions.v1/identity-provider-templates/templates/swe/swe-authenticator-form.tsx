/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { IdentityProviderManagementConstants } from "@wso2is/admin.identity-providers.v1/constants";
import {
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface,
    CommonPluggableComponentMetaPropertyInterface
} from "@wso2is/admin.identity-providers.v1/models";
import { SIWEConstants } from "../../../components/identity-providers/constants";

/**
 * Interface for SIWE Authenticator Settings Form props.
 */
interface SIWEAuthenticatorFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * SIWE Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * SIWE Authenticator configured initial values.
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
interface SIWEAuthenticatorFormInitialValuesInterface {
    /**
     * SIWE Authenticator client secret field value.
     */
    ClientSecret: string;
    /**
     * SIWE Authenticator callback URL field value.
     */
    callbackUrl: string;
    /**
     * SIWE Authenticator scopes field value.
     */
    scope: string;
    /**
     * SIWE Authenticator client id field value.
     */
    ClientId: string;
}

/**
 * Form fields interface.
 */
interface SIWEAuthenticatorFormFieldsInterface {
    /**
     * SIWE Authenticator client secret field.
     */
    ClientSecret: CommonAuthenticatorFormFieldInterface;
    /**
     * SIWE Authenticator callback URL field.
     */
    callbackUrl: CommonAuthenticatorFormFieldInterface;
    /**
     * SIWE Authenticator scopes field.
     */
    scope: CommonAuthenticatorFormFieldInterface;
    /**
     * SIWE Authenticator client id field value.
     */
    ClientId: CommonAuthenticatorFormFieldInterface;
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

const FORM_ID: string = "siwe-authenticator-form";

/**
 * SIWE Authenticator Settings Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const SIWEAuthenticatorForm: FunctionComponent<SIWEAuthenticatorFormPropsInterface> = (
    props: SIWEAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ formFields, setFormFields ] = useState<SIWEAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<SIWEAuthenticatorFormInitialValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: SIWEAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: SIWEAuthenticatorFormInitialValuesInterface = null;

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
    const getUpdatedConfigurations = (values: SIWEAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: any[] = [];

        for (const [ key, value ] of Object.entries(values)) {
            if (key !== undefined) {
                properties.push({
                    key: key,
                    value: value
                });
            }
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

        if (scope === SIWEConstants.SIWE_SCOPE_DICTIONARY.PROFILE) {
            return {
                description: t("extensions:develop.identityProviders.siwe.forms.authenticatorSettings" +
                    ".scopes.list.profile.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { scope }
                    </Code>
                ),
                icon: "user outline"
            };
        } else if (scope === SIWEConstants.SIWE_SCOPE_DICTIONARY.OPENID) {
            return {
                description: t("extensions:develop.identityProviders.siwe.forms.authenticatorSettings" +
                    ".scopes.list.openid.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { scope }
                    </Code>
                ),
                icon: "openid"
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
            onSubmit={ (values: any) => onSubmit(getUpdatedConfigurations(values as any)) }
            initialValues={ initialValues }
        >
            <Field.Input
                ariaLabel="SIWE authenticator client ID"
                inputType="default"
                name="ClientId"
                label={
                    t("extensions:develop.identityProviders.siwe.forms.authenticatorSettings.clientId.label")
                }
                placeholder={
                    t("extensions:develop.identityProviders.siwe.forms.authenticatorSettings.clientId.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.siwe.forms" +
                            ".authenticatorSettings.clientId.hint"
                        }
                    >
                        The <Code>Client ID</Code> you received from <Code>oidc.signinwithethereum.org</Code>
                        for your OIDC client.
                    </Trans>
                ) }
                required={ formFields?.ClientId?.meta?.isMandatory }
                readOnly={ readOnly || formFields?.ClientId?.meta?.readOnly }
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
                ariaLabel="SIWE authenticator client secret"
                className="addon-field-wrapper"
                inputType="password"
                type="password"
                name="ClientSecret"
                label={
                    t("extensions:develop.identityProviders.siwe.forms" +
                        ".authenticatorSettings.clientSecret.label")
                }
                placeholder={
                    t("extensions:develop.identityProviders.siwe.forms" +
                        ".authenticatorSettings.clientSecret.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.siwe.forms" +
                            ".authenticatorSettings.clientSecret.hint"
                        }
                    >
                        The <Code>Client secret</Code> you received <Code>oidc.signinwithethereum.org</Code>
                        for your OIDC client.
                    </Trans>
                ) }
                required={ formFields?.ClientSecret?.meta?.isMandatory }
                readOnly={ readOnly || formFields?.ClientSecret?.meta?.readOnly }
                value={ formFields?.ClientSecret?.value }
                maxLength={ formFields?.ClientSecret?.meta?.maxLength }
                minLength={
                    IdentityProviderManagementConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_SECRET_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ componentId }-client-secret` }
            />
            <Field.Input
                ariaLabel="SIWE authenticator authorized redirect URL"
                inputType="copy_input"
                name="callbackUrl"
                label={
                    t("extensions:develop.identityProviders.siwe.forms" +
                        ".authenticatorSettings.callbackUrl.label")
                }
                placeholder={
                    t("extensions:develop.identityProviders.siwe.forms" +
                        ".authenticatorSettings.callbackUrl.placeholder")
                }
                hint={
                    t("extensions:develop.identityProviders.siwe.forms" +
                        ".authenticatorSettings.callbackUrl.hint")
                }
                required={ formFields?.callbackUrl?.meta?.isMandatory }
                value={ formFields?.callbackUrl?.value }
                readOnly={ readOnly || formFields?.callbackUrl?.meta?.readOnly }
                maxLength={ formFields?.callbackUrl?.meta?.maxLength }
                minLength={
                    IdentityProviderManagementConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CALLBACK_URL_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ componentId }-authorized-redirect-url` }
            />
            {
                formFields?.scope?.value
                && formFields.scope.value.split
                && formFields.scope.value.split(" ").length > 0
                && (
                    <FormSection
                        heading={
                            t("extensions:develop.identityProviders.siwe.forms" +
                                ".authenticatorSettings.scopes.heading")
                        }
                    >
                        <div className="authenticator-dynamic-properties">
                            {
                                formFields.scope.value
                                    .split(" ")
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
                                                        className="authenticator-dynamic-property-icon"
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
                        <Hint>
                            <Trans
                                i18nKey={
                                    "extensions:develop.identityProviders.siwe.forms" +
                                    ".authenticatorSettings.scopes.hint"
                                }
                            >
                                The type of access provided for the connected apps to access data from Ethereum wallet.
                            </Trans>
                        </Hint>
                    </FormSection>
                )
            }
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="GitHub authenticator update button"
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
SIWEAuthenticatorForm.defaultProps = {
    "data-componentid": "swe-idp-authenticator-form",
    enableSubmitButton: true
};
