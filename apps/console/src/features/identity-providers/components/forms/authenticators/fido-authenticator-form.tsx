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

import { Field, Form } from "@wso2is/form";
import isBoolean from "lodash-es/isBoolean";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    FIDOAuthenticatorFormFieldsInterface,
    FIDOAuthenticatorFormInitialValuesInterface,
    FIDOAuthenticatorFormPropsInterface
} from "../../../models";


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
        [ "data-componentid" ]: testId
    } = props;

    const { t } = useTranslation();

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

        originalInitialValues?.properties?.map((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties
                .find((meta: CommonAuthenticatorFormFieldMetaInterface) => meta.key === value.key);

            const moderatedName: string = value.name.replace(/\./g, "_");
            
            resolvedFormFields = {
                ...resolvedFormFields,
                [moderatedName]: {
                    meta,
                    value: value?.value === "true"
                }
            };

            resolvedInitialValues = {
                ...resolvedInitialValues,
                [moderatedName]: ( value.value === "true" || value.value === "false" )
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
    const getUpdatedConfigurations = (values: FIDOAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: CommonPluggableComponentPropertyInterface[] = [];

        for (const [ name, value ] of Object.entries(values)) {
            if (name) {

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
                label={ 
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".fido2.allowProgressiveEnrollment.label")
                }
                hint={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".fido2.allowProgressiveEnrollment.hint")
                }
                readOnly={ readOnly }
                width={ 12 }
                data-testid={ `${ testId }-enable-passkey-progressive-enrollment` }
            />
            <Field.Checkbox
                ariaLabel="Allow passkey usernameless authentication"
                name="FIDO_EnableUsernamelessAuthentication"
                label={ 
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".fido2.allowUsernamelessAuthentication.label")
                }
                hint={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".fido2.allowUsernamelessAuthentication.hint")
                }
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
    "data-componentid": "fido-authenticator-form",
    enableSubmitButton: true
};
