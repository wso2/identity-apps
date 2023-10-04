/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TextFieldProps as OuiTextFieldProps } from "@oxygen-ui/react/TextField";
import classNames from "classnames";
import React, { FC, cloneElement } from "react";
import FieldInput from "./field-input";
import { FieldButton } from "./field-button";
import { FieldCheckbox } from "./field-checkbox";

export type DynamicFieldProps = Partial<Omit<OuiTextFieldProps, "type" | "onChange">> & {
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
