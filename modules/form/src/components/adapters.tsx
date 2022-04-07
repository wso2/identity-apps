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

import {
    Button,
    ColorPicker,
    ColorPickerResponseInterface,
    CopyInputField,
    DangerButton,
    LinkButton,
    Password,
    PrimaryButton
} from "@wso2is/react-components";
import omit from "lodash-es/omit";
import React, { ClipboardEvent, FormEvent, KeyboardEvent, ReactElement } from "react";
import { Checkbox, Form, Input, Popup, Select } from "semantic-ui-react";
import { QueryParameters } from "../addons";
import {
    CheckboxAdapterPropsInterface,
    ColorPickerAdapterPropsInterface,
    FieldButtonTypes,
    RadioAdapterPropsInterface
} from "../models";

/**
 * The enter key.
 * @constant
 * @type {string}
 */
const ENTER_KEY = "Enter";

export const TextFieldAdapter = (props): ReactElement => {

    const { childFieldProps, input, meta, parentFormProps } = props;

    return (
        <Form.Input
            aria-label={ childFieldProps.ariaLabel }
            key={ childFieldProps.testId }
            required={ childFieldProps.required }
            data-testid={ childFieldProps.testId }
            label={ childFieldProps.label !== "" ? childFieldProps.label : null }
            onKeyPress={ (event: React.KeyboardEvent, data) => {
                event.key === ENTER_KEY && input.onBlur(data?.name);
            } }
            onChange={ (event, data) => {
                if (childFieldProps.listen && typeof childFieldProps.listen === "function") {
                    childFieldProps.listen(data?.value);
                }

                input.onChange(data?.value);
            } }
            onBlur={ (event) => input.onBlur(event) }
            control={ Input }
            autoFocus={ childFieldProps.autoFocus || false }
            value={ meta.modified ? input.value
                : (childFieldProps?.value ? childFieldProps?.value
                    : (parentFormProps?.values[ childFieldProps?.name ] ? parentFormProps?.values[ childFieldProps?.name ] : "")) }
            { ...omit(childFieldProps, [ "value", "listen" ]) }
            type={
                childFieldProps.inputType === "number"
                    ? "number"
                    : "text"
            }
            error={
                (meta.error && meta.touched)
                    ? meta.error
                    : null
            }
            onKeyDown={
                // Restrict typing non-numeric characters in the "number" input fields.
                // Setting `type=number` is not sufficient to support firefox & IE.
                // Port fix from https://github.com/wso2/identity-apps/pull/2035
                childFieldProps.inputType === "number"
                    ? ((event: KeyboardEvent) => {
                        const isNumber: boolean = /^[0-9]$/i.test(event.key);
                        const isAllowed: boolean = (
                            (event.key === "a"
                                || event.key === "v"
                                || event.key === "c"
                                || event.key === "x")
                            && (event.ctrlKey === true
                                || event.metaKey === true)
                        )
                            || (
                                event.key === "ArrowRight"
                                || event.key == "ArrowLeft")
                            || (
                                event.key === "Delete"
                                || event.key === "Backspace");

                        !isNumber && !isAllowed && event.preventDefault();
                    })
                    : (): void => { return; }
            }
            onPaste={
                // Restrict pasting non-numeric characters in the "number" input fields
                // Setting `type=number` is not sufficient to support firefox & IE.
                // Port fix from https://github.com/wso2/identity-apps/pull/2035
                childFieldProps.inputType === "number"
                    ? ((event: ClipboardEvent) => {
                        const data: string = event.clipboardData.getData("Text") ;
                        const isNumber: boolean = /^[0-9]+$/i.test(data);

                        !isNumber && event.preventDefault();
                    })
                    : (): void => { return; }
            }
        />
    );
};

export const PasswordFieldAdapter = (props): ReactElement => {

    const { childFieldProps, input, meta, parentFormProps } = props;

    return (
        <Password
            key={ childFieldProps.testId }
            data-testid={ childFieldProps.testId }
            hidePassword="Hide password"
            label={ childFieldProps.label !== "" ? childFieldProps.label : null }
            name="newPassword"
            required={ true }
            showPassword="Show password"
            onKeyPress={ (event: React.KeyboardEvent, data) => {
                event.key === ENTER_KEY && input.onBlur(data?.name);
            } }
            onChange={ (event, data) => input.onChange(data?.value) }
            onBlur={ (event) => input.onBlur(event) }
            error={
                (meta.error && meta.touched)
                    ? meta.error
                    : null
            }
            autoFocus={ childFieldProps.autoFocus || false }
            { ...childFieldProps }
            value={ meta.modified ? input.value
                : (childFieldProps?.value ? childFieldProps?.value
                    : (parentFormProps?.values[ childFieldProps?.name ] ? parentFormProps?.values[ childFieldProps?.name ] : "")) }
        />
    );
};

