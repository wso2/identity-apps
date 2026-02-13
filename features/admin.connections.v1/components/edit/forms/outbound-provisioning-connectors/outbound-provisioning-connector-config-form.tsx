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
import {
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ConnectorConfigFormFields } from "./connector-config-form-fields";
import { AuthenticatorSettingsFormModes } from "../../../../models/authenticators";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../../../models/connection";

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
    /**
     * Connector metadata containing property definitions.
     */
    metadata: OutboundProvisioningConnectorMetaInterface;
    /**
     * Initial values for the connector.
     */
    initialValues: OutboundProvisioningConnectorInterface;
    /**
     * Callback when the form is submitted.
     */
    onSubmit: (values: OutboundProvisioningConnectorInterface) => void;
    /**
     * Whether the form should be read-only.
     */
    readOnly?: boolean;
    /**
     * Whether the form is currently submitting.
     */
    isSubmitting?: boolean;
    /**
     * Whether to show the submit button. Defaults to true.
     */
    showSubmitButton?: boolean;
    /**
     * Flag to trigger form submission externally.
     */
    triggerSubmit?: boolean;
}

const FORM_ID: string = "outbound-provisioning-connector-config-form";

/**
 * Edit page form wrapper for outbound provisioning connector configuration.
 * Wraps `ConnectorConfigFormFields` in a standalone `Form` from `@wso2is/form`.
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
    const formRef: React.MutableRefObject<FormApi<any> | null> = useRef<FormApi<any>>(null);

    // In CREATE mode, fields should always be editable.
    const isFieldReadOnly: boolean = mode === AuthenticatorSettingsFormModes.CREATE ? false : readOnly;

    // Determine if we're in edit mode (used for confidential property handling)
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
     * Returns true if the value is different from the initial value.
     */
    const hasConfidentialValueChanged = (propertyKey: string, currentValue: any): boolean => {
        const initialValue: string | undefined = getInitialPropertyValue(propertyKey);

        // If no initial value, any non-empty current value is considered a change
        if (!initialValue) {
            return currentValue !== undefined && currentValue !== null && currentValue !== "";
        }

        // Compare current value with initial value
        return String(currentValue) !== initialValue;
    };

    /**
     * Process a property and its sub-properties recursively to add them to the properties array.
     * For confidential properties, only include them if the user has changed the value.
     * For non-confidential properties, always include them.
     */
    const processProperty = (
        property: CommonPluggableComponentMetaPropertyInterface,
        values: Record<string, any>,
        properties: { key: string; value: string }[]
    ): void => {
        if (!property.key) {
            return;
        }

        const fieldValue: any = values[property.key];
        const isConfidential: boolean = property.isConfidential ?? false;

        // For confidential properties in edit mode, only include if value changed
        if (isEditMode && isConfidential) {
            if (fieldValue !== undefined && fieldValue !== null
                && hasConfidentialValueChanged(property.key, fieldValue)) {
                // Value has changed, include it in the request
                properties.push({
                    key: property.key,
                    value: String(fieldValue)
                });
            }
            // If unchanged, don't include it (backend will preserve existing value)
        } else if (property.type?.toUpperCase() === "BOOLEAN") {
            // Non-confidential checkbox values - always include
            properties.push({
                key: property.key,
                value: String(!!fieldValue)
            });
        } else if (fieldValue !== undefined && fieldValue !== null) {
            // Non-confidential values - always include
            properties.push({
                key: property.key,
                value: String(fieldValue)
            });
        } else if (property.defaultValue) {
            // Use default value if no value provided
            properties.push({
                key: property.key,
                value: property.defaultValue
            });
        }

        // Process sub-properties recursively
        if (property.subProperties && property.subProperties.length > 0) {
            property.subProperties.forEach((subProperty: CommonPluggableComponentMetaPropertyInterface) => {
                processProperty(subProperty, values, properties);
            });
        }
    };

    /**
     * Transform flat form values into the OutboundProvisioningConnectorInterface format.
     */
    const handleSubmit = (values: Record<string, any>): void => {
        const properties: { key: string; value: string }[] = [];

        metadata?.properties?.forEach((property: CommonPluggableComponentMetaPropertyInterface) => {
            processProperty(property, values, properties);
        });

        onSubmit({
            ...initialValues,
            properties
        });
    };

    return (
        <FinalForm
            onSubmit={ handleSubmit }
            // initialValues={ initialValues }
            // enableReinitialize={ true }
            render={ ({ handleSubmit, form }: FormRenderProps) => {
                formRef.current = form;

                return (
                    <>
                        <form id={ FORM_ID } onSubmit={ handleSubmit } data-componentid={ componentId }>
                            <ConnectorConfigFormFields
                                isEditMode={ mode !== AuthenticatorSettingsFormModes.CREATE }
                                metadata={ metadata }
                                initialValues={ initialValues }
                                fieldNamePrefix=""
                                readOnly={ isFieldReadOnly }
                                data-componentid={ `${ componentId }-fields` }
                            />
                        </form>
                        { !readOnly && showSubmitButton && (
                            <PrimaryButton
                                type="submit"
                                data-componentid={ `${componentId}-form-update-button` }
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                onClick={ () => {
                                    form.submit();
                                } }
                            >
                                { t("common:update") }
                            </PrimaryButton>
                        ) }
                    </>
                );
            } }
        />
    );
};
