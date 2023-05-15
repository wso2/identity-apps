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

import { Field, FieldInputTypes } from "@wso2is/form";
import React, { ReactElement } from "react";
import { Divider, Header } from "semantic-ui-react";
import { MetaDataInputTypes } from "../../../constants/metadata-constants";
import { IDVPConfigPropertiesInterface, IdentityVerificationProviderInterface } from "../../../models";
import { DropdownOptionsInterface, InputFieldMetaData } from "../../../models/ui-metadata";

export const renderUIFromMetadata = (
    uiMetaData: InputFieldMetaData[],
    isReadOnly: boolean,
    idvp?: IdentityVerificationProviderInterface
): ReactElement => {

    const createElement = (elementMetaData: InputFieldMetaData): ReactElement => {
        // exclude rendering the divider for the first input element.
        const includeDivider: boolean = elementMetaData.displayOrder !== 1;
        // If there is an already existing IDVP, get the current value of the element from the IDVP.
        const currentElementValue: string = idvp?.configProperties.find(
            (property: IDVPConfigPropertiesInterface ) => (property.key === elementMetaData.name))?.value;

        switch(elementMetaData?.type) {
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
                            ariaLabel={ elementMetaData.name }
                            inputType={ elementMetaData.type }
                            name={ elementMetaData.name }
                            label={ elementMetaData.label }
                            required={ elementMetaData.required }
                            message={ elementMetaData.message }
                            placeholder={ elementMetaData.placeholder }
                            // TODO: evaluate the support for custom validation functions through metadata.
                            // validation={ (value: string) => idpNameValidation(value) }
                            value={ currentElementValue ?? elementMetaData.defaultValue }
                            initialValue={ currentElementValue ?? elementMetaData.defaultValue }
                            maxLength={ elementMetaData.maxLength }
                            minLength={ elementMetaData.minLength }
                            data-componentid={ elementMetaData.dataComponentId }
                            hint={ elementMetaData.hint }
                            readOnly={ isReadOnly }
                        />
                    </>
                );
            case FieldInputTypes.INPUT_PASSWORD:
                return (
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Input
                            ariaLabel={ elementMetaData.name }
                            inputType={ elementMetaData.type }
                            type={ elementMetaData.type }
                            name={ elementMetaData.name }
                            label={ elementMetaData.label }
                            required={ elementMetaData.required }
                            message={ elementMetaData.message }
                            placeholder={ elementMetaData.placeholder }
                            // TODO: evaluate the support for custom validation functions through metadata.
                            // validation={ (value: string) => idpNameValidation(value) }
                            value={ currentElementValue ?? elementMetaData.defaultValue }
                            initialValue={ currentElementValue ?? elementMetaData.defaultValue }
                            maxLength={ elementMetaData.maxLength }
                            minLength={ elementMetaData.minLength }
                            data-componentid={ elementMetaData.dataComponentId }
                            hint={ elementMetaData.hint }
                            readOnly={ isReadOnly }/>
                    </>
                );

            case MetaDataInputTypes.TEXT_AREA:
                return(
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Textarea
                            ariaLabel={ elementMetaData.name }
                            name={ elementMetaData.name }
                            label={ elementMetaData.label }
                            hint={ elementMetaData.hint }
                            data-componentid={ elementMetaData.dataComponentId }
                            required={ elementMetaData.required }
                            value={ currentElementValue ?? elementMetaData.defaultValue }
                            initialValue={ currentElementValue ?? elementMetaData.defaultValue }
                            maxLength={ elementMetaData.maxLength }
                            minLength={ elementMetaData.minLength }
                            placeholder={ elementMetaData.placeholder }
                        />
                    </>
                );
            case MetaDataInputTypes.CHECKBOX:
                return (
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Checkbox
                            ariaLabel={ elementMetaData.name }
                            name={ elementMetaData.name }
                            hint={ elementMetaData.hint }
                            label={ elementMetaData.label }
                            data-componentid={ elementMetaData.dataComponentId }
                            required={ elementMetaData.required }
                            value={ currentElementValue ?? elementMetaData.defaultValue }
                            initialValue={ currentElementValue ?? elementMetaData.defaultValue }
                        />
                    </>
                );
            case MetaDataInputTypes.TOGGLE:
                return (
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Checkbox
                            toggle
                            ariaLabel={ elementMetaData.name }
                            name={ elementMetaData.name }
                            hint={ elementMetaData.hint }
                            label={ elementMetaData.label }
                            data-componentid={ elementMetaData.dataComponentId }
                            required={ elementMetaData.required }
                            value={ currentElementValue ?? elementMetaData.defaultValue }
                            initialValue={ currentElementValue ?? elementMetaData.defaultValue }
                        />
                    </>
                );
            case MetaDataInputTypes.DROPDOWN:
                return (
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Dropdown
                            search
                            fluid
                            type="dropdown"
                            ariaLabel={ elementMetaData.name }
                            name={ elementMetaData.name }
                            hint={ elementMetaData.hint }
                            label={ elementMetaData.label }
                            data-componentid={ elementMetaData.dataComponentId }
                            required={ elementMetaData.required }
                            options={ getDropdownOptions(elementMetaData.options) }
                            value={
                                currentElementValue ?? (elementMetaData.defaultValue as DropdownOptionsInterface).value
                            }
                            initialValue={
                                currentElementValue ?? (elementMetaData.defaultValue as DropdownOptionsInterface).value
                            }
                        />
                    </>
                );
            default:
                return(
                    <>
                        { includeDivider && <Divider hidden={ true }/> }
                        <Field.Input
                            ariaLabel={ elementMetaData.name }
                            inputType={ FieldInputTypes.INPUT_DEFAULT }
                            name={ elementMetaData.name }
                            label={ elementMetaData.label }
                            required={ elementMetaData.required }
                            message={ elementMetaData.message }
                            placeholder={ elementMetaData.placeholder }
                            // TODO: evaluate the support for custom validation functions through metadata.
                            // validation={ (value: string) => idpNameValidation(value) }
                            value={ currentElementValue ?? elementMetaData.defaultValue }
                            initialValue={ currentElementValue ?? elementMetaData.defaultValue }
                            maxLength={ elementMetaData.maxLength }
                            minLength={ elementMetaData.minLength }
                            data-componentid={ elementMetaData.dataComponentId }
                            hint={ elementMetaData.hint }
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
                    .sort((a: InputFieldMetaData, b: InputFieldMetaData) => a.displayOrder - b.displayOrder)
                    .map((element: InputFieldMetaData) => {
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
