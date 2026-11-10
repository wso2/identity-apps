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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    CommonAuthenticatorFormInitialValuesInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../models";

/**
 * Interface for Authsignal Authenticator Form props.
 */
interface AuthsignalAuthenticatorFormPropsInterface extends TestableComponentInterface {
    /**
     * Authsignal governance connector values, including the connector properties.
     */
    initialValues: CommonAuthenticatorFormInitialValuesInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
    /**
     * Specifies if the form is read only.
     */
    readOnly?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Connector property as returned by the identity governance API.
 */
interface AuthsignalConnectorPropertyInterface extends CommonPluggableComponentPropertyInterface {
    displayName?: string;
    description?: string;
}

const FORM_ID: string = "authsignal-authenticator-form";

/**
 * Prefix of connector properties that hold secrets.
 */
const SECRET_PROPERTY_PREFIX: string = "__secret__";

/**
 * Connector properties that must have a value.
 */
const REQUIRED_PROPERTIES: string[] = [
    "__secret__.Authsignal.SecretKey",
    "Authsignal.Region",
    "Authsignal.ActionCode"
];

const FIELD_MAX_LENGTH: number = 1024;

/**
 * Builds the form field name of a connector property.
 * Property names contain dots, which the form treats as nested paths, so fields are named by index.
 *
 * @param index - Index of the property.
 * @returns Form field name.
 */
const getFieldName = (index: number): string => `property_${ index }`;

/**
 * Authsignal Authenticator settings form. Fields are built from the Authsignal governance connector properties.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AuthsignalAuthenticatorForm: FunctionComponent<AuthsignalAuthenticatorFormPropsInterface> = (
    props: AuthsignalAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const properties: AuthsignalConnectorPropertyInterface[] = useMemo(
        () => (originalInitialValues?.properties ?? []) as AuthsignalConnectorPropertyInterface[],
        [ originalInitialValues ]
    );

    const initialValues: Record<string, string> = useMemo(() => {
        const values: Record<string, string> = {};

        properties.forEach((property: AuthsignalConnectorPropertyInterface, index: number) => {
            values[ getFieldName(index) ] = property.value ?? "";
        });

        return values;
    }, [ properties ]);

    /**
     * Maps the form values back to the connector properties.
     *
     * @param values - Form values.
     * @returns Values to submit.
     */
    const getUpdatedConfigurations = (
        values: Record<string, string>
    ): CommonAuthenticatorFormInitialValuesInterface => {
        const updatedProperties: CommonPluggableComponentPropertyInterface[] = properties.map(
            (property: AuthsignalConnectorPropertyInterface, index: number) => ({
                name: property.name,
                value: (values[ getFieldName(index) ] ?? "").trim()
            })
        );

        return {
            ...originalInitialValues,
            properties: updatedProperties
        };
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: Record<string, string>) => onSubmit(getUpdatedConfigurations(values)) }
            initialValues={ initialValues }
        >
            {
                properties.map((property: AuthsignalConnectorPropertyInterface, index: number) => (
                    <Field.Input
                        key={ property.name }
                        ariaLabel={ property.displayName ?? property.name }
                        inputType={ property.name.startsWith(SECRET_PROPERTY_PREFIX) ? "password" : "text" }
                        name={ getFieldName(index) }
                        label={ property.displayName ?? property.name }
                        hint={ property.description }
                        required={ REQUIRED_PROPERTIES.includes(property.name) }
                        readOnly={ readOnly }
                        maxLength={ FIELD_MAX_LENGTH }
                        minLength={ 0 }
                        width={ 12 }
                        data-testid={ `${ testId }-${ property.name }` }
                    />
                ))
            }
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Authsignal authenticator update button"
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
AuthsignalAuthenticatorForm.defaultProps = {
    "data-testid": "authsignal-authenticator-form"
};
