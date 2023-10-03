/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import classNames from "classnames";
import React, { FC, PropsWithChildren, ReactElement, cloneElement } from "react";
import { FieldProps } from "react-final-form";
import { FieldButton } from "./field-button";
import { FieldInput } from "./field-input";
import { FieldCheckbox } from "./field-checkbox";

export interface FormFieldPropsInterface extends FieldProps<any, any, any> {

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
    CheckBox: typeof FieldCheckbox;
}

/**
 * Implementation of the Form Field component.
 * @param props - Props injected to the component.
 * @returns Field component.
 */
export const Field: FieldType = (props: PropsWithChildren<FormFieldPropsInterface>): ReactElement => {
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

Field.Input = FieldInput;
Field.Button = FieldButton;
Field.CheckBox = FieldCheckbox;
