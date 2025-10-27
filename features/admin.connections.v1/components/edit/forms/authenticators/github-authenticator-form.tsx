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

import { validateAMRValue } from "@wso2is/admin.identity-providers.v1/components/utils/connector-utils";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Code, FormSection, GenericIcon, Heading, Hint, IconButton } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, 
{ FunctionComponent, ReactElement, ReactNode, SVGAttributes,  useCallback, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Icon, SemanticICONS } from "semantic-ui-react";
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
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../../models/connection";

/**
 * Interface for GitHub Authenticator Form props.
 */
interface GithubAuthenticatorFormPropsInterface extends TestableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    /**
     * GitHub Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * GitHub Authenticator configured initial values.
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
interface GithubAuthenticatorFormInitialValuesInterface {
    /**
     * GitHub Authenticator client secret field value.
     */
    ClientSecret: string;
    /**
     * GitHub Authenticator callback URL field value.
     */
    callbackUrl: string;
    /**
     * GitHub Authenticator scopes field value.
     */
    scope: string;
    /**
     * Use primary email field value.
     */
    UsePrimaryEmail: string;
    /**
     * GitHub Authenticator client id field value.
     */
    ClientId: string;
    /**
     * Google Authenticator amr value field value.
     */
    amrValue: string;
}

/**
 * Form fields interface.
 */
interface GithubAuthenticatorFormFieldsInterface {
    /**
     * GitHub Authenticator client secret field.
     */
    ClientSecret: CommonAuthenticatorFormFieldInterface;
    /**
     * GitHub Authenticator callback URL field.
     */
    callbackUrl: CommonAuthenticatorFormFieldInterface;
    /**
     * GitHub Authenticator scopes field.
     */
    scope: CommonAuthenticatorFormFieldInterface;
    /**
     * Use primary email field.
     */
    UsePrimaryEmail: CommonAuthenticatorFormFieldInterface;
    /**
     * GitHub Authenticator client id field value.
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

const FORM_ID: string = "github-authenticator-form";

/**
 * GitHub Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const GithubAuthenticatorForm: FunctionComponent<GithubAuthenticatorFormPropsInterface> = (
    props: GithubAuthenticatorFormPropsInterface
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

    const [ formFields, setFormFields ] = useState<GithubAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<GithubAuthenticatorFormInitialValuesInterface>(undefined);
    const [isResettingAMR, setIsResettingAMR ] = useState(false);
    const [ isAMRFieldChanged, setIsAMRFieldChanged ] = useState(false);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: GithubAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: GithubAuthenticatorFormInitialValuesInterface = null;

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

        resolvedInitialValues = {
            ...resolvedInitialValues,
            amrValue: originalInitialValues.amrValue
        };

        setFormFields(resolvedFormFields);
        setInitialValues(resolvedInitialValues);
    }, [ originalInitialValues ]);

    /**
     * Handles form submit.
     * @param values - Form values. 
     */
    const handleSubmit = (values: Record<string, unknown>) => {
        const submitValues = {
            ...values,
            amrValue: isAMRFieldChanged ? values.amrValue : ""
        };
    
        onSubmit(getUpdatedConfigurations(submitValues as GithubAuthenticatorFormInitialValuesInterface));
        setIsResettingAMR(false);
        setIsAMRFieldChanged(false);
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: GithubAuthenticatorFormInitialValuesInterface)
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

        if (isResettingAMR) {
            properties.push({
                key: "amrValue",
                value: ""
            });
        } else {
            properties.push({
                key: "amrValue",
                value: values.amrValue
            });
        }

        return {
            ...originalInitialValues,
            amrValue: values.amrValue,
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

        if (scope === FederatedAuthenticatorConstants.GITHUB_SCOPE_DICTIONARY.USER_READ) {
            return {
                description: t("authenticationProvider:forms" +
                    ".authenticatorSettings.github.scopes.list.profile.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { FederatedAuthenticatorConstants.GITHUB_SCOPE_DICTIONARY.USER_READ }
                    </Code>
                ),
                icon: "user outline"
            };
        } else if (scope === FederatedAuthenticatorConstants.GITHUB_SCOPE_DICTIONARY.USER_EMAIL) {
            return {
                description: t("authenticationProvider:forms" +
                    ".authenticatorSettings.github.scopes.list.email.description"),
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { FederatedAuthenticatorConstants.GITHUB_SCOPE_DICTIONARY.USER_EMAIL }
                    </Code>
                ),
                icon: "envelope outline"
            };
        }

