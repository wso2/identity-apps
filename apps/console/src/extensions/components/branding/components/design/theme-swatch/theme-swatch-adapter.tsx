/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { RadioAdapterPropsInterface } from "@wso2is/form";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Form } from "semantic-ui-react";
import { ThemeSwatch } from "./theme-swatch";

/**
 * Proptypes for the Theme Swatch Radio Adapter component.
 */
type ThemeSwatchAdapterInterface = RadioAdapterPropsInterface;

/**
 * Semantic UI Radio Adapter.
 *
 * @param {ThemeSwatchAdapterInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ThemeSwatchAdapter: FunctionComponent<ThemeSwatchAdapterInterface> = (
    props: RadioAdapterPropsInterface
): ReactElement => {

    const [ isChecked, setIsChecked ] = useState(false);

    const {
        childFieldProps,
        input: { value, ...input },
        colors,
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

    const toggleRadioState = (checked = isChecked) => {

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

        setIsChecked(!isChecked);
    };

    return (
        <ThemeSwatch
            active={ input.checked }
            colors={ colors }
            onClick={ () => toggleRadioState() }
        >
            <Form.Radio
                { ...input }
                { ...filteredRest }
                label={ childFieldProps?.label }
                name={ childFieldProps?.name }
                onChange={ (_, { checked }:  { checked: boolean }) => {
                    toggleRadioState(checked);
                } }
            />
        </ThemeSwatch>
    );
};

/**
 * Default props for the component.
 */
ThemeSwatchAdapter.defaultProps = {
    "data-componentid": "theme-swatch-adapter"
};
