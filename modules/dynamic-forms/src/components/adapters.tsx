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

import Button from "@oxygen-ui/react/Button";
import TextField, { TextFieldProps as OuiTextFieldProps } from "@oxygen-ui/react/TextField";
import { CopyInputField, DangerButton, LinkButton, PrimaryButton } from "@wso2is/react-components";
import omit from "lodash-es/omit";
import React, { ReactElement } from "react";
import { FieldProps, FieldRenderProps } from "react-final-form";
import {
    Checkbox,
    CheckboxProps
} from "semantic-ui-react";
import { ShowErrorFunc, resolveFieldInitailValue, showErrorOnBlur } from "./utils";
import { QueryParameters, Scopes } from "../addons";
import { DynamicFieldInputTypes, FieldButtonTypes } from "../models";

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
        childFieldProps,
        placeholder,
        fullWidth = true,
        input: { name, value, onChange, onBlur, ...restInput },
        meta,
        required,
        parentFormProps,
        showError = showErrorOnBlur,
        helperText,
        label
    } = props;

    const { error, submitError } = meta;
    const isError = showError({ meta });

    return (
        <TextField
            variant="outlined"
            placeholder={ placeholder }
            fullWidth={ fullWidth }
            key={ childFieldProps?.testId }
            helperText={ isError ? error || submitError : helperText }
            required={ required }
            data-testid={ props["data-testid"] }
            label={ label }
            InputLabelProps={ { required: required } }
            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
                if (childFieldProps?.listen && typeof childFieldProps?.listen === "function") {
                    childFieldProps?.listen(event?.target?.value);
                }

                onChange(event?.target?.value);
            } }
            onBlur={ (event: any) => onBlur(event) }
            autoFocus={ childFieldProps?.autoFocus || false }
            value={ meta.modified
                ? value
                : meta?.initial
                    ? meta?.initial
                    : resolveFieldInitailValue(meta, name, parentFormProps?.values) }
            { ...omit(childFieldProps, [ "value", "listen" ]) }
            inputProps={ { required, ...restInput } }
            error={
                ((meta.error || meta.submitError) && meta.touched)
                    ? meta.error || meta.submitError
                    : null
            }
        />
    );
};

export const PasswordFieldAdapter = (props: FieldRenderProps<OuiTextFieldProps>): ReactElement => {

    const {
        childFieldProps,
        placeholder,
        fullWidth = true,
        input: { name, value, onChange, onBlur, ...restInput },
        meta,
        required,
        parentFormProps,
        showError = showErrorOnBlur,
        helperText,
        label
    } = props;

    const { error, submitError } = meta;
    const isError = showError({ meta });

    return (
        <TextField
            variant="outlined"
            type="password"
            placeholder={ placeholder }
            fullWidth={ fullWidth }
            key={ childFieldProps?.testId }
            helperText={ isError ? error || submitError : helperText }
            required={ required }
            data-testid={ props["data-testid"] }
            label={ label }
            InputLabelProps={ { required: required } }
            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
                if (childFieldProps?.listen && typeof childFieldProps?.listen === "function") {
                    childFieldProps?.listen(event?.target?.value);
                }

                onChange(event?.target?.value);
            } }
            onBlur={ (event: any) => onBlur(event) }
            autoFocus={ childFieldProps?.autoFocus || false }
            value={ meta.modified
                ? value
                : meta?.initial
                    ? meta?.initial
                    : resolveFieldInitailValue(meta, name, parentFormProps?.values) }
            { ...omit(childFieldProps, [ "value", "listen" ]) }
            inputProps={ { required, ...restInput } }
            error={
                ((meta.error || meta.submitError) && meta.touched)
                    ? meta.error || meta.submitError
                    : null
            }
        />
    );
};

export const ScopeFieldAdapter = (props:FieldRenderProps<any> ): ReactElement => {

    const { childFieldProps, input } = props;

    return (
        <Scopes
            defaultValue={ childFieldProps?.defaultValue }
            label = { childFieldProps?.label }
            value = { childFieldProps?.value }
            required = { childFieldProps?.required }
            onChange = { input?.onChange }
            onBlur = { input?.onBlur }
            placeholder = { childFieldProps?.placeholder }
        />
    );
};

