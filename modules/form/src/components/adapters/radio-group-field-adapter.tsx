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

import FormControl, { FormControlProps } from "@oxygen-ui/react/FormControl";
import FormControlLabel, { FormControlLabelProps } from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import FormLabel, { FormLabelProps } from "@oxygen-ui/react/FormLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { FieldRenderProps } from "react-final-form";

/**
 * Interface for the DropDownItem.
 */
export type RadioGroupOptionProps = FormControlLabelProps & IdentifiableComponentInterface;

/**
 * Props interface of {@link SelectFieldAdapter}
 */
export interface RadioGroupFieldAdapterPropsInterface extends FieldRenderProps<string, HTMLElement, string>,
    IdentifiableComponentInterface {
    /**
     * Radio group options.
     */
    options: RadioGroupOptionProps[];
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
const RadioGroupFieldAdapter: FunctionComponent<RadioGroupFieldAdapterPropsInterface> = (
    {
        input,
        name,
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
    }: RadioGroupFieldAdapterPropsInterface
): ReactElement => {

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    return (
        <FormControl
            required={ required }
            error={ isError }
            size="small"
            variant="outlined"
            fullWidth={ fullWidth }
            { ...formControlProps }
            { ...rest }
        >
            <FormLabel id={ `${ name }-radio-buttons-group` } { ...formLabelProps }>{ label }</FormLabel>
            <RadioGroup
                aria-labelledby={ `${ name }-radio-buttons-group` }
                { ...input }
            >
                { options.map((option: RadioGroupOptionProps, index: number) => {
                    const { label, value, ...restRadioGroupOptionProps } = option;

                    return (
                        <FormControlLabel
                            key={ `option-${ index }` }
                            value={ value }
                            label={ label }
                            control={ <Radio /> }
                            { ...restRadioGroupOptionProps }
                        />
                    );
                }) }
            </RadioGroup>
            { isError && <FormHelperText error>{ meta.error || meta.submitError }</FormHelperText> }
            { helperText && <FormHelperText>{ helperText }</FormHelperText> }
        </FormControl>
    );
};

export default RadioGroupFieldAdapter;
