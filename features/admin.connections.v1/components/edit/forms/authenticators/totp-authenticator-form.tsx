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
import { Field, Form } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import {useTranslation } from "react-i18next";
import {
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface
} from "../../../../models/authenticators";
import {
    CommonPluggableComponentPropertyInterface
} from "../../../../models/connection";

interface TOTPAuthenticatorFormPropsInterface extends TestableComponentInterface {
    /**
     * TOTP Authenticator Metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * TOTP Authenticator configured initial values.
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
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Form initial values interface.
 */
interface TOTPAuthenticatorFormInitialValuesInterface {
    /**
     * Enable progressive enrollment.
     */
    TOTP_EnrolUserInAuthenticationFlow: boolean;
}

/**
 * Proptypes for the TOTP Authenticator Form error messages.
 */
export interface TOTPAuthenticatorFormErrorValidationsInterface {
    /**
     * Enable progressive enrollment.
     */
    TOTP_EnrolUserInAuthenticationFlow: string;
}

const FORM_ID: string = "totp-authenticator-form";

/**
 * TOTP Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const TOTPAuthenticatorForm: FunctionComponent<TOTPAuthenticatorFormPropsInterface> = (
    props: TOTPAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ initialValues, setInitialValues ] = useState<TOTPAuthenticatorFormInitialValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: TOTPAuthenticatorFormInitialValuesInterface = null;

        originalInitialValues.properties.forEach((value: CommonAuthenticatorFormPropertyInterface) => {
            const moderatedName: string = value.name.replace(/\./g, "_");

            resolvedInitialValues = {
                ...resolvedInitialValues,
                [moderatedName]: (value.value === "true" || value.value === "false")
                    ? JSON.parse(value.value)
                    : value.value
            };
        });

        setInitialValues(resolvedInitialValues);
    }, [ originalInitialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: TOTPAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: CommonPluggableComponentPropertyInterface[] = [];

        for (const [ name, value ] of Object.entries(values)) {
            if (name !== undefined) {
                const moderatedName: string = name.replace(/_/g, ".");

                properties.push({
                    name: moderatedName,
                    value: value.toString()
                });
            }
        }

        const result: CommonAuthenticatorFormInitialValuesInterface = {
            ...originalInitialValues,
            properties
        };

        return result;
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: Record<string, any>) => {
                onSubmit(getUpdatedConfigurations(values as TOTPAuthenticatorFormInitialValuesInterface));
            } }
            initialValues={ initialValues }
        >
            <Field.Checkbox
                ariaLabel="Enable TOTP device progressive enrollment"
                name="TOTP_EnrolUserInAuthenticationFlow"
                label={
                    t("authenticationProvider:forms.authenticatorSettings.totp.enrollUserInAuthenticationFlow.label")
                }
                hint={
                     t("authenticationProvider:forms.authenticatorSettings.totp.enrollUserInAuthenticationFlow.hint") 
                }
                readOnly={ readOnly }
                width={ 16 }
                data-testid={ `${ testId }-totp-enrol-user-in-authentication-flow-checkbox` }
            />
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="TOTP Authenticator update button"
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
TOTPAuthenticatorForm.defaultProps = {
    "data-testid": "totp-authenticator-form"
};
