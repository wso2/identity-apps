/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { FC, ReactElement } from "react";
import { FieldRenderProps } from "react-final-form";
import {
    Checkbox,
    CheckboxProps,
    DropdownProps,
    FormCheckboxProps,
    FormInputProps,
    FormRadioProps,
    FormSelectProps,
    Input,
    InputOnChangeData,
    Radio,
    RadioProps,
    Select,
    Form as SemanticUIForm
} from "semantic-ui-react";

type TextFieldAdapterProps = FieldRenderProps<string, HTMLInputElement> & FormInputProps;
export const STextFieldAdapter = (props: TextFieldAdapterProps): ReactElement => {
    const { input, meta, ...rest } = props;
    return (
        <SemanticUIForm.Input
            { ...input }
            { ...rest }
            control={ Input }
            error={ ((meta?.touched || meta.modified) && !!meta?.error) ? meta.error : undefined }
            onChange={
                (event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => input.onChange(value)
            }
            onKeyPress={ (event: React.KeyboardEvent, data) => {
                event.key === "Enter" && input.onBlur(data?.name);
            } }
        />
    );
};

type SelectFieldAdapterProps = FieldRenderProps<string, HTMLSelectElement> & FormSelectProps;
export const SSelectFieldAdapter: FC<SelectFieldAdapterProps> = (props: SelectFieldAdapterProps): ReactElement => {
    const { input, meta, ...rest } = props;
    return (
        <SemanticUIForm.Select
            { ...input }
            { ...rest }
            control={ Select }
            onChange={ (event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
                input.onChange(value);
            } }
            onBlur={ (event: React.KeyboardEvent<HTMLSelectElement>, { value }: DropdownProps) => {
                input.onChange(value);
            } }
            error={ ((meta?.touched || meta.modified) && !!meta?.error) ? meta.error : undefined }
        />
    );
};

type CheckboxAdapterProps = FieldRenderProps<string, HTMLInputElement> & FormCheckboxProps;
export const SCheckboxAdapter: FC<CheckboxAdapterProps> = (props: CheckboxAdapterProps): ReactElement => {
    const { input, meta, ...rest } = props;
    return (
        <SemanticUIForm.Checkbox
            { ...input }
            { ...rest }
            type="checkbox"
            onChange={ (event: React.ChangeEvent<HTMLInputElement>, { checked }: CheckboxProps) => {
                input.onChange(checked);
            } }
            control={ Checkbox }
            error={ ((meta?.touched || meta.modified) && !!meta?.error) ? meta.error : undefined }
        />
    );
};

type RadioButtonAdapterProps = FieldRenderProps<string, HTMLInputElement> & FormRadioProps;
export const SRadioButtonAdapter = (props: RadioButtonAdapterProps): ReactElement => {
    const { input, meta, ...rest } = props;
    return (
        <SemanticUIForm.Radio
            { ...input }
            { ...rest }
            type="radio"
            onChange={ (event: React.ChangeEvent<HTMLInputElement>, { checked }: RadioProps) => {
                input.onChange(checked);
            } }
            control={ Radio }
            error={ ((meta?.touched || meta.modified) && !!meta?.error) ? meta.error : undefined }
        />
    );
};
