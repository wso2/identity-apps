/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectProps } from "@oxygen-ui/react/Select";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, ReactNode } from "react";
import { FieldRenderProps } from "react-final-form";

/**
 * Interface for the DropDownItem.
 */
export interface DropDownItemInterface {
    text: ReactNode;
    value: string;
}

/**
 * Props interface of {@link __DEPRECATED__SelectFieldAdapter}
 */
export interface __DEPRECATED__SelectFieldAdapterPropsInterface
    extends FieldRenderProps<string, HTMLElement, string>,
        Omit<SelectProps, "input">,
        IdentifiableComponentInterface {
    /**
     * Form control props.
     */
    FormControlProps?: FormControlProps;
}

/**
 * A custom Select field adapter for the React Final Form library.
 * This adapter wraps a Material-UI Select component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered Select component.
 */
const __DEPRECATED__SelectFieldAdapter: FunctionComponent<__DEPRECATED__SelectFieldAdapterPropsInterface> = (
    props: __DEPRECATED__SelectFieldAdapterPropsInterface
): ReactElement => {
    const {
        input,
        name,
        meta,
        label,
        FormControlProps = {},
        placeholder,
        options,
        fullWidth,
        required,
        helperText,
        onChange,
        ...rest
    } = props;

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    return (
        <FormControl
            required={ required }
            error={ isError }
            size="small"
            variant="outlined"
            fullWidth={ fullWidth }
            { ...FormControlProps }
        >
            <Select
                { ...input }
                name={ name }
                value={ input.value || "" }
                onChange={ (e: ChangeEvent, child: ReactNode) => {
                    input.onChange((e?.target as any)?.value as string);
                    onChange && onChange(e as any, child);
                } }
                margin="dense"
                label={ label }
                // Need any to avoid 'children' does not exist on type 'IntrinsicAttributes & SelectProps' error.
                { ...rest as (SelectProps & any) }
            >
                <MenuItem value="" disabled>
                    { placeholder }
                </MenuItem>
                { options?.map((option: DropDownItemInterface) => (
                    <MenuItem key={ option.value } value={ option.value }>
                        { option.text }
                    </MenuItem>
                )) }
            </Select>
            <FormHelperText id={ `${input.name}-helper-text` }>
                { helperText }
            </FormHelperText>
        </FormControl>
    );
};

__DEPRECATED__SelectFieldAdapter.defaultProps = {
    fullWidth: true
};

export default __DEPRECATED__SelectFieldAdapter;
