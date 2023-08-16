/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { ColorPickerProps, ColorResult, SketchPicker } from "react-color";
import { SketchPickerProps } from "react-color/lib/components/sketch/Sketch";

/**
 * Color Picker component Prop types.
 */
export interface ColorPickerPropsInterface extends ColorPickerProps<SketchPickerProps | any>,
    IdentifiableComponentInterface {

    /**
     * Additional CSS Classes
     */
    className?: string;
    /**
     * Picker component supported by `react-color`. Default is `SketchPicker`.
     */
    picker?: React.ComponentType<SketchPickerProps | any> | undefined;
    /**
     * Is rendered in a Popup.
     */
    popup?: boolean;
    /**
     * Show/Hide picker.
     */
    show?: boolean;
}

export type ColorPickerResponseInterface = ColorResult;

/**
 * Color Picker Component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the color picker React component.
 */
export const ColorPicker: FunctionComponent<PropsWithChildren<ColorPickerPropsInterface>> = (
    props: PropsWithChildren<ColorPickerPropsInterface>
): ReactElement => {

    const {
        className,
        ["data-componentid"]: componentId,
        picker: Picker,
        show: controlledShow,
        popup,
        ...rest
    } = props;

    const [ show, setShow ] = useState(controlledShow);

    /**
     * Sets the internal state based on the externally controlled visibility toggle.
     */
    useEffect(() => {

        setShow(controlledShow);
    }, [ controlledShow ]);

    const classes = classNames(
        "color-picker",
        { popup },
        className
    );

    return (
        show
            ? (
                <Picker
                    data-componentid={ componentId }
                    className={ classes }
                    { ...rest }
                />
            )
            : null
    );
};

/**
 * Default props for the component.
 */
ColorPicker.defaultProps = {
    "data-componentid": "color-picker",
    picker: SketchPicker
};
