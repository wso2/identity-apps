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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FormApi, FormRenderProps } from "@wso2is/form";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConnectorConfigFormFields } from "./connector-config-form-fields";
import { SCIM2_AUTH_PROPERTIES } from "../../../../constants/outbound-provisioning-constants";
import { AuthenticatorSettingsFormModes } from "../../../../models/authenticators";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../../../models/connection";
import { isFieldVisibleForAuthMode } from "../../../../utils/provisioning-utils";

/**
 * Props for the OutboundProvisioningConnectorConfigForm component.
 */
interface OutboundProvisioningConnectorConfigFormProps extends IdentifiableComponentInterface {
    /**
     * The intended mode of the form.
     * If the mode is "EDIT", fields may be readonly based on metadata.
     * If the mode is "CREATE", all fields are editable regardless of readonly prop.
     */
    mode?: AuthenticatorSettingsFormModes;
    metadata: OutboundProvisioningConnectorMetaInterface;
    initialValues: OutboundProvisioningConnectorInterface;
    onSubmit: (values: OutboundProvisioningConnectorInterface) => void;
    readOnly?: boolean;
    isSubmitting?: boolean;
    showSubmitButton?: boolean;
    triggerSubmit?: boolean;
}

const FORM_ID: string = "outbound-provisioning-connector-config-form";

/**
 * Edit page form wrapper for outbound provisioning connector configuration.
 *
 * @param props - OutboundProvisioningConnectorConfigFormProps
 * @returns ReactElement
 */
export const OutboundProvisioningConnectorConfigForm: FunctionComponent<
    OutboundProvisioningConnectorConfigFormProps
