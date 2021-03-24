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

import { CopyInputField, Password } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { Form } from "semantic-ui-react";

/**
 * The enter key.
 * @constant
 * @type {string}
 */
const ENTER_KEY = "Enter";

export const TextFieldAdapter = ({ input, label, meta, testId, required, ariaLabel, ...rest }): ReactElement => (
    <Form.Input
        { ...rest }
        { ...input }
        aria-label={ ariaLabel }
        key={ testId }
        required={ required }
        data-testid={ testId }
        label={ label !== "" ? label : null }
        onKeyPress={ (event: React.KeyboardEvent, data) => {
            event.key === ENTER_KEY && input.onBlur(data?.name);
        } }
        onChange={ (event, data) => input.onChange(data?.value) }
        onBlur={ (event) => input.onBlur(event) }
        error={ meta?.touched && meta?.error !== "" ? meta?.error : null }
    />
);

export const PasswordFieldAdapter = ({ input, label, meta, testId, required, ...rest }): ReactElement => (
    <Password
        { ...rest }
        { ...input }
        key={ testId }
        data-testid={ testId }
        hidePassword="Hide password"
        label={ label !== "" ? label : null }
        name="newPassword"
        required={ true }
        showPassword="Show password"
        onKeyPress={ (event: React.KeyboardEvent, data) => {
            event.key === ENTER_KEY && input.onBlur(data?.name);
        } }
        onChange={ (event, data) => input.onChange(data?.value) }
        onBlur={ (event) => input.onBlur(event) }
        error={ meta?.touched && meta?.error !== "" ? meta?.error : null }
    />
);

export const CopyFieldAdapter = ({ input, label, meta, testId, required, ...rest }): ReactElement => (
    <CopyInputField
        { ...rest }
        { ...input }
        key={ testId }
        data-testid={ testId }
    />
);

export const TextAreaAdapter = ({ input, label, meta, testId, required, ...rest }): ReactElement => (
    <Form.TextArea
        { ...rest }
        { ...input }
        label={ label !== "" ? label : null }
        width={ input.width }
        error={ meta.touched && meta.error !== "" ? meta.error : null }
        placeholder={ input.placeholder }
        name={ input.name }
        onBlur={ (event) => input.onBlur(event) }
        onChange={ (event, data) => input.onChange(data.value) }
        autoFocus={ input.autoFocus || false }
        readOnly={ input.readOnly }
        disabled={ input.disabled }
        required={ input.label ? input.required : false }
        onKeyPress={ (event: React.KeyboardEvent, data) => {
            event.key === ENTER_KEY && input.onBlur(data.name);
        } }
    />
);

export const ToggleAdapter = ({ input, label, meta, testId, required, ...rest }): ReactElement => (
    <Form.Checkbox
        { ...rest }
        { ...input }
        label={ input.label }
        name={ input.name }
        value={ input.value }
        onChange={ (event, data) => {
            input.onToggle(data.name);
        } }
        onBlur={ (event) => input.onBlur(event) }
        autoFocus={ input.autoFocus || false }
        readOnly={ input.readOnly }
        disabled={ input.disabled }
        defaultChecked={ input.defaultChecked }
        onKeyPress={ (event: React.KeyboardEvent, data) => {
            event.key === ENTER_KEY && input.onBlur(data.name);
        } }
    />
);
