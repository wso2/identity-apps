/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import FormGroup from "@oxygen-ui/react/FormGroup";
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
import { FieldState } from "final-form";
import React, { ReactElement } from "react";
import { FieldProps, Field as FinalFormField } from "react-final-form";
import {
    CopyFieldAdapter,
    PasswordFieldAdapter,
    QueryParamsAdapter,
    ScopeFieldAdapter,
    TextFieldAdapter
} from "./adapters";
import { DynamicFieldInputTypes, FieldInputTypes } from "../models";
import { getValidation } from "../utils/validate";

export interface FieldInputPropsInterface extends Omit<FieldProps<any, any, any>, "component">,
    IdentifiableComponentInterface, TestableComponentInterface {

    /**
     * Name of the input field.
     */
    name: string;
    /**
     * Type of the input field.
     */
    inputType: DynamicFieldInputTypes;
    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Validation of the field.
     */
    validation?: (value: string | number | any, allValues: Record<string, unknown>) => any;
}

/**
 * Implementation of the Input Field component.
 * @param props - Props injected to the component.
 */
export const FieldInput = (props: FieldInputPropsInterface): ReactElement => {

    const {
        inputType,
        validation,
        initialValue,
        ...rest
    } = props;

    const inputFieldGenerator = () => {
        if (inputType == FieldInputTypes.INPUT_NUMBER) {
            return (
                <FinalFormField
                    type="number"
                    render={ ( { input, meta } ) => (
                        <TextFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_TEXT) {
            return (
                <FinalFormField
                    type="text"
                    parse={ (value: any) => value }
                    render={ ( { input, meta } ) => (
                        <TextFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    { ...props }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_CLIENT_ID) {
            return (
                <FinalFormField
                    type="text"
                    parse={ (value: any) => value }
                    render={ ( { input, meta } ) => (
                        <TextFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    { ...props }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_PASSWORD) {
            return (
                <FinalFormField
                    type="password"
                    render={ ( { input, meta } ) => {
                        delete input.type;

                        return (
                            <PasswordFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                        );
                    } }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_COPY) {
            return (
                <FinalFormField
                    type="text"
                    render={ ( { input, meta } ) => (
                        <CopyFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_QUERY_PARAM) {
            return (
                <FinalFormField
                    type="text"
                    render={ ( { input, meta } ) => (
                        <QueryParamsAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_SCOPE) {
            return (
                <FinalFormField
                    type="text"
                    name={ props.name }
                    component={ ScopeFieldAdapter }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else {
            return (
                <FinalFormField
                    type="text"
                    name={ props.name }
                    parse={ (value: any) => value }
                    component={ TextFieldAdapter }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    { ...rest }
                />
            );
        }
    };

    return (
        <FormGroup>
            { inputFieldGenerator() }
            {
                props.hint && (
                    <Hint compact>
                        { props.hint }
                    </Hint>
                )
            }
        </FormGroup>
    );
};

/**
 * Default props for the component.
 */
FieldInput.defaultProps = {
    maxLength: 250,
    minLength: 3,
    width: 16
};

export default FieldInput;
