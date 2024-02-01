/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid";
import { TestableComponentInterface } from "@wso2is/core/models";
import {
    DynamicField,
    DynamicFieldInputTypes,
    DynamicForm,
    FieldInputPropsInterface,
    FieldInputTypes
} from "@wso2is/dynamic-forms";
import { Code, FormSection, GenericIcon, Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, SemanticICONS } from "semantic-ui-react";
import { ConnectionManagementConstants } from "../../../constants/connection-constants";
import {
    AuthenticatorSettingsFormModes,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface
} from "../../../models/authenticators";
import "./authenticator-settings-form.scss";

/**
 * Interface for Google Authenticator Form props.
 */
interface AuthenticatorSettingsFormPropsInterface extends TestableComponentInterface {
    connectorSettings: any;
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    /**
     * Google Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * Google Authenticator configured initial values.
     */
    initialValues: any;
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

/**
 * Dynamic input elements of the authenticator settings form.
 */
interface DynamicInputElementsInterface {
    /**
     * The displaying order of the input element.
     */
    displayOrder: number;
    /**
     * Dyanamic input element.
     */
    element: React.ReactElement;
}

const FORM_ID: string = "authenticator-settings-form";

/**
 * Authenticator Settings Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AuthenticatorSettingsForm: FC<AuthenticatorSettingsFormPropsInterface> = (
    props: AuthenticatorSettingsFormPropsInterface
): any => {

    const {
        connectorSettings,
        metadata,
        initialValues: originalInitialValues,
        onSubmit,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ formFields, setFormFields ] = useState<any>(undefined);
    const [ initialValues, setInitialValues ] = useState<any>(undefined);
    const [ settings, setSettings ] = useState<any>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: any = null;
        let resolvedInitialValues: any = null;

        originalInitialValues.properties.map((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties?.find(
                (meta: CommonAuthenticatorFormFieldMetaInterface) => meta.key === value.key);

            /**
            * Parsing string  to boolean only for Google One Tap value
            */
            let localValue : any;

            if (value.key === ConnectionManagementConstants.GOOGLE_ONE_TAP_ENABLED) {
                if (value.value === "true") {
                    localValue = true;
                } else {
                    localValue = false;
                }
            } else {
                localValue = value.value;
            }

            resolvedFormFields = {
                ...resolvedFormFields,
                [ value.key ]: {
                    meta,
                    value: localValue
                }
            };

