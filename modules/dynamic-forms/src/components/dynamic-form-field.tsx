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

import React from "react";
import FieldInput from "./field-input";
import { DynamicFieldInputTypes } from "../models";
import { TextFieldProps as OuiTextFieldProps } from "@oxygen-ui/react";

export type DynamicFormFieldProps = Partial<Omit<OuiTextFieldProps, 'type' | 'onChange'>> & {
    /**
     * Type of the dynamic field.
     */
    type: DynamicFieldInputTypes;
    /**
     * Name of the dynamic field.
     */
    name: string;
    /**
     * Label of the dynamic field.
     */
    label: string;
    /**
     * Index of the dynamic field.
     */
    index: number;
};

// Recursive component for rendering form fields
export const DynamicFormField = (props: DynamicFormFieldProps) => {
    const { type, name, ...rest } = props;

    switch (type) {
        case "text":
        case "number":
        case "password":
            return (
                <FieldInput name={ name } inputType={ type } { ...rest } />
            );

        default:
            return null;
    }
};

export default DynamicFormField;
