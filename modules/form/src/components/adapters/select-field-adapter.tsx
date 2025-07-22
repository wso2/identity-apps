/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import InputLabel from "@oxygen-ui/react/InputLabel";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectProps } from "@oxygen-ui/react/Select";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { FieldRenderProps } from "react-final-form";

import "./select-field-adapter.scss";

/**
 * Interface for the items passed as options.
 */
interface DropDownItemInterface {
    text: ReactNode;
    value: string;
}

/**
 * Props for the SelectFieldAdapter component.
 */
export interface SelectFieldAdapterPropsInterface
    extends FieldRenderProps<string | string[], HTMLElement, string | string>, IdentifiableComponentInterface {
    /**
     * The label to display above the Select Field.
     */
    label: string;
    /**
     * Options list for the Select Field.
     * @see DropDownItemInterface
     */
    options: DropDownItemInterface[];
    /**
     * Whether the TextField should take full width.
     * Defaults to true.
     */
    fullWidth?: boolean;
    /**
     * Form control props.
     */
    FormControlProps?: FormControlProps;
    /**
     * Whether to show the clear button.
     * Defaults to false.
     */
    isClearable?: boolean;
}

/**
 * A custom SelectField adapter for use with React Final Form.
 * This adapter wraps a Oxygen-UI Select component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered SelectField component.
 */
const SelectFieldAdapter: FunctionComponent<SelectFieldAdapterPropsInterface> = (
    props: SelectFieldAdapterPropsInterface
): ReactElement => {
    const {
        input,
        label,
        meta,
        fullWidth = true,
        FormControlProps = {},
        placeholder,
        helperText,
        required,
        options,
        isClearable = false,
        readOnly = false,
        "data-componentid": componentId = "select-field-adapter",
        ...rest
    } = props;

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    /**
     * Clears the input value.
     */
    const onValueClear = () => {
        input.onChange(input.multiple ? [] : "");
    };

    // Prepare the field value when the input value is empty.
    const fieldValue: string | string[] = isEmpty(input.value) ? (input.multiple ? [] : "") : input.value;
    // Clear button should be hidden when the field value is empty.
    const showClearButton: boolean = isClearable && !isEmpty(fieldValue);

    return (
        <div className="select-field-adapter" data-componentid={ componentId }>
            <InputLabel required={ required }>{ label }</InputLabel>
            <FormControl
                error={ isError }
                size="small"
                variant="outlined"
                margin="dense"
                fullWidth={ fullWidth }
                disabled={ readOnly }
                { ...FormControlProps }
            >
                <InputLabel shrink={ false } data-componentid={ `${componentId}-placeholder` } disabled>
                    { isEmpty(input.value) ? placeholder : "" }
                </InputLabel>
                <Select
                    { ...input }
                    value={ fieldValue }
                    margin="dense"
                    endAdornment={
                        showClearButton && (
                            <InputAdornment className="end-adornment" position="end">
                                <IconButton onClick={ () => onValueClear() }>
                                    <XMarkIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                    data-componentid={ `${componentId}-input` }
                    { ...(rest as SelectProps) }
                >
                    { options?.map((option: DropDownItemInterface, index: number) => (
                        <MenuItem
                            data-componentid={ `${componentId}-input-${index}` }
                            key={ option.value }
                            value={ option.value }
                        >
                            { option.text }
                        </MenuItem>
                    )) }
                </Select>
                { isError && (
                    <FormHelperText data-componentid={ `${componentId}-error` } error>
                        { meta.error || meta.submitError }
                    </FormHelperText>
                ) }
                { helperText && (
                    <FormHelperText data-componentid={ `${componentId}-helper-text` }>{ helperText }</FormHelperText>
                ) }
            </FormControl>
        </div>
    );
};

export default SelectFieldAdapter;
