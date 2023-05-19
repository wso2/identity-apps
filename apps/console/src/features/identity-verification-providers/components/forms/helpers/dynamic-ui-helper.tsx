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
import { MetaDataInputTypes } from "../../../constants/metadata-constants";
import { IDVPConfigPropertiesInterface, IdentityVerificationProviderInterface } from "../../../models";
import { DropdownOptionsInterface, InputFieldMetaData } from "../../../models/ui-metadata";

const ERROR_MSG_REQUIRED_FIELD: string = "This field cannot be empty";
const ERROR_MSG_REGEX_FAILED: string = "Pattern validation failed";

export const renderFormUIWithMetadata = (
    uiMetaData: InputFieldMetaData[],
    idvp?: IdentityVerificationProviderInterface,
    isReadOnly: boolean = false,
    padBetweenElements: boolean = false
): React.ReactElement => {

    // TODO: Refactor MetaData -> Metadata
    const createElement = (elementMetadata: InputFieldMetaData): ReactElement => {
        // exclude rendering the divider for the first input element.
        const includeDivider: boolean= padBetweenElements ? elementMetadata.displayOrder !== 1 : false;
        // If there is an already existing IDVP, get the current value of the element from the IDVP.
        let currentElementValue: string | DropdownOptionsInterface = idvp?.configProperties?.find(
            (property: IDVPConfigPropertiesInterface ) => (property.key === elementMetadata.name))?.value;

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
                            validate={ (value: string ) => {
                                return performValidations(value, elementMetadata);
                            } }
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
                            validate={ (value: string ) => {
                                return performValidations(value, elementMetadata);
                            } }
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
                            validate={ (value: string ) => {
                                return performValidations(value, elementMetadata);
                            } }
                            value={ currentElementValue ?? elementMetadata.defaultValue }
                            initialValue={ currentElementValue ?? elementMetadata.defaultValue }
                            maxLength={ elementMetadata.maxLength }
                            minLength={ elementMetadata.minLength }
                            placeholder={ elementMetadata.placeholder }
                            isReadOnly={ isReadOnly }
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
                            value={ currentElementValue ?? elementMetadata.defaultValue }
                            initialValue={ currentElementValue ?? elementMetadata.defaultValue }
                            isReadOnly={ isReadOnly }
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
                            value={ currentElementValue ?? elementMetadata.defaultValue }
                            initialValue={ currentElementValue ?? elementMetadata.defaultValue }
                            isReadOnly={ isReadOnly }
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
                            validate={ (value: string ) => {
                                return performValidations(value, elementMetadata);
                            } }
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
                    ?.sort((a: InputFieldMetaData, b: InputFieldMetaData) => a.displayOrder - b.displayOrder)
                    ?.map((element: InputFieldMetaData) => {
                        return createElement(element);
                    })
            }
        </>
    );
};

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

export const performValidations: (string, InputFieldMetaData) => string = (
    value: string, elementMetaData: InputFieldMetaData
) => {

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
