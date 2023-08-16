/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