        return {
            description: "",
            displayName: scope,
            icon: "key"
        };
    };

    const ArrowRotateLeft = ({ ...rest }: SVGAttributes<SVGSVGElement>): ReactElement => (
        <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            style={{
                marginRight: "0",

                verticalAlign: "middle"
            }}
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <path
                fill="none"
                stroke="#000"
                strokeWidth="2"
                d="M8,3 L3,8 L8,13 M12,20 L15,20 C18.3137085,20 21,17.3137085 21,14 C21,10.6862915 18.3137085,8 15,8 L4,8"
            ></path>
        </svg>
    );


    const handleResetAMR = useCallback(() => {
        console.log("Resetting AMR value");
        setInitialValues(prevValues => ({
            ...prevValues,
            amrValue: originalInitialValues.name || ""
        }));
        setIsResettingAMR(true);
        setIsAMRFieldChanged(false);
    }, [originalInitialValues.name]);

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: Record<string, unknown>) => onSubmit(getUpdatedConfigurations(values as any)) }
            initialValues={ initialValues }
        >
            <Field.Input
                ariaLabel="GitHub authenticator client ID"
                inputType="default"
                name="ClientId"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".github.clientId.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".github.clientId.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".github.clientId.hint"
                        }
                    >
                        The <Code>Client ID</Code> you received from GitHub for your OAuth app.
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
                maxLength={ formFields?.ClientId?.meta?.maxLength }
                minLength={
                    ConnectionUIConstants
                        .AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.CLIENT_ID_MIN_LENGTH as number
                }
                width={ 16 }
                data-testid={ `${ testId }-client-id` }
            />
            <Field.Input
                ariaLabel="GitHub authenticator client secret"
                className="addon-field-wrapper"
                inputType="password"
                type="password"
                name="ClientSecret"
                label={
                    t("authenticationProvider:forms" +
                        ".authenticatorSettings.github.clientSecret.label")
                }
                placeholder={
                    t("authenticationProvider:forms" +
                        ".authenticatorSettings.github.clientSecret.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".github.clientSecret.hint"
                        }
                    >
                        The <Code>Client secret</Code> you received from GitHub for your OAuth app.
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
                ariaLabel="GitHub authenticator authorized redirect URL"
                inputType="copy_input"
                name="callbackUrl"
                label={
                    t("authenticationProvider:forms" +
                        ".authenticatorSettings.github.callbackUrl.label")
                }
                placeholder={
                    t("authenticationProvider:forms" +
                        ".authenticatorSettings.github.callbackUrl.placeholder")
                }
                hint={
                    t("authenticationProvider:forms" +
                        ".authenticatorSettings.github.callbackUrl.hint")
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
            <Divider />
            <Heading as="h5">
                {
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".smsOTP.amrHeading.heading")
                }
            </Heading>
            <Field.Input
                ariaLabel="AMR Value"
                inputType="text"
                name="amrValue"
                value={initialValues?.amrValue || ''}
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".google.allowedAmrValue.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".google.allowedAmrValue.placeholder")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".google.amrValurConstraint.hint"
                        }
                    >
                        The allowed characters are
                        <Code>letters, numbers and underscore</Code>.
                    </Trans>)
                }
                validation={(value: string) => validateAMRValue(value.toString().trim())}
                maxLength={255}
                minLength={2}
                width={12}
                data-testid={`${testId}-allowed-amr-value`}
                iconPosition="right"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setIsAMRFieldChanged(true);
                    setInitialValues(prev => ({
                        ...prev,
                        amrValue: event.target.value
                    }));
                }}
            >
                <input />
                <IconButton
                    title={
                        t("branding:brandingCustomText.form.genericFieldResetTooltip")
                    }
                    onClick={(e) => {
                        e.preventDefault();
                        handleResetAMR();
                    }}
                    style={{
                        backgroundColor: "white",
                        cursor: "pointer"
                    }}
                >
                    <ArrowRotateLeft />
                </IconButton>
            </Field.Input>
            {
                formFields?.scope?.value
                && formFields.scope.value.split
                && formFields.scope.value.split(" ").length > 0
                && (
                    <FormSection
                        heading={
                            t("authenticationProvider:forms" +
                                ".authenticatorSettings.github.scopes.heading")
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
                                    "authenticationProvider:forms" +
                                    ".authenticatorSettings.github.scopes.hint"
                                }
                            >
                                The scopes specifies the type of access provided for connected apps
                                to access data from GitHub. Click <a
                                    href={
                                        "https://docs.github.com/en/developers/apps/building-oauth" +
                                        "-apps/scopes-for-oauth-apps"
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
                ariaLabel="GitHub authenticator update button"
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
GithubAuthenticatorForm.defaultProps = {
    enableSubmitButton: true
};
