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

import { TextFieldProps as OuiTextFieldProps, TextField } from "@oxygen-ui/react";
import React, { ReactElement } from "react";
import { FieldProps, FieldRenderProps } from "react-final-form";
import { ShowErrorFunc, showErrorOnBlur } from './utils';
import { DynamicFieldInputTypes } from "../models";

export type TextFieldProps = Partial<Omit<OuiTextFieldProps, "type" | "onChange">> & {
    
    /**
     * The name of the text field.
     */
    name: string;
    /**
     * The input type of the text field.
     */
    type?: DynamicFieldInputTypes;
    /**
     * The props to be passed into the text field.
     */
    fieldProps?: Partial<FieldProps<any, any>>;
    /**
     * The callback to be fired when an error occured.
     */
    showError?: ShowErrorFunc;
};

export const TextFieldAdapter = (props: FieldRenderProps<OuiTextFieldProps>): ReactElement => {

    const {
        label,
        input: { name, value, type, onChange, onBlur, onFocus, ...restInput },
        meta,
        required,
        fullWidth = true,
        helperText,
        showError = showErrorOnBlur,
        ...rest
    } = props;

    const { error, submitError } = meta;
    const isError = showError({ meta });

    return (
        <TextField
            variant="outlined"
            fullWidth={ fullWidth }
            helperText={ isError ? error || submitError : helperText }
            error={
                ((meta.error || meta.submitError) && meta.touched)
                    ? meta.error || meta.submitError
                    : null
            }
            onChange={ onChange }
            onBlur={ (event: any) => onBlur(event) }
            onFocus={ onFocus }
            name={ name }
            value={ value }
            type={ type }
            required={ required }
            InputLabelProps={ { required } }
            inputProps={ { required, ...restInput } }
            label={ label }
            { ...rest }
        />
    );
};

export const PasswordFieldAdapter = (props: FieldRenderProps<OuiTextFieldProps>): ReactElement => {

    const {
        label,
        input: { name, value, type, onChange, onBlur, onFocus, ...restInput },
        required,
        meta,
        fullWidth = true,
        helperText,
        showError = showErrorOnBlur,
        ...rest
    } = props;

    const { error, submitError } = meta;
    const isError = showError({ meta });

    return (
        <TextField
            variant="outlined"
            fullWidth={ fullWidth }
            helperText={ isError ? error || submitError : helperText }
            error={
                ((meta.error || meta.submitError) && meta.touched)
                    ? meta.error || meta.submitError
                    : null
            }
            onChange={ onChange }
            onBlur={ (event: any) => onBlur(event) }
            onFocus={ onFocus }
            name={ name }
            value={ value }
            type={ type }
            required={ required }
            inputProps={ { required, ...restInput } }
            InputLabelProps={ { required } }
            label={ label }
            { ...rest }
        />
    );
};