export const CopyFieldAdapter = (props): ReactElement => {

    const { childFieldProps, parentFormProps } = props;
    const {
        label,
        ...filteredChildFieldProps
    } = childFieldProps;

    return (
        <Form.Group grouped={ true }>
            {
                label && (
                    <div className={ `field ${ filteredChildFieldProps.required ? "required" : "" }` }>
                        <label>{ label }</label>
                    </div>
                )
            }
            <Form.Field>
                <CopyInputField
                    key={ filteredChildFieldProps.testId }
                    data-testid={ filteredChildFieldProps.testId }
                    autoFocus={ filteredChildFieldProps.autoFocus || false }
                    { ...filteredChildFieldProps }
                    value={
                        filteredChildFieldProps?.value
                            ? filteredChildFieldProps?.value
                            : (parentFormProps?.values[ filteredChildFieldProps?.name ]
                                ? parentFormProps?.values[ filteredChildFieldProps?.name ]
                                : "")
                    }
                />
            </Form.Field>
        </Form.Group>
    );
};

export const TextAreaAdapter = (props): ReactElement => {

    const { childFieldProps, input, meta, parentFormProps } = props;

    return (
        <Form.TextArea
            label={ childFieldProps.label !== "" ? childFieldProps.label : null }
            width={ input.width }
            placeholder={ input.placeholder }
            name={ input.name }
            onBlur={ (event) => input.onBlur(event) }
            onChange={ (event, data) => {
                if (childFieldProps.listen && typeof childFieldProps.listen === "function") {
                    childFieldProps.listen(data?.value);
                }

                input.onChange(data?.value);
            } }
            autoFocus={ childFieldProps.autoFocus || false }
            readOnly={ input.readOnly }
            disabled={ input.disabled }
            required={ input.required }
            onKeyPress={ (event: React.KeyboardEvent, data) => {
                event.key === ENTER_KEY && input.onBlur(data.name);
            } }
            type="textarea"
            { ...omit(childFieldProps, [ "value", "listen" ]) }
            value={ meta.modified ? input.value : (childFieldProps?.value ? childFieldProps?.value
                : (parentFormProps?.values[ childFieldProps?.name ] ? parentFormProps?.values[ childFieldProps?.name ] : "")) }
            error={
                (meta.error && meta.touched)
                    ? meta.error
                    : null
            }
        />
    );
};

