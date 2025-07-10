/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControl, { FormControlProps } from "@oxygen-ui/react/FormControl";
import FormControlLabel, { FormControlLabelProps } from "@oxygen-ui/react/FormControlLabel";
import FormGroup from "@oxygen-ui/react/FormGroup";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import FormLabel, { FormLabelProps } from "@oxygen-ui/react/FormLabel";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { FieldRenderProps } from "react-final-form";

/**
 * Interface for the DropDownItem.
 */
export type CheckboxGroupOptionProps = FormControlLabelProps & IdentifiableComponentInterface;

/**
 * Props interface of {@link CheckboxGroupFieldAdapter}
 */
export interface CheckboxGroupFieldAdapterPropsInterface extends FieldRenderProps<string[], HTMLElement, string[]>,
    IdentifiableComponentInterface {
    /**
     * Radio group options.
     */
    options: CheckboxGroupOptionProps[];
    /**
     * Form control props.
     */
    formControlProps?: FormControlProps;
    /**
     * Form label props.
     */
    formLabelProps?: FormLabelProps;
}

/**
 * A custom Radio Group field adapter for the React Final Form library.
 * This adapter wraps a Material-UI RadioGroup component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered RadioGroup component.
 */
const CheckboxGroupFieldAdapter: FunctionComponent<CheckboxGroupFieldAdapterPropsInterface> = (
    {
        input: { value = [], onChange, onBlur, onFocus, name },
        meta,
        label,
        formControlProps = {},
        formLabelProps = {
            focused: false
        },
        options,
        fullWidth = true,
        required,
        helperText,
        ...rest
    }: CheckboxGroupFieldAdapterPropsInterface
): ReactElement => {

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    const toggle = (optValue: string, checked: boolean) => {
        if (checked) {
            onChange([ ...value, optValue ]);
        } else {
            onChange(value.filter((v: string) => v !== optValue));
        }
    };

    return (
        <FormControl
            required={ required }
            error={ isError }
            size="small"
            variant="standard"
            component="fieldset"
            fullWidth={ fullWidth }
            { ...formControlProps }
            { ...rest }
        >
            <FormLabel id={ `${ name }-checkbox-group` } { ...formLabelProps }>{ label }</FormLabel>
            <FormGroup
                aria-labelledby={ `${ name }-checkbox-group` }
            >
                { options.map((option: CheckboxGroupOptionProps, index: number) => {
                    const { label: optionLabel, value: optionValue, ...restCheckboxGroupOptionProps } = option;
                    const checked: boolean = (value as string[])?.includes(optionValue as string);

                    return (
                        <FormControlLabel
                            key={ `option-${ index }` }
                            label={ optionLabel }
                            control={ (
                                <Checkbox
                                    checked={ checked }
                                    onChange={
                                        (e: React.ChangeEvent<HTMLInputElement>) =>
                                            toggle(optionValue as string, e.target.checked)
                                    }
                                    onBlur={ onBlur }
                                    onFocus={ onFocus }
                                    name={ name }
                                />
                            ) }
                            { ...restCheckboxGroupOptionProps }
                        />
                    );
                }) }
            </FormGroup>
            { isError && <FormHelperText error>{ meta.error || meta.submitError }</FormHelperText> }
            { helperText && <FormHelperText>{ helperText }</FormHelperText> }
        </FormControl>
    );
};

export default CheckboxGroupFieldAdapter;