> = (
    props: OutboundProvisioningConnectorConfigFormProps
): ReactElement => {

    const {
        mode,
        metadata,
        initialValues,
        onSubmit,
        readOnly = false,
        isSubmitting = false,
        showSubmitButton = true,
        triggerSubmit,
        ["data-componentid"]: componentId = "outbound-provisioning-connector-config-form"
    } = props;

    const { t } = useTranslation();
    const formRef: React.MutableRefObject<FormApi<Record<string, unknown>> | null> =
        useRef<FormApi<Record<string, unknown>>>(null);

    const [ hasValidationErrors, setHasValidationErrors ] = useState<boolean>(false);

    const handleValidationChange: (hasErrors: boolean) => void = useCallback((hasErrors: boolean) => {
        setHasValidationErrors(hasErrors);
    }, []);

    const isFieldReadOnly: boolean = mode === AuthenticatorSettingsFormModes.CREATE ? false : readOnly;
    const isEditMode: boolean = mode !== AuthenticatorSettingsFormModes.CREATE;

    /**
     * Trigger form submission when triggerSubmit prop changes.
     */
    useEffect(() => {
        if (triggerSubmit && formRef.current) {
            formRef.current.submit();
        }
    }, [ triggerSubmit ]);

    /**
     * Get the initial value of a property from initialValues.
     */
    const getInitialPropertyValue = (propertyKey: string): string | undefined => {
        const initialProperty: CommonPluggableComponentPropertyInterface | undefined =
            initialValues?.properties?.find(
                (prop: CommonPluggableComponentPropertyInterface) => prop.key === propertyKey
            );

        return initialProperty?.value as string | undefined;
    };

    /**
     * Check if a confidential property value has been changed by the user.
     */
    const hasConfidentialValueChanged = (propertyKey: string, currentValue: unknown): boolean => {
        const initialValue: string | undefined = getInitialPropertyValue(propertyKey);

        if (!initialValue) {
            return currentValue !== undefined && currentValue !== null && currentValue !== "";
        }

        return String(currentValue) !== initialValue;
    };

    /**
     * Process a property and its sub-properties recursively to add them to the properties array.
     * For confidential properties, only include them if the user has changed the value
     * AND they're visible for current auth mode.
     *
     * @param property - The property metadata to process.
     * @param values - The form values.
     * @param properties - The properties array to populate.
     * @param currentAuthMode - The current authentication mode (for SCIM2 visibility checks).
     */
    const processProperty = (
        property: CommonPluggableComponentMetaPropertyInterface,
        values: Record<string, unknown>,
        properties: { key: string; value: string }[],
        currentAuthMode?: string
    ): void => {
        if (!property.key) {
            return;
        }

        const fieldValue: unknown = values[property.key];
        const isConfidential: boolean = property.isConfidential ?? false;
        const isFieldInForm: boolean = Object.hasOwn(values, property.key);

        const isFieldVisible: boolean = isFieldVisibleForAuthMode(
            property.key,
            metadata?.name,
            currentAuthMode
        );

        // For confidential properties in edit mode, only include if value changed.
        if (isEditMode && isConfidential) {
            if (hasConfidentialValueChanged(property.key, fieldValue)) {
                properties.push({
                    key: property.key,
                    value: String(fieldValue ?? "")
                });
            }
        } else if (property.type?.toUpperCase() === "BOOLEAN") {
            const valueToUse: any = fieldValue !== undefined && fieldValue !== null
                ? fieldValue
                : getInitialPropertyValue(property.key);

            properties.push({
                key: property.key,
                value: String(!!valueToUse)
            });
        } else if (isFieldInForm) {
            // Skip confidential fields that are not visible for current auth mode and have empty values.
            if (isConfidential && !isFieldVisible && !fieldValue) {
                return;
            }

            // Skip empty, unconfigured, non-mandatory fields.
            if (!fieldValue && !getInitialPropertyValue(property.key) && !property.isMandatory) {
                return;
            }

            properties.push({
                key: property.key,
                value: String(fieldValue ?? "")
            });
        } else {
            // Field is NOT in form (e.g., hidden auth fields) - use initial value or default.
            const initialValue: string | undefined = getInitialPropertyValue(property.key);

            if (initialValue !== undefined && initialValue !== null) {
                properties.push({
                    key: property.key,
                    value: initialValue
                });
            } else if (property.defaultValue) {
                // Use default value if no value provided and no initial value.
                properties.push({
                    key: property.key,
                    value: property.defaultValue
                });
            }
        }

        if (property.subProperties && property.subProperties.length > 0) {
            property.subProperties.forEach((subProperty: CommonPluggableComponentMetaPropertyInterface) => {
                processProperty(subProperty, values, properties, currentAuthMode);
            });
        }
    };

    const handleSubmit = (values: Record<string, unknown>): void => {
        const properties: { key: string; value: string }[] = [];

        // Get current auth mode from form values for SCIM2 visibility checks
        const currentAuthMode: string | undefined =
            values[SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE] as string | undefined;

        metadata?.properties?.forEach((property: CommonPluggableComponentMetaPropertyInterface) => {
            processProperty(property, values, properties, currentAuthMode);
        });

        onSubmit({
            ...initialValues,
            properties
        });
    };

    const getFormInitialValues = (): Record<string, unknown> => {
        const formValues: Record<string, any> = {};

        initialValues?.properties?.forEach((property: CommonPluggableComponentPropertyInterface) => {
            formValues[property.key] = property.value;
        });

        return formValues;
    };

    return (
        <FinalForm
            onSubmit={ handleSubmit }
            initialValues={ getFormInitialValues() }
            render={ ({ handleSubmit, form }: FormRenderProps) => {
                formRef.current = form;

                return (
                    <form id={ FORM_ID } onSubmit={ handleSubmit } data-componentid={ componentId }>
                        <ConnectorConfigFormFields
                            isEditMode={ mode !== AuthenticatorSettingsFormModes.CREATE }
                            metadata={ metadata }
                            initialValues={ initialValues }
                            readOnly={ isFieldReadOnly }
                            onValidationChange={ handleValidationChange }
                            data-componentid={ `${ componentId }-fields` }
                        />
                        { !readOnly && showSubmitButton && (
                            <div style={ { marginTop: "1rem" } }>
                                <PrimaryButton
                                    type="submit"
                                    data-componentid={ `${componentId}-form-update-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting || hasValidationErrors }
                                >
                                    { t("common:update") }
                                </PrimaryButton>
                            </div>
                        ) }
                    </form>
                );
            } }
        />
    );
};
