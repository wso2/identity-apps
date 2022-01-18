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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FC, ReactElement, cloneElement } from "react";
import { FieldProps } from "react-final-form";
import { FieldButton } from "./field-button";
import { FieldCheckbox } from "./field-checkbox";
import { FieldCheckboxLegacy } from "./field-checkbox-legacy";
import { FieldColorPicker } from "./field-color-picker";
import { FieldDropdown } from "./field-dropdown";
import { FieldInput } from "./field-input";
import { FieldQueryParams } from "./field-query-params";
import { FieldTextarea } from "./field-textarea";

export interface FormFieldPropsInterface extends FieldProps<any, any, any>, TestableComponentInterface,
    IdentifiableComponentInterface {

    /**
     * Aria label for the field.
     */
    ariaLabel: string;
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Custom styles object
     */
    style?: Record<string, unknown>;
}

type FieldType = FC<FormFieldPropsInterface> & {
    Input: typeof FieldInput;
    Button: typeof FieldButton;
    CheckboxLegacy: typeof FieldCheckboxLegacy;
    Textarea: typeof FieldTextarea;
    Checkbox: typeof FieldCheckbox;
    Dropdown: typeof FieldDropdown;
    QueryParams: typeof FieldQueryParams;
    ColorPicker: typeof FieldColorPicker;
}

/**
 * Implementation of the Form Field component.
 * @param props
 */
export const Field: FieldType = (props: FormFieldPropsInterface): ReactElement => {
    const {
        children,
        className,
        style
    } = props;

    const classes = classNames(
        "fields",
        className
    );

    const childNodes = React.Children.toArray(children);

    return (
        <div className={ classes } style={ style }>
            {
                childNodes.map((child: any) => {
                    if (!child) {
                        return null;
                    }

                    const childProps = {
                        ...child.props
                    };

                    return cloneElement(child, childProps);
                })
            }
        </div>
    );
};

Field.Input = FieldInput;
Field.Button = FieldButton;
Field.Textarea = FieldTextarea;
Field.CheckboxLegacy = FieldCheckboxLegacy;
Field.Checkbox = FieldCheckbox;
Field.Dropdown = FieldDropdown;
Field.QueryParams = FieldQueryParams;
Field.ColorPicker = FieldColorPicker;
