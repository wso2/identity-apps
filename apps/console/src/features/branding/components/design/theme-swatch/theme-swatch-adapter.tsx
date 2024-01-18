/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { RadioAdapterPropsInterface } from "@wso2is/form";
import React, { FormEvent, FunctionComponent, ReactElement, useState } from "react";
import { Form } from "semantic-ui-react";
import { ThemeSwatch } from "./theme-swatch";

/**
 * Proptypes for the Theme Swatch Radio Adapter component.
 */
type ThemeSwatchAdapterInterface = RadioAdapterPropsInterface;

/**
 * Semantic UI Radio Adapter.
 *
 * @param props - Props injected to the component.
 * @returns Theme Swatch Radio Adapter.
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

    const toggleRadioState = (checked: boolean = isChecked): void => {

        if (childFieldProps?.readOnly) {
            return;
        }

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
                onChange={ (_: FormEvent<HTMLInputElement>, { checked }:  { checked: boolean }) => {
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
