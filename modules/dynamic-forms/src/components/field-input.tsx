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

import React, { ReactElement } from "react";
import { FieldProps, Field as FinalFormField } from "react-final-form";
import { PasswordFieldAdapter, TextFieldAdapter } from "./adapters";
import { DynamicFieldInputTypes, FieldInputTypes } from "../models";
import { getValidation } from "../utils/validate";
import { FieldState } from "final-form";

export interface FieldInputPropsInterface extends Omit<FieldProps<any, any, any>, 'component'> {
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
        ...rest
    } = props;

    const inputFieldGenerator = () => {
        if (inputType == FieldInputTypes.INPUT_NUMBER) {
            return (
                <FinalFormField
                    type="number"
                    render={({ input, meta }) => (
                        <TextFieldAdapter input={input} meta={meta} name={name} type={inputType} {...rest} />
                    )}
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_TEXT) {
            return (
                <FinalFormField
                    type="text"
                    render={({ input, meta }) => (
                        <TextFieldAdapter input={ input } meta={ meta } name={ name } type={ inputType } { ...rest } />
                    )}
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_PASSWORD) {
            return (
                <FinalFormField
                    type="password"
                    render={({ input, meta }) => (
                        <PasswordFieldAdapter input={input} meta={meta} name={name} type={inputType} {...rest} />
                    )}
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    { ...rest }
                />
            );
        }
    };

    return inputFieldGenerator();
};

/**
 * Default props for the component.
 */
FieldInput.defaultProps = {
    maxLength: 50,
    minLength: 3,
    width: 16
};

export default FieldInput;
