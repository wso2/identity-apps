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

import { TextFieldProps as OuiTextFieldProps } from "@oxygen-ui/react/TextField";
import classNames from "classnames";
import React, { FC, cloneElement } from "react";
import { FieldButton } from "./field-button";
import { FieldCheckbox } from "./field-checkbox";
import FieldInput from "./field-input";

export type DynamicFieldProps = Partial<Omit<OuiTextFieldProps, "type" | "onChange" | "component">> & {
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
    /**
     * Index of the dynamic field.
     */
    index?: number;
};

type DynamicFieldType = FC<DynamicFieldProps> & {
    Input: typeof FieldInput;
    Button: typeof FieldButton;
    CheckBox: typeof FieldCheckbox;
}

export const DynamicField: DynamicFieldType = (props: DynamicFieldProps) => {
    const {
        children,
        className,
        style
    } = props;

    const classes: string = classNames(
        "fields",
        className
    );

    const childNodes: (string | number | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | React.ReactFragment | React.ReactPortal)[] = React.Children.toArray(children);

    return (
        <div className={ classes } style={ style }>
            {
                childNodes.map((child: any) => {
                    if (!child) {
                        return null;
                    }

                    const childProps: any = {
                        ...child.props
                    };

                    return cloneElement(child, childProps);
                })
            }
        </div>
    );
};

DynamicField.Input = FieldInput;
DynamicField.Button = FieldButton;
DynamicField.CheckBox = FieldCheckbox;
