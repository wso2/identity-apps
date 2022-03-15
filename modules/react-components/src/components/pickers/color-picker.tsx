/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * @param {ColorPickerPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
