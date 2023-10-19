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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import isBoolean from "lodash-es/isBoolean";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    AuthenticatorSettingsFormModes,
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../models";

/**
 * Interface for FIDO Authenticator Form props.
 */
interface FIDOAuthenticatorFormPropsInterface extends TestableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    /**
     * FIDO Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * FIDO Authenticator configured initial values.
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
interface FIDOAuthenticatorFormInitialValuesInterface {
    /**
     * Allow passkey progressive enrollment.
     */
    FIDO_EnablePasskeyProgressiveEnrollment: boolean;
    /**
     * Allow FIDO usernameless authentication
     */
    FIDO_EnableUsernamelessAuthentication: boolean;
}

/**
 * Form fields interface.
 */
interface FIDOAuthenticatorFormFieldsInterface {
    /**
     * Allow passkey progressive enrollment field.
     */
    FIDO_EnablePasskeyProgressiveEnrollment: CommonAuthenticatorFormFieldInterface;
    /**
     * Allow FIDO usernameless authentication field.
     */
    FIDO_EnableUsernamelessAuthentication: CommonAuthenticatorFormFieldInterface;
}

/**
 * Proptypes for the FIDO Authenticator Form error messages.
 */
export interface FIDOAuthenticatorFormErrorValidationsInterface {
    /**
     * Allow passkey progressive enrollment field.
     */
    FIDO_EnablePasskeyProgressiveEnrollment: string;
    /**
     * Allow FIDO usernameless authentication field.
     */
    FIDO_EnableUsernamelessAuthentication: string;
}

const FORM_ID: string = "fido-authenticator-form";

/**
 * FIDO Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const FIDOAuthenticatorForm: FunctionComponent<FIDOAuthenticatorFormPropsInterface> = (
    props: FIDOAuthenticatorFormPropsInterface
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

    // This can be used when `meta` support is there.
    const [ , setFormFields ] = useState<FIDOAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<FIDOAuthenticatorFormInitialValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: FIDOAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: FIDOAuthenticatorFormInitialValuesInterface = null;

        originalInitialValues.properties.map((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties
                .find((meta: CommonAuthenticatorFormFieldMetaInterface) => meta.key === value.key);

            const moderatedName: string = value.name.replace(/\./g, "_");
            
            resolvedFormFields = {
                ...resolvedFormFields,
                [moderatedName]: {
                    meta,
                    value: ( value.value === "true" || value.value === "false" )
                        ? JSON.parse(value.value)
                        : value.value
                }
            };

            resolvedInitialValues = {
                ...resolvedInitialValues,
                [moderatedName]: ( value.value === "true" || value.value === "false" )
                    ? JSON.parse(value.value)
                    : value.value
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
    const getUpdatedConfigurations = (values: FIDOAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: CommonPluggableComponentPropertyInterface[] = [];

        for (const [ name, value ] of Object.entries(values)) {
            if (name !== undefined) {

                const moderatedName: string = name.replace(/_/g, ".");

                properties.push({
                    name: moderatedName,
                    value: isBoolean(value) ? value.toString() : value
                });
            }
        }

        return {
            ...originalInitialValues,
            properties
        };
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: FIDOAuthenticatorFormInitialValuesInterface) => {
                onSubmit(getUpdatedConfigurations(values as FIDOAuthenticatorFormInitialValuesInterface));
            } }
            initialValues={ initialValues }
        >
            <Field.Checkbox
                ariaLabel="Allow passkey progressive enrollment"
                name="FIDO_EnablePasskeyProgressiveEnrollment"
                label={ "Allow passkey progressive enrollment" }
                hint={ "Please clear this checkbox to disable passkey progressive enrollment." }
                readOnly={ readOnly }
                width={ 12 }
                data-testid={ `${ testId }-enable-passkey-progressive-enrollment` }
            />
            <Field.Checkbox
                ariaLabel="Allow passkey usernameless authentication"
                name="FIDO_EnableUsernamelessAuthentication"
                label={ "Allow passkey usernameless authentication" }
                hint={ "Please clear this checkbox to disable usernameless authentication." }
                readOnly={ readOnly }
                width={ 12 }
                data-testid={ `${ testId }-enable-passkey-usernameless-authentication` }
            />
    
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="FIDO authenticator update button"
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
FIDOAuthenticatorForm.defaultProps = {
    "data-testid": "fido-authenticator-form",
    enableSubmitButton: true
};