export const CopyFieldAdapter = (props: FieldRenderProps<any>): ReactElement => {

    const { childFieldProps, parentFormProps } = props;
    const {
        label,
        ...filteredChildFieldProps
    } = childFieldProps;

    return (
        <>
            {
                label && (
                    <div className={ `field ${ filteredChildFieldProps.required ? "required" : "" }` }>
                        <label>{ label }</label>
                    </div>
                )
            }
            <CopyInputField
                key={ filteredChildFieldProps.testId }
                required={ filteredChildFieldProps.required }
                data-testid={ filteredChildFieldProps.testId }
                autoFocus={ filteredChildFieldProps.autoFocus || false }
                { ...filteredChildFieldProps }
                value={
                    filteredChildFieldProps?.value
                        ? filteredChildFieldProps?.value
                        : (
                            parentFormProps?.values[ filteredChildFieldProps?.name ]
                                ? parentFormProps?.values[ filteredChildFieldProps?.name ]
                                : ""
                        )
                }
            />
        </>
    );
};

export const QueryParamsAdapter = (props: FieldRenderProps<any>): ReactElement => {

    const { input, meta, label, name, parentFormProps } = props;

    if (!label)
        throw new Error("QueryParamsAdapter: required child prop 'label'");
    if (!name)
        throw new Error("QueryParamsAdapter: required child prop 'name'");

    return (
        <QueryParameters
            label={ label }
            name={ name }
            value={ meta.modified
                ? input?.value
                : meta?.initial
                    ? meta?.initial
                    : resolveFieldInitailValue(meta, name, parentFormProps?.values) }
            onChange={ input.onChange }
        />
    );
};

export const ButtonAdapter = ({ childFieldProps }: FieldRenderProps<any>): ReactElement => {
    if (childFieldProps.buttonType === FieldButtonTypes.BUTTON_PRIMARY) {
        return (
            <PrimaryButton
                { ...omit(childFieldProps, [ "label" ]) }
                disabled={ childFieldProps.disabled }
                key={ childFieldProps.testId }
                type="submit"
            >
                { childFieldProps.label }
            </PrimaryButton>
        );
    } else if (childFieldProps.buttonType === FieldButtonTypes.BUTTON_CANCEL) {
        return (
            <LinkButton
                { ...omit(childFieldProps, [ "label" ]) }
                disabled={ childFieldProps.disabled }
                key={ childFieldProps.testId }
            >
                { "Cancel" }
            </LinkButton>
        );
    } else if (childFieldProps.buttonType === FieldButtonTypes.BUTTON_LINK) {
        return (
            <LinkButton
                { ...omit(childFieldProps, [ "label" ]) }
                disabled={ childFieldProps.disabled }
                key={ childFieldProps.testId }
            >
                { childFieldProps.label }
            </LinkButton>
        );
    } else if (childFieldProps.buttonType === FieldButtonTypes.BUTTON_DANGER) {
        return (
            <DangerButton
                { ...omit(childFieldProps, [ "label" ]) }
                disabled={ childFieldProps.disabled }
                key={ childFieldProps.testId }
            >
                { childFieldProps.label }
            </DangerButton>
        );
    } else {
        return (
            <Button
                { ...omit(childFieldProps, [ "label" ]) }
                disabled={ childFieldProps.disabled }
                key={ childFieldProps.testId }
            >
                { childFieldProps.label }
            </Button>
        );
    }
};

export const CheckboxAdapter = (props: CheckboxProps): ReactElement => {

    const {
        childFieldProps,
        input: { value, ...input },
        ...rest
    } = props;

    // unused, just don't pass it along with the ...rest
    const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        type,
        meta,
        hint,
        children,
        parentFormProps,
        render,
        width,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...filteredRest
    } = rest;

    return (
        <Checkbox
            { ...input }
            { ...filteredRest }
            label={ childFieldProps?.label }
            name={ childFieldProps?.name }
            onChange={ (event: React.FormEvent<HTMLInputElement>, { checked }:any ) => {
                if (childFieldProps?.listen && typeof childFieldProps.listen === "function") {
                    childFieldProps.listen(checked);
                }

                input.onChange({
                    target: {
                        checked,
                        type: "checkbox",
                        value
                    }
                });
            } }
        />
    );
};

export const ToggleAdapter = (props: FieldRenderProps<any>): ReactElement => {

    const { childFieldProps, input } = props;

    return (
        <Checkbox
            label={ childFieldProps.label }
            name={ childFieldProps.name }
            children={ childFieldProps.children }
            onChange={ (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
                if (childFieldProps.listen && typeof childFieldProps.listen === "function") {
                    childFieldProps.listen(data?.checked);
                }

                input.onChange(data?.checked);
            } }
            control={ Checkbox }
            readOnly={ childFieldProps.readOnly }
            disabled={ childFieldProps.disabled }
            defaultChecked={ !(childFieldProps.value.length == 0) }
            autoFocus={ childFieldProps.autoFocus || false }
            { ...childFieldProps }
        />
    );
};
