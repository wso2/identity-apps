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

import { LocalAuthenticatorConstants } from "@wso2is/admin.connections.v1/constants/local-authenticator-constants";
import { GovernanceConnectorUtils } from "@wso2is/admin.server-configurations.v1/utils/governance-connector-utils";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    FieldInputTypes,
    FinalForm,
    FinalFormField,
    FormRenderProps,
    SelectFieldAdapter,
    TextFieldAdapter
} from "@wso2is/forms";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    CommonAuthenticatorFormInitialValuesInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../models";

/**
 * Interface for Authsignal Authenticator Form props.
 */
interface AuthsignalAuthenticatorFormPropsInterface extends IdentifiableComponentInterface {
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

/**
 * Connector properties that must have a value.
 */
const REQUIRED_PROPERTIES: string[] = [
    LocalAuthenticatorConstants.AUTHSIGNAL_PROPERTY_NAMES.SECRET_KEY,
    LocalAuthenticatorConstants.AUTHSIGNAL_PROPERTY_NAMES.REGION,
    LocalAuthenticatorConstants.AUTHSIGNAL_PROPERTY_NAMES.ACTION_CODE
];

const FIELD_MAX_LENGTH: number = 1024;

/**
 * Builds the form field name of a connector property.
 * Property names contain dots, which the form treats as nested paths, so the dots are encoded.
 *
 * @param propertyName - Name of the connector property.
 * @returns Form field name.
 */
const getFieldName = (propertyName: string): string =>
    GovernanceConnectorUtils.encodeConnectorPropertyName(propertyName);

/**
 * Authsignal Authenticator settings form. Fields are built from the Authsignal governance connector properties.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
const AuthsignalAuthenticatorForm: FunctionComponent<AuthsignalAuthenticatorFormPropsInterface> = (
    props: AuthsignalAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-componentid" ]: componentId = "authsignal-authenticator-form"
    } = props;

    const { t } = useTranslation();

    const properties: AuthsignalConnectorPropertyInterface[] = useMemo(
        () => (originalInitialValues?.properties ?? []) as AuthsignalConnectorPropertyInterface[],
        [ originalInitialValues ]
    );

    const initialValues: Record<string, string> = useMemo(() => {
        const values: Record<string, string> = {};

        properties.forEach((property: AuthsignalConnectorPropertyInterface) => {
            const value: string = property.value ?? "";

            // The connector reads the region in lower case, so match the dropdown options the same way.
            values[ getFieldName(property.name) ] =
                property.name === LocalAuthenticatorConstants.AUTHSIGNAL_PROPERTY_NAMES.REGION
                    ? value.toLowerCase()
                    : value;
        });

        return values;
    }, [ properties ]);

    const regionOptions: { text: string; value: string }[] = useMemo(
        () => LocalAuthenticatorConstants.AUTHSIGNAL_REGIONS.map((region: string) => ({
            text: t(`authenticationProvider:forms.authenticatorSettings.authsignal.regions.${ region }`),
            value: region
        })),
        [ t ]
    );

    /**
     * Checks that the required connector properties have a value, including fields the user has not touched.
     *
     * @param values - Form values.
     * @returns Errors keyed by field name.
     */
    const validateForm = (values: Record<string, string>): Record<string, string> => {
        const errors: Record<string, string> = {};

        properties.forEach((property: AuthsignalConnectorPropertyInterface) => {
            const fieldName: string = getFieldName(property.name);

            if (REQUIRED_PROPERTIES.includes(property.name) && !(values[ fieldName ] ?? "").trim()) {
                errors[ fieldName ] = t("common:required");
            }
        });

        return errors;
    };

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
            (property: AuthsignalConnectorPropertyInterface) => ({
                name: property.name,
                value: (values[ getFieldName(property.name) ] ?? "").trim()
            })
        );

        return {
            ...originalInitialValues,
            properties: updatedProperties
        };
    };

    /**
     * Renders the field of a connector property.
     *
     * @param property - Connector property.
     * @returns Form field.
     */
    const renderField = (property: AuthsignalConnectorPropertyInterface): ReactElement => {
        const label: string = property.displayName ?? property.name;
        const commonProps: Record<string, unknown> = {
            "aria-label": label,
            "data-componentid": `${ componentId }-${ getFieldName(property.name) }`,
            helperText: property.description,
            label,
            name: getFieldName(property.name),
            readOnly,
            required: REQUIRED_PROPERTIES.includes(property.name)
        };

        if (property.name === LocalAuthenticatorConstants.AUTHSIGNAL_PROPERTY_NAMES.REGION) {
            return (
                <FinalFormField
                    key={ property.name }
                    { ...commonProps }
                    component={ SelectFieldAdapter }
                    options={ regionOptions }
                />
            );
        }

        const isSecret: boolean = property.name.startsWith(
            LocalAuthenticatorConstants.AUTHSIGNAL_SECRET_PROPERTY_PREFIX
        );

        return (
            <FinalFormField
                key={ property.name }
                { ...commonProps }
                component={ TextFieldAdapter }
                type={ isSecret ? FieldInputTypes.INPUT_PASSWORD : undefined }
                autoComplete={ isSecret ? "new-password" : undefined }
                maxLength={ FIELD_MAX_LENGTH }
            />
        );
    };

    return (
        <FinalForm
            initialValues={ initialValues }
            validate={ validateForm }
            onSubmit={ (values: Record<string, string>) => onSubmit(getUpdatedConfigurations(values)) }
            render={ ({ handleSubmit }: FormRenderProps) => (
                <form onSubmit={ handleSubmit } data-componentid={ componentId }>
                    { properties.map(renderField) }
                    {
                        !readOnly && (
                            <PrimaryButton
                                className="mt-3"
                                size="small"
                                type="submit"
                                disabled={ isSubmitting }
                                loading={ isSubmitting }
                                data-componentid={ `${ componentId }-submit-button` }
                            >
                                { t("common:update") }
                            </PrimaryButton>
                        )
                    }
                </form>
            ) }
        />
    );
};

export default AuthsignalAuthenticatorForm;
