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
import {
    CheckboxFieldAdapter,
    FinalFormField,
    RadioGroupFieldAdapter,
    TextFieldAdapter,
    __DEPRECATED__SelectFieldAdapter
} from "@wso2is/form";
import { Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../../../models/connection";
import "./connector-config-form-fields.scss";

/**
 * Props for the ConnectorConfigFormFields component.
 */
interface ConnectorConfigFormFieldsProps extends IdentifiableComponentInterface {
    /**
     * Connector metadata containing property definitions.
     */
    metadata: OutboundProvisioningConnectorMetaInterface;
    /**
     * Initial values for the connector properties.
     */
    initialValues?: OutboundProvisioningConnectorInterface;
    /**
     * Prefix for field names (e.g., "connector_" for wizard, "" for edit).
     */
    fieldNamePrefix?: string;
    /**
     * Whether the fields should be read-only.
     */
    readOnly?: boolean;
}

/**
 * Shared metadata-driven field renderer for outbound provisioning connector config.
 *
 * @param props - ConnectorConfigFormFieldsProps
 * @returns ReactElement
 */
export const ConnectorConfigFormFields: FunctionComponent<ConnectorConfigFormFieldsProps> = (
    props: ConnectorConfigFormFieldsProps
): ReactElement => {

    const {
        metadata,
        initialValues,
        fieldNamePrefix = "",
        readOnly = false,
        ["data-componentid"]: componentId = "connector-config-form-fields"
    } = props;

    // Track dynamic values for properties that need to listen to changes (e.g., checkboxes with sub-properties)
    const [ dynamicValues, setDynamicValues ] = useState<OutboundProvisioningConnectorInterface>(
        initialValues ?? { properties: [] }
    );

    useEffect(() => {
        if (initialValues) {
            setDynamicValues(initialValues);
        }
    }, [ initialValues ]);

    /**
     * Get the value of a property from dynamicValues.
     */
    const getPropertyValue = (key: string | undefined): string | undefined => {
        if (!key) {
            return undefined;
        }

        const property: CommonPluggableComponentPropertyInterface | undefined = dynamicValues?.properties?.find(
            (prop: CommonPluggableComponentPropertyInterface) => prop.key === key
        );

        return property?.value as string | undefined;
    };

    /**
     * Sort properties by displayOrder.
     */
    const getSortedProperties = (
        properties: CommonPluggableComponentMetaPropertyInterface[]
    ): CommonPluggableComponentMetaPropertyInterface[] => {
        if (!properties) {
            return [];
        }

        return [ ...properties ]
            .filter((property: CommonPluggableComponentMetaPropertyInterface) =>
                !isEmpty(property?.displayName)
            )
            .sort((a: CommonPluggableComponentMetaPropertyInterface,
                b: CommonPluggableComponentMetaPropertyInterface) =>
                (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
            );
    };

    /**
     * Field types enum.
     */
    enum FieldType {
        CHECKBOX = "CheckBox",
        RADIO = "Radio",
        DROPDOWN = "DropDown",
        TEXT = "Text",
        PASSWORD = "Password"
    }

    /**
     * Determine the field type based on property metadata.
     */
    const getFieldType = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): FieldType => {
        if (propertyMetadata?.type?.toUpperCase() === "BOOLEAN") {
            return FieldType.CHECKBOX;
        } else if (propertyMetadata?.type?.toUpperCase() === "RADIO") {
            return FieldType.RADIO;
        } else if (propertyMetadata?.options && propertyMetadata?.options.length > 0) {
            return FieldType.DROPDOWN;
        } else if (propertyMetadata?.isConfidential) {
            return FieldType.PASSWORD;
        }

        return FieldType.TEXT;
    };

    /**
     * Check whether provided property is a checkbox and contains sub-properties.
     */
    const isCheckboxWithSubProperties = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): boolean => {
        return (propertyMetadata?.subProperties?.length ?? 0) > 0
            && getFieldType(propertyMetadata) === FieldType.CHECKBOX;
    };

    /**
     * Check whether provided property is a radio button and contains sub-properties.
     */
    const isRadioButtonWithSubProperties = (
        propertyMetadata: CommonPluggableComponentMetaPropertyInterface
    ): boolean => {
        return (propertyMetadata?.subProperties?.length ?? 0) > 0
            && getFieldType(propertyMetadata) === FieldType.RADIO;
    };

    /**
     * Get sorted property fields as ReactElements.
     * Recursively handles sub-properties for checkboxes and radio buttons.
     */
    const getSortedPropertyFields = (
        metaProperties: CommonPluggableComponentMetaPropertyInterface[]
    ): ReactElement[] => {
        const bucket: ReactElement[] = [];
        const sortedProperties: CommonPluggableComponentMetaPropertyInterface[] = getSortedProperties(metaProperties);

        sortedProperties.forEach((metaProperty: CommonPluggableComponentMetaPropertyInterface) => {
            if (isEmpty(metaProperty?.displayName)) {
                return;
            }
            let field: ReactElement;

            // Handle different property types
            if (isCheckboxWithSubProperties(metaProperty)) {
                // Checkbox with sub-properties: render parent checkbox and sub-properties.
                const subFields: ReactElement[] = (metaProperty?.subProperties ?? [])
                    .filter((subProp: CommonPluggableComponentMetaPropertyInterface) =>
                        !isEmpty(subProp?.displayName)
                    )
                    .sort((a: CommonPluggableComponentMetaPropertyInterface,
                        b: CommonPluggableComponentMetaPropertyInterface) =>
                        (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
                    )
                    .map((subProp: CommonPluggableComponentMetaPropertyInterface) =>
                        renderField(subProp)
                    );

                field = (
                    <React.Fragment key={ metaProperty?.key }>
                        { renderField(metaProperty) }
                        { subFields }
                    </React.Fragment>
                );
            } else if (isRadioButtonWithSubProperties(metaProperty)) {
                // Radio button with sub-properties: render parent radio button
                field = (
                    <React.Fragment key={ metaProperty?.key }>
                        { renderField(metaProperty) }
                    </React.Fragment>
                );
            } else {
                // Regular field without sub-properties
                field = renderField(metaProperty);
            }

            bucket.push(field);
        });

        return bucket;
    };



    /**
     * Render a single field based on property metadata, wrapped in Grid for proper spacing.
     */
    const renderField = (
        propertyMetadata: CommonPluggableComponentMetaPropertyInterface
    ): ReactElement => {
        const fieldName: string = `${ fieldNamePrefix }${ propertyMetadata.key }`;
        const existingValue: string | undefined = getPropertyValue(propertyMetadata.key);
        const isReadOnly: boolean = readOnly || propertyMetadata.readOnly || false;
        const fieldType: FieldType = getFieldType(propertyMetadata);

        // Render field content based on type
        const renderFieldContent = (): ReactElement => {
            // Boolean type → Checkbox
            if (fieldType === FieldType.CHECKBOX) {
                return (
                    <FinalFormField
                        key={ propertyMetadata.key }
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ propertyMetadata.displayName }
                        data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                        name={ fieldName }
                        label={ propertyMetadata.displayName }
                        component={ CheckboxFieldAdapter }
                        disabled={ isReadOnly }
                        required={ propertyMetadata.isMandatory }
                        initialValue={ existingValue === "true" || propertyMetadata.defaultValue === "true" }
                        hint={
                            propertyMetadata.description ? (
                                <Hint compact>
                                    { propertyMetadata.description }
                                </Hint>
                            ) : null
                        }
                    />
                );
            }

            // Radio button type → Render a single radio group with options
            if (fieldType === FieldType.RADIO) {
                // Build radio options from sub-properties
                const radioOptions: Array<{ label: string; value: string }> = (
                    propertyMetadata.subProperties ?? []
                ).map((subProp: CommonPluggableComponentMetaPropertyInterface) => ({
                    label: subProp.displayName ?? "",
                    value: (subProp.defaultValue ?? subProp.key) || ""
                }));

                return (
                    <FinalFormField
                        key={ propertyMetadata.key }
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ propertyMetadata.displayName }
                        data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                        name={ fieldName }
                        label={ propertyMetadata.displayName }
                        component={ RadioGroupFieldAdapter }
                        initialValue={ existingValue || propertyMetadata.defaultValue }
                        readOnly={ isReadOnly }
                        required={ propertyMetadata.isMandatory }
                        options={ radioOptions }
                        hint={
                            propertyMetadata.description ? (
                                <Hint compact>
                                    { propertyMetadata.description }
                                </Hint>
                            ) : null
                        }
                    />
                );
            }

            // Dropdown for properties with options
            if (fieldType === FieldType.DROPDOWN) {
                const dropdownOptions: Array<{
                    key: string;
                    text: string;
                    value: string;
                }> = (propertyMetadata.options ?? []).map((option: string) => ({
                    key: option,
                    text: option,
                    value: option
                }));

                return (
                    <FinalFormField
                        key={ propertyMetadata.key }
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ propertyMetadata.displayName }
                        data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                        name={ fieldName }
                        type="dropdown"
                        label={ propertyMetadata.displayName }
                        component={ __DEPRECATED__SelectFieldAdapter }
                        initialValue={ existingValue || propertyMetadata.defaultValue }
                        readOnly={ isReadOnly }
                        required={ propertyMetadata.isMandatory }
                        options={ dropdownOptions }
                        helperText={
                            propertyMetadata.description ? (
                                <Hint compact>
                                    { propertyMetadata.description }
                                </Hint>
                            ) : null
                        }
                    />
                );
            }

            // Confidential → Password input
            if (fieldType === FieldType.PASSWORD) {
                return (
                    <FinalFormField
                        key={ propertyMetadata.key }
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ propertyMetadata.displayName }
                        data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                        name={ fieldName }
                        type="password"
                        label={ propertyMetadata.displayName }
                        placeholder={ propertyMetadata.defaultValue
                            ? `Default: ${ propertyMetadata.defaultValue }`
                            : `Enter ${ propertyMetadata.displayName }` }
                        component={ TextFieldAdapter }
                        initialValue={ existingValue || propertyMetadata.defaultValue }
                        readOnly={ isReadOnly }
                        required={ propertyMetadata.isMandatory }
                        maxLength={ propertyMetadata.maxLength ?? 1000 }
                        helperText={
                            propertyMetadata.description ? (
                                <Hint compact>
                                    { propertyMetadata.description }
                                </Hint>
                            ) : null
                        }
                    />
                );
            }

            // Default → Text input
            return (
                <FinalFormField
                    key={ propertyMetadata.key }
                    fullWidth
                    FormControlProps={ {
                        margin: "dense"
                    } }
                    aria-label={ propertyMetadata.displayName }
                    data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                    name={ fieldName }
                    type="text"
                    label={ propertyMetadata.displayName }
                    placeholder={ propertyMetadata.defaultValue
                        ? `Default: ${ propertyMetadata.defaultValue }`
                        : `Enter ${ propertyMetadata.displayName }` }
                    component={ TextFieldAdapter }
                    initialValue={ existingValue || propertyMetadata.defaultValue }
                    readOnly={ isReadOnly }
                    required={ propertyMetadata.isMandatory }
                    maxLength={ propertyMetadata.maxLength ?? 1000 }
                    helperText={
                        propertyMetadata.description ? (
                            <Hint compact>
                                { propertyMetadata.description }
                            </Hint>
                        ) : null
                    }
                />
            );
        };

        return (
            <Grid.Row columns={ 1 } key={ propertyMetadata.key }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    { renderFieldContent() }
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <Grid padded className="connector-config-form-fields">
            { getSortedPropertyFields(metadata?.properties ?? []) }
        </Grid>
    );
};
