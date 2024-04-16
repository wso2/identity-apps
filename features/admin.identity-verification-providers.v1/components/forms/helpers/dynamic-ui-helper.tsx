/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { Field, FieldInputTypes, getDefaultValidation } from "@wso2is/form";
import React, { ReactElement } from "react";
import { Divider, Header } from "semantic-ui-react";
import { MetaDataInputTypes } from "../../../constants";
import {
    DropdownOptionsInterface,
    IDVPConfigPropertiesInterface,
    IdentityVerificationProviderInterface,
    InputFieldMetadata
} from "../../../models";

const ERROR_MSG_REQUIRED_FIELD: string = "This field cannot be empty";
const ERROR_MSG_REGEX_FAILED: string = "Pattern validation failed";

type InputFieldValue = string | boolean | number | DropdownOptionsInterface ;

/**
 * Renders the IDVP configuration property form fields with the given metadata.
 *
 * @param uiMetaData - Metadata to be used to render the form.
 * @param idvp - Identity verification provider.
 * @param isReadOnly - Is the form read only.
 * @param padBetweenElements - Should there be a padding between the form elements.
 * @returns The rendered configuration property fields.
 */
export const renderFormUIWithMetadata = (
    uiMetaData: InputFieldMetadata[],
    idvp?: IdentityVerificationProviderInterface,
    isReadOnly: boolean = false,
    padBetweenElements: boolean = false
): ReactElement => {

    /**
     * Creates a form field with the given input field metadata.
     *
     * @param elementMetadata - Metadata of the input field.
     * @returns The rendered form field.
     */
    const createElement = (elementMetadata: InputFieldMetadata): ReactElement => {
        // exclude rendering the divider for the first input element.
        const includeDivider: boolean= padBetweenElements ? elementMetadata.displayOrder !== 1 : false;
        // If there is an already existing IDVP, get the current value of the element from the IDVP.
        let currentElementValue: InputFieldValue = idvp?.configProperties?.find(
            (property: IDVPConfigPropertiesInterface ) => (property.key === elementMetadata.name)
        )?.value;

        switch(elementMetadata?.type) {
            case FieldInputTypes.INPUT_DEFAULT:
            case FieldInputTypes.INPUT_IDENTIFIER:
            case FieldInputTypes.INPUT_NAME:
            case FieldInputTypes.INPUT_NUMBER:
            case FieldInputTypes.INPUT_RESOURCE_NAME:
            case FieldInputTypes.INPUT_CLIENT_ID:
            case FieldInputTypes.INPUT_DESCRIPTION:
            case FieldInputTypes.INPUT_EMAIL:
            case FieldInputTypes.INPUT_URL:
                return (
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Input
                            ariaLabel={ elementMetadata.name }
                            inputType={ elementMetadata.type }
                            name={ elementMetadata.name }
                            label={ elementMetadata.label }
                            required={ elementMetadata.required }
                            message={ elementMetadata.message }
                            placeholder={ elementMetadata.placeholder }
                            validate={ (value: string ) =>  performValidations(value, elementMetadata) }
                            value={ currentElementValue ?? elementMetadata.defaultValue }
                            initialValue={ currentElementValue ?? elementMetadata.defaultValue }
                            maxLength={ elementMetadata.maxLength }
                            minLength={ elementMetadata.minLength }
                            data-componentid={ elementMetadata.dataComponentId }
                            hint={ elementMetadata.hint }
                            readOnly={ isReadOnly }
                        />
                    </>
                );
            case FieldInputTypes.INPUT_PASSWORD:
                return (
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Input
                            ariaLabel={ elementMetadata.name }
                            inputType={ elementMetadata.type }
                            type={ elementMetadata.type }
                            name={ elementMetadata.name }
                            label={ elementMetadata.label }
                            required={ elementMetadata.required }
                            message={ elementMetadata.message }
                            placeholder={ elementMetadata.placeholder }
                            validate={ (value: string ) => performValidations(value, elementMetadata) }
                            value={ currentElementValue ?? elementMetadata.defaultValue }
                            initialValue={ currentElementValue ?? elementMetadata.defaultValue }
                            maxLength={ elementMetadata.maxLength }
                            minLength={ elementMetadata.minLength }
                            data-componentid={ elementMetadata.dataComponentId }
                            hint={ elementMetadata.hint }
                            readOnly={ isReadOnly }
                        />
                    </>
                );
            case MetaDataInputTypes.TEXT_AREA:
                return(
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Textarea
                            ariaLabel={ elementMetadata.name }
                            name={ elementMetadata.name }
                            label={ elementMetadata.label }
                            hint={ elementMetadata.hint }
                            data-componentid={ elementMetadata.dataComponentId }
                            required={ elementMetadata.required }
                            validate={ (value: string ) => performValidations(value, elementMetadata) }
                            value={ currentElementValue ?? elementMetadata.defaultValue }
                            initialValue={ currentElementValue ?? elementMetadata.defaultValue }
                            maxLength={ elementMetadata.maxLength }
                            minLength={ elementMetadata.minLength }
                            placeholder={ elementMetadata.placeholder }
                            readOnly={ isReadOnly }
                        />
                    </>
                );
            case MetaDataInputTypes.CHECKBOX:
                return (
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Checkbox
                            ariaLabel={ elementMetadata.name }
                            name={ elementMetadata.name }
                            hint={ elementMetadata.hint }
                            label={ elementMetadata.label }
                            data-componentid={ elementMetadata.dataComponentId }
                            required={ elementMetadata.required }
                            initialValue={ toBoolean(currentElementValue, elementMetadata.defaultValue) }
                            disabled={ isReadOnly }
                            format={ (v: boolean) => (v) }
                            parse={ (v:boolean) => (v) }
                        />
                    </>
                );
            case MetaDataInputTypes.TOGGLE:
                return (
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Checkbox
                            toggle
                            ariaLabel={ elementMetadata.name }
                            name={ elementMetadata.name }
                            hint={ elementMetadata.hint }
                            label={ elementMetadata.label }
                            data-componentid={ elementMetadata.dataComponentId }
                            required={ elementMetadata.required }
                            initialValue={ toBoolean(currentElementValue, elementMetadata.defaultValue) }
                            disabled={ isReadOnly }
                            format={ (v: boolean) => (v) }
                            parse={ (v:boolean) => (v) }
                        />
                    </>
                );
            case MetaDataInputTypes.DROPDOWN:
                currentElementValue = currentElementValue ??
                    (elementMetadata.defaultValue as DropdownOptionsInterface).value;

                return (
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Dropdown
                            search
                            fluid
                            type="dropdown"
                            ariaLabel={ elementMetadata.name }
                            name={ elementMetadata.name }
                            hint={ elementMetadata.hint }
                            label={ elementMetadata.label }
                            data-componentid={ elementMetadata.dataComponentId }
                            required={ elementMetadata.required }
                            options={ getDropdownOptions(elementMetadata.options) }
                            value={ currentElementValue }
                            initialValue={ currentElementValue }
                            isReadOnly={ isReadOnly }
                            disabled={ isReadOnly }
                        />
                    </>
                );
            default:
                return(
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Input
                            ariaLabel={ elementMetadata.name }
                            inputType={ FieldInputTypes.INPUT_DEFAULT }
                            name={ elementMetadata.name }
                            label={ elementMetadata.label }
                            required={ elementMetadata.required }
                            message={ elementMetadata.message }
                            placeholder={ elementMetadata.placeholder }
                            validate={ (value: string ) => performValidations(value, elementMetadata) }
                            value={ currentElementValue ?? elementMetadata.defaultValue }
                            initialValue={ currentElementValue ?? elementMetadata.defaultValue }
                            maxLength={ elementMetadata.maxLength }
                            minLength={ elementMetadata.minLength }
                            data-componentid={ elementMetadata.dataComponentId }
                            hint={ elementMetadata.hint }
                            readOnly={ isReadOnly }
                        />
                    </>
                );
        }
    };

    return (
        <>
            {
                uiMetaData
                    ?.sort((a: InputFieldMetadata, b: InputFieldMetadata) => a.displayOrder - b.displayOrder)
                    ?.map((element: InputFieldMetadata) => {
                        return createElement(element);
                    })
            }
        </>
    );
};

