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

    /**
     * Trigger form submission when triggerSubmit prop changes.
     */
    useEffect(() => {
        if (triggerSubmit && formRef.current) {
            formRef.current.submit();
        }
    }, [ triggerSubmit ]);

    /**
     * Transform flat form values into the OutboundProvisioningConnectorInterface format.
     */
    const handleSubmit = (values: Record<string, any>): void => {
        const properties: { key: string; value: string }[] = [];

        metadata?.properties?.forEach((property: CommonPluggableComponentMetaPropertyInterface) => {
            if (!property.key) {
                return;
            }
            const fieldValue: any = values[property.key];

            if (property.type?.toUpperCase() === "BOOLEAN") {
                // Checkbox values come as boolean
                properties.push({
                    key: property.key,
                    value: String(!!fieldValue)
                });
            } else if (fieldValue !== undefined) {
                // Skip confidential properties with empty values.
                // Backend doesn't return confidential values, so if they're still empty,
                // it means the user didn't modify them and we shouldn't send them.
                if (property.isConfidential && !fieldValue) {
                    return;
                }
                properties.push({
                    key: property.key,
                    value: String(fieldValue)
                });
            } else if (property.defaultValue) {
                properties.push({
                    key: property.key,
                    value: property.defaultValue
                });
            }
        });

        onSubmit({
            ...initialValues,
            properties
        });
    };

    return (
        <FinalForm
            onSubmit={ handleSubmit }
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
