/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Field, Form } from "@wso2is/form";
import { Code, FormSection, GenericIcon, Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, SemanticICONS } from "semantic-ui-react";
import { IdentityProviderManagementConstants } from "../../../constants";
import {
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface
} from "../../../models";

/**
 * Interface for Facebook Authenticator Form props.
 */
interface FacebookAuthenticatorFormPropsInterface extends TestableComponentInterface {
    /**
     * Facebook Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * Facebook Authenticator configured initial values.
     */
    initialValues: CommonAuthenticatorFormInitialValuesInterface;
    /**
     * Callback for form submit.
     * @param {CommonAuthenticatorFormInitialValuesInterface} values - Resolved Form Values.
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
interface FacebookAuthenticatorFormInitialValuesInterface {
    /**
     * Facebook Authenticator client secret field value.
     */
    ClientSecret: string;
    /**
     * Facebook Authenticator callback URL field value.
     */
    callBackUrl: string;
    /**
     * Facebook Authenticator scopes field value.
     */
    Scope: string;
    /**
     * Facebook Authenticator client id field value.
     */
    ClientId: string;
}

/**
 * Form fields interface.
 */
interface FacebookAuthenticatorFormFieldsInterface {
    /**
     * Facebook Authenticator client secret field.
     */
    ClientSecret: CommonAuthenticatorFormFieldInterface;
    /**
     * Facebook Authenticator callback URL field.
     */
    callBackUrl: CommonAuthenticatorFormFieldInterface;
    /**
     * Facebook Authenticator scopes field.
     */
    Scope: CommonAuthenticatorFormFieldInterface;
    /**
     * Facebook User Info field.
     */
    UserInfoFields: CommonAuthenticatorFormFieldInterface;
    /**
     * Facebook Authenticator client id field value.
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

/**
 * Facebook Authenticator Form.
 *
 * @param {FacebookAuthenticatorFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const FacebookAuthenticatorForm: FunctionComponent<FacebookAuthenticatorFormPropsInterface> = (
    props: FacebookAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ formFields, setFormFields ] = useState<FacebookAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<FacebookAuthenticatorFormInitialValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: FacebookAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: FacebookAuthenticatorFormInitialValuesInterface = null;

        originalInitialValues.properties.map((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties
                .find((meta) => meta.key === value.key);

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
     *
     * @return {CommonAuthenticatorFormInitialValuesInterface} Sanitized form values.
     */
    const getUpdatedConfigurations = (values: FacebookAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties = [];

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
     * @param {string} scope - Input scope.
     *
     * @return {ScopeMetaInterface}
     */
    const resolveScopeMetadata = (scope: string): ScopeMetaInterface => {

        if (scope === IdentityProviderManagementConstants.FACEBOOK_SCOPE_DICTIONARY.EMAIL) {
            return {
                description: t("console:develop.features.authenticationProvider.forms" +
                    ".authenticatorSettings.facebook.scopes.list.email.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { IdentityProviderManagementConstants.FACEBOOK_SCOPE_DICTIONARY.EMAIL }
                    </Code>
                ),
                icon: "envelope outline"
            };
        }

        if (scope === IdentityProviderManagementConstants.FACEBOOK_SCOPE_DICTIONARY.PUBLIC_PROFILE) {
            return {
                description: t("console:develop.features.authenticationProvider.forms" +
                    ".authenticatorSettings.facebook.scopes.list.profile.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { IdentityProviderManagementConstants.FACEBOOK_SCOPE_DICTIONARY.PUBLIC_PROFILE }
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
            uncontrolledForm={ false }
            onSubmit={ (values) => onSubmit(getUpdatedConfigurations(values as any)) }
            initialValues={ initialValues }
        >
            <Field.Input
                ariaLabel="Facebook authenticator client ID"
                inputType="default"
                name="ClientId"
                label={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".facebook.clientId.label")
                }
                placeholder={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".facebook.clientId.placeholder")
                }
                hint={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".facebook.clientId.hint")
                }
                required={ formFields?.ClientId?.meta?.isMandatory }
                readOnly={ readOnly || formFields?.ClientId?.meta?.readOnly }
                value={ formFields?.ClientId?.value }
                maxLength={ formFields?.ClientId?.meta?.maxLength }
                minLength={
                    IdentityProviderManagementConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ testId }-client-id` }
            />
            <Field.Input
                ariaLabel="Facebook authenticator client secret"
                className="addon-field-wrapper"
                inputType="password"
                type="password"
                name="ClientSecret"
                label={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".facebook.clientSecret.label")
                }
                placeholder={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".facebook.clientSecret.placeholder")
                }
                hint={
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".facebook.clientSecret.hint"
                        }
                    >
                        The <Code>App secret</Code> value of the Facebook application.
                    </Trans>
                }
                required={ formFields?.ClientSecret?.meta?.isMandatory }
                readOnly={ readOnly || formFields?.ClientSecret?.meta?.readOnly }
                value={ formFields?.ClientSecret?.value }
                maxLength={ formFields?.ClientSecret?.meta?.maxLength }
                minLength={
                    IdentityProviderManagementConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_SECRET_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ testId }-client-secret` }
            />
            <Field.Input
                ariaLabel="Facebook authenticator authorized redirect URL"
                inputType="copy_input"
                name="callBackUrl"
                label={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".facebook.callbackUrl.label")
                }
                placeholder={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".facebook.callbackUrl.placeholder")
                }
                hint={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".facebook.callbackUrl.hint")
                }
                required={ formFields?.callBackUrl?.meta?.isMandatory }
                value={ formFields?.callBackUrl?.value }
                readOnly={ readOnly || formFields?.callBackUrl?.meta?.readOnly }
                maxLength={ formFields?.callBackUrl?.meta?.maxLength }
                minLength={
                    IdentityProviderManagementConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CALLBACK_URL_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ testId }-authorized-redirect-url` }
            />
            {
                formFields?.Scope?.value
                && formFields.Scope.value.split
                && formFields.Scope.value.split(",").length > 0
                && (
                    <FormSection
                        heading={
                            t("console:develop.features.authenticationProvider.forms" +
                                ".authenticatorSettings.facebook.scopes.heading")
                        }
                    >
                        <div className="authenticator-dynamic-properties">
                            {
                                formFields.Scope.value
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
                                    "console:develop.features.authenticationProvider.forms" +
                                    ".authenticatorSettings.facebook.scopes.hint"
                                }
                            >
                                Permissions provide a way for connected apps to access data from Facebook.
                                Click <a
                                href="https://developers.facebook.com/docs/permissions/reference"
                                target="_blank"
                                rel="noopener noreferrer"
                            >here</a> to learn more.
                            </Trans>
                        </Hint>
                    </FormSection>
                )
            }
            <Field.Button
                size="small"
                buttonType="primary_btn"
                ariaLabel="Facebook authenticator update button"
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
FacebookAuthenticatorForm.defaultProps = {
    "data-testid": "facebook-authenticator-form",
    enableSubmitButton: true
};