/**
 * Renders the dropdown options for the dropdown field.
 *
 * @param options -Dropdown options.
 * @returns An array of rendered dropdown options.
 */
const getDropdownOptions = (options: DropdownOptionsInterface[]) => {
    return options.map((option: DropdownOptionsInterface, index: number) => ({
        content: (
            <Header as="h6" key={ `dropdown-option-${ index }` }>
                <Header.Content>
                    { option.label }
                </Header.Content>
            </Header>
        ),
        key: option.value,
        text: option.label,
        value: option.value
    }));
};

/**
 * Performs the validations specified in the metadata on the field value.
 *
 * @param value - Field value.
 * @param elementMetaData - Metadata of the field.
 * @returns An error message if the validation fails.
 */
export const performValidations = ( value: string, elementMetaData: InputFieldMetadata): string => {

    // perform required validation
    if (elementMetaData.required && !value) {
        return ERROR_MSG_REQUIRED_FIELD;
    }

    // skip the rest of the validations if the value is empty
    if (!value) {
        return;
    }

    // perform regex validation
    if (elementMetaData.validationRegex) {
        const regexp: RegExp = new RegExp(elementMetaData.validationRegex);

        if (!regexp.test(value)) {
            return  elementMetaData.regexValidationError ?? ERROR_MSG_REGEX_FAILED;
        }
    }

    const field: string = elementMetaData.type === FieldInputTypes.INPUT_PASSWORD ? "password" : "text";

    return getDefaultValidation(field, elementMetaData.type, value);
};

/**
 * A method to convert input field values to boolean.
 *      1. This method will only use the default value if the current element value is undefined.
 *      2. If the value is not in boolean type or the value is not "true", then it will be considered as false.
 *
 * @param currentElementValue - Current element value
 * @param defaultValue - Default value
 */
const toBoolean = (currentElementValue: InputFieldValue , defaultValue: InputFieldValue): boolean => {

    if(currentElementValue) {
        return typeof currentElementValue === "boolean"? currentElementValue : currentElementValue === "true";
    }

    return typeof defaultValue === "boolean"? defaultValue : defaultValue === "true";
};
