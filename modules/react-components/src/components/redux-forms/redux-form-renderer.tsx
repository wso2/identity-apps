/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React from "react";
import { Form } from "semantic-ui-react";

const createRenderer = render => (props) => {
    const {
        input,
        type,
        label,
        placeholder,
        fieldClass,
        meta,
        selectOptions,
        checkboxLabel,
        componentClass,
        disabled,
        onLabel,
        offLabel,
        children,
        fieldOptions,
        ...rest
    } = props;

    return render(
        input, label, fieldClass, placeholder, type, selectOptions, meta, checkboxLabel,
        componentClass, disabled, onLabel, offLabel, children, fieldOptions, rest
    );
};

createRenderer.defaultProps = {
    checkboxLabel: null,
    componentClass: null,
    disabled: false,
    fieldClass: null,
    label: null,
    meta: {},
    offLabel: null,
    onLabel: null,
    placeholder: null,
    required: false,
    selectOptions: []
};

export const RenderInput = createRenderer(
    (
        input, label, fieldClass, placeholder, type, selectOptions, meta, checkboxLabel,
        componentClass, disabled, onLabel, offLabel, children, fieldOptions, rest
    ) => {
        return (
            <Form.Input
                { ...input }
                className={ fieldClass }
                placeholder={ placeholder }
                type={ type }
                disabled={ disabled }
                label={ label }
                error={
                    meta.touched && ((meta.error && (
                        {
                            content: meta.error,
                            pointing: "above"
                        }
                    )) || (meta.warning
                        && (
                            {
                                content: meta.warning,
                                pointing: "above"
                            }
                        )))
                }
                { ...rest }
            />
        );
    }
);

export const RenderToggle = createRenderer(
    (
        input, label, fieldClass, placeholder, type, selectOptions, meta, checkboxLabel,
        componentClass, disabled, onLabel, offLabel, children, fieldOptions, rest
    ) => {
        const { value, onChange, ...inputRest } = input;

        return (
            <Form.Checkbox
                { ...inputRest }
                className={ fieldClass }
                placeholder={ placeholder }
                checked={ !!value }
                onClick={ (event, data) => onChange(data.checked) }
                label={ label }
                error={
                    meta.touched && ((meta.error && (
                        {
                            content: meta.error,
                            pointing: "left"
                        }
                    )) || (meta.warning
                        && (
                            {
                                content: meta.warning,
                                pointing: "left"
                            }
                        )))
                }
                toggle
                { ...rest }
            />
        );
    }
);

export const RenderCheckBox = createRenderer(
    (
        input, label, fieldClass, placeholder, type, selectOptions, meta, checkboxLabel,
        componentClass, disabled, onLabel, offLabel, children, fieldOptions, rest
    ) => {
        const { value, onChange, ...inputRest } = input;

        return (
            <Form.Checkbox
                { ...inputRest }
                className={ fieldClass }
                componentClass={ componentClass }
                placeholder={ placeholder }
                checked={ !!value }
                onClick={ (event, data) => onChange(data.checked) }
                label={ label }
                error={
                    meta.touched && ((meta.error && (
                        {
                            content: meta.error,
                            pointing: "left"
                        }
                    )) || (meta.warning
                        && (
                            {
                                content: meta.warning,
                                pointing: "left"
                            }
                        )))
                }
                { ...rest }
            />
        );
    }
);