            resolvedInitialValues = {
                ...resolvedInitialValues,
                [ value.key ]: localValue
            };
        });

        setFormFields(resolvedFormFields);
        setInitialValues(resolvedInitialValues);
    }, [ originalInitialValues ]);

    useEffect(() => {
        if (!connectorSettings) {
            return;
        }

        setSettings(connectorSettings);
    }, [ connectorSettings ]);

    /**
     * Resolve metadata for UI rendering of scopes.
     */
    const resolveScopeMetadata = (scope: string) => {

        const foundScope: ScopeMetaInterface = settings?.edit?.tabs?.settings?.scopes?.find(
            (connectorScope: ScopeMetaInterface) => {
                return connectorScope?.displayName === scope;
            }
        );

        if (foundScope) {
            return {
                description: foundScope?.description,
                displayName: (
                    <Code compact withBackground={ false } fontSize="inherit" fontColor="inherit">
                        { foundScope?.displayName }
                    </Code>
                ),
                icon: foundScope?.icon
            };
        }
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     *
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, any>): CommonAuthenticatorFormInitialValuesInterface => {

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
     * Extracts scopes as an array.
     *
     * Input - "scope=openid email profile"
     * Output - [ "openid", "email", "profile" ]
     *
     * @param rawScopes - Raw String.
     *
     * @returns list of scopes
     */
    const extractScopes = (rawScopes: string) => {

        let scopes: string[] = [];

        try {
            scopes = rawScopes.trim().split("scope=")[1].split(" ");
        } catch(e) {
            // Silent any issues occurred when trying to scroll.
            // Add debug logs here one a logger is added.
            // Tracked here https://github.com/wso2/product-is/issues/11650.
        }

        return scopes;
    };

    /**
     * Resolve the form field values.
     *
     * @returns Form fields.
     */
    const renderFormFields = () => {
        if (settings) {
            return (
                settings?.edit?.tabs?.settings?.map(
                    (connectorField: FieldInputPropsInterface) => {
                        return (
                            <DynamicField.Input
                                key={ connectorField.name }
                                name={ connectorField.name }
                                label={ connectorField.label }
                                inputType={ connectorField.inputType }
                                { ...connectorField }
                            />
                        );
                    })
            );
        } else if (formFields) {
            const fields: DynamicInputElementsInterface[] = [];

            for (const key in formFields) {
                if (key === "AdditionalQueryParameters") {
                    continue;
                }

                const value: any = formFields[key];

                fields.push(
                    {
                        displayOrder: value?.meta?.displayOrder,
                        element: (
                            <DynamicField.Input
                                key={ key }
                                name={ key }
                                label={ value?.meta?.displayName }
                                inputType={ getInputTypeFromVarType(value?.meta?.type, value?.meta?.isConfidential) }
                                required={ value?.meta?.isMandatory }
                                placeholder={ value?.meta?.description }
                                initialValue={ value?.value }
                                className="authenticator-settings-dynamic-input-field"
                            />
                        )
                    }
                );
            }

            const sortedFields: DynamicInputElementsInterface[] = fields.sort(
                (firstValue: DynamicInputElementsInterface, secondValue: DynamicInputElementsInterface) =>
                    firstValue.displayOrder - secondValue.displayOrder
            );

            return sortedFields.map((el: DynamicInputElementsInterface) => el.element);
        }
    };

    /**
     * Return the input field type according to
     * the given value type and properties.
     *
     * @param type - Value type.
     * @param isConfidential - Whether the value is confidential or not.
     *
     * @returns Input field type.
     */
    const getInputTypeFromVarType = (type: string, isConfidential: boolean): DynamicFieldInputTypes => {
        switch(type) {
            case "STRING":
                if (isConfidential) {
                    return FieldInputTypes.INPUT_PASSWORD;
                } else {
                    return FieldInputTypes.INPUT_TEXT;
                }
            case "INTEGER":
                return FieldInputTypes.INPUT_NUMBER;
            default:
                return FieldInputTypes.INPUT_TEXT;
        }
    };

    return (
        <Grid container spacing={ 2 } columns={ 16 }>
            <Grid sm={ 16 } lg={ 12 }>
                <DynamicForm
                    uncontrolledForm={ false }
                    id={ `${FORM_ID}-${originalInitialValues?.authenticatorId}` }
                    onSubmit={ (values: Record<string, any>) => onSubmit(getUpdatedConfigurations(values)) }
                    initialValues={ initialValues }
                    data-testid={ `${ testId }-dynamic-form` }
                >
                    { renderFormFields() }
                    {
                        (formFields?.AdditionalQueryParameters?.value
                            && !isEmpty(extractScopes(formFields?.AdditionalQueryParameters?.value))) && (
                            <FormSection
                                heading={
                                    t("console:develop.features.authenticationProvider.forms" +
                                        ".authenticatorSettings.google.scopes.heading")
                                }
                            >
                                <div className="authenticator-dynamic-properties">
                                    {
                                        extractScopes(formFields?.AdditionalQueryParameters.value)?.map(
                                            (scope: string, index: number) => {

                                                const scopeMeta: any = resolveScopeMetadata(scope);

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
                                                                icon={ <Icon name={ scopeMeta?.icon }/> }
                                                                size="micro"
                                                                className="scope-icon"
                                                                spaced="right"
                                                                verticalAlign="top"
                                                            />
                                                            <div data-testid={ `${ scope }-name` }>
                                                                { scopeMeta?.displayName }
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="authenticator-dynamic-property-description"
                                                            data-testid={ `${ scope }-description` }
                                                        >
                                                            { scopeMeta?.description }
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )
                                    }
                                </div>
                                <Hint compact>
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.authenticationProvider.forms" +
                                            ".authenticatorSettings.google.scopes.hint"
                                        }
                                    >
                                        Scopes provide a way for connected apps to access data from Google.
                                        Click <a
                                            href={
                                                "https://developers.google.com/identity/protocols/oauth2/" +
                                                "openid-connect#scope-param"
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >here</a> to learn more.
                                    </Trans>
                                </Hint>
                            </FormSection>
                        )
                    }
                    <DynamicField.Button
                        index={ 1 }
                        form={ `${FORM_ID}-${originalInitialValues?.authenticatorId}` }
                        ariaLabel="Update General Details"
                        size="small"
                        buttonType="primary_btn"
                        label={ t("common:update") }
                        name="submit"
                        disabled={ isSubmitting }
                    />
                </DynamicForm>
            </Grid>
        </Grid>
    );
};

/**
 * Default props for the component.
 */
AuthenticatorSettingsForm.defaultProps = {
    "data-testid": "authenticator-settings-form",
    enableSubmitButton: true
};

