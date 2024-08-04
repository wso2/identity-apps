/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { ConnectionUIConstants } from "@wso2is/admin.connections.v1/constants/connection-ui-constants";
import {
    FederatedAuthenticatorConstants
} from "@wso2is/admin.connections.v1/constants/federated-authenticator-constants";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "@wso2is/admin.connections.v1/models/connection";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Code, FormSection, GenericIcon, Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, SemanticICONS } from "semantic-ui-react";
import {
    AuthenticatorSettingsFormModes,
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
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
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

const FORM_ID: string = "facebook-authenticator-form";

/**
 * Facebook Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const FacebookAuthenticatorForm: FunctionComponent<FacebookAuthenticatorFormPropsInterface> = (
    props: FacebookAuthenticatorFormPropsInterface
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
    const getUpdatedConfigurations = (values: FacebookAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: CommonPluggableComponentPropertyInterface[] = [];

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

        if (scope === FederatedAuthenticatorConstants.FACEBOOK_SCOPE_DICTIONARY.EMAIL) {
            return {
                description: t("authenticationProvider:forms" +
                    ".authenticatorSettings.facebook.scopes.list.email.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { FederatedAuthenticatorConstants.FACEBOOK_SCOPE_DICTIONARY.EMAIL }
                    </Code>
                ),
                icon: "envelope outline"
            };
        }

        if (scope === FederatedAuthenticatorConstants.FACEBOOK_SCOPE_DICTIONARY.PUBLIC_PROFILE) {
            return {
                description: t("authenticationProvider:forms" +
                    ".authenticatorSettings.facebook.scopes.list.profile.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { FederatedAuthenticatorConstants.FACEBOOK_SCOPE_DICTIONARY.PUBLIC_PROFILE }
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
            onSubmit={ (values: Record<string, unknown>) => onSubmit(getUpdatedConfigurations(values as any)) }
            initialValues={ initialValues }
        >
            <Field.Input
                ariaLabel="Facebook authenticator client ID"
                inputType="default"
                name="ClientId"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".facebook.clientId.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".facebook.clientId.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".facebook.clientId.hint")
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
                    ConnectionUIConstants
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
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".facebook.clientSecret.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".facebook.clientSecret.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".facebook.clientSecret.hint"
                        }
                    >
                        The <Code>App secret</Code> value of the Facebook application.
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
                ariaLabel="Facebook authenticator authorized redirect URL"
                inputType="copy_input"
                name="callBackUrl"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".facebook.callbackUrl.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".facebook.callbackUrl.placeholder")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".facebook.callbackUrl.hint")
                }
                required={ formFields?.callBackUrl?.meta?.isMandatory }
                value={ formFields?.callBackUrl?.value }
                readOnly={
                    readOnly || (
                        mode === AuthenticatorSettingsFormModes.CREATE
                            ? false
                            : formFields?.callBackUrl?.meta?.readOnly
                    )
                }
                maxLength={ formFields?.callBackUrl?.meta?.maxLength }
                minLength={
                    ConnectionUIConstants
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
                            t("authenticationProvider:forms" +
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
                                    "authenticationProvider:forms" +
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
                form={ FORM_ID }
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