/**
 * Toggle adapter.
 * @deprecated Use `CheckboxAdapter` instead.
 *
 * @param props - Props injected to the component. props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ToggleAdapter = (props): ReactElement => {

    const { childFieldProps, input, meta } = props;

    return (
        <Form.Checkbox
            label={ childFieldProps.label }
            name={ childFieldProps.name }
            children={ childFieldProps.children }
            onChange={ (event, data) => {
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

/**
 * Semantic Checkbox adapter.
 * @see {@link https://codesandbox.io/s/react-final-form-simple-example-3we74?fontsize=14&file=/index.js}
 *
 * @param {CheckboxAdapterPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const CheckboxAdapter = (props: CheckboxAdapterPropsInterface): ReactElement => {

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
        <Form.Checkbox
            { ...input }
            { ...filteredRest }
            label={ childFieldProps?.label }
            name={ childFieldProps?.name }
            onChange={ (event, { checked }) => {
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

/**
 * Semantic UI Radio Adapter.
 *
 * @param {RadioAdapterPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const RadioAdapter = (props: RadioAdapterPropsInterface): ReactElement => {

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
        <Form.Radio
            { ...input }
            { ...filteredRest }
            label={ childFieldProps?.label }
            name={ childFieldProps?.name }
            onChange={ (event: FormEvent<HTMLInputElement>, { checked }:  { checked: boolean }) => {
                if (childFieldProps?.listen && typeof childFieldProps.listen === "function") {
                    childFieldProps.listen(checked);
                }

                input.onChange({
                    target: {
                        checked,
                        type: "radio",
                        value
                    }
                });
            } }
        />
    );
};

export const SelectAdapter = (props): ReactElement => {

    const { childFieldProps, input, meta } = props;

    return (
        <Form.Select
            label={ childFieldProps.label }
            name={ childFieldProps.name }
            options={ childFieldProps.children }
            onChange={ (event: React.ChangeEvent<HTMLInputElement>, data) => {
                if (childFieldProps.listen && typeof childFieldProps.listen === "function") {
                    childFieldProps.listen(data.value.toString());
                }

                input.onChange(data.value.toString());
            } }
            onBlur={ (event: React.SyntheticEvent) => input.onBlur(event) }
            autoFocus={ childFieldProps.autoFocus || false }
            disabled={ childFieldProps.disabled }
            required={ childFieldProps.required }
            onKeyPress={ (event: React.KeyboardEvent, data) => {
                event.key === ENTER_KEY && input.onBlur(data?.name);
            } }
            control={ Select }
            { ...omit(childFieldProps, [ "value", "children" ]) }
            error={
                (meta.error && meta.touched)
                    ? meta.error
                    : null
            }
            value={ meta.modified ? input.value : (childFieldProps?.value ? childFieldProps?.value : "") }
        />
    );
};

export const ButtonAdapter = ({ childFieldProps }): ReactElement => {
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

export const QueryParamsAdapter = ({ input, childFieldProps }): ReactElement => {

    const { label, name } = childFieldProps;

    if (!label)
        throw new Error("QueryParamsAdapter: required child prop 'label'");
    if (!name)
        throw new Error("QueryParamsAdapter: required child prop 'name'");

    return (
        <QueryParameters
            label={ childFieldProps.label }
            name={ childFieldProps.name }
            value={ input.value }
            onChange={ input.onChange }
        />
    );

};

/**
 * Color Picker Adapter implemented with `react-color`.
 *
 * @param {ColorPickerAdapterPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ColorPickerAdapter = (props: ColorPickerAdapterPropsInterface): ReactElement => {

    const {
        childFieldProps,
        input: { value, ...input },
        ...rest
    } = props;

    // unused, just don't pass it along with the ...rest
    const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        editableInput,
        type,
        meta,
        hint,
        children,
        parentFormProps,
        render,
        width,
        readOnly,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...filteredRest
    } = rest;

    return (
        <Popup
            on="click"
            positionFixed
            hoverable
            className="color-picker-popup"
            trigger={ (
                <Form.Field>
                    <label>{ childFieldProps.label !== "" ? childFieldProps.label : null }</label>
                    <Input
                        className={
                            `color-picker-input ${ readOnly ? "readonly" : "" } ${ editableInput ? "editable" : "" }`
                        }
                        aria-label={ childFieldProps.ariaLabel }
                        key={ childFieldProps.testId }
                        required={ childFieldProps.required }
                        data-componentid={ childFieldProps.componentId }
                        onChange={ (event, data) => {
                            if (!editableInput) {
                                return;
                            }

                            if (childFieldProps.listen && typeof childFieldProps.listen === "function") {
                                childFieldProps.listen(data?.value);
                            }

                            input.onChange(data?.value);
                        } }
                        onBlur={ (event) => input.onBlur(event) }
                        control={ Input }
                        autoFocus={ childFieldProps.autoFocus || false }
                        value={
                            meta.modified
                                ? value
                                : (childFieldProps?.value
                                    ? childFieldProps?.value
                                    : (parentFormProps?.values[ childFieldProps?.name ]
                                        ? parentFormProps?.values[ childFieldProps?.name ]
                                        : ""))
                        }
                        { ...omit(childFieldProps, [ "value", "listen", "label" ]) }
                        type="text"
                        error={
                            (meta.error && meta.touched)
                                ? meta.error
                                : null
                        }
                    >
                        <div className="color-swatch">
                            <div className="color-swatch-inner" style={ { background: value } } />
                        </div>
                        <input readOnly={ !editableInput } />
                    </Input>
                </Form.Field>
            ) }
            disabled={ readOnly }
            content={ (
                <ColorPicker
                    show
                    popup
                    color={ value }
                    onChangeComplete={ (color: ColorPickerResponseInterface) => {

                        // Workaround for https://github.com/casesandberg/react-color/issues/655
                        // TODO: Remove once the issue is resolved on the lib.
                        const a = Math.round(color.rgb.a * 255);

                        const moderatedHex: string = color.hex + (
                            a === 255
                                ? ""
                                : Math.floor(a / 16).toString(16) + (a % 16).toString(16)
                        );

                        if (childFieldProps.listen && typeof childFieldProps.listen === "function") {
                            childFieldProps.listen(moderatedHex);
                        }

                        input.onChange(moderatedHex);
                    } }
                    { ...filteredRest }
                />
            ) }
        />
    );
};
