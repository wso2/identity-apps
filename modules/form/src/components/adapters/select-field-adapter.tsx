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
import InputLabel from "@oxygen-ui/react/InputLabel";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectProps } from "@oxygen-ui/react/Select";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { FieldRenderProps } from "react-final-form";

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
    extends FieldRenderProps<string | string[], HTMLElement, string | string> {
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
        ...rest
    } = props;

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    return (
        <div>
            <InputLabel required={ required }>{ label }</InputLabel>
            <FormControl
                error={ isError }
                size="small"
                variant="outlined"
                margin="dense"
                fullWidth={ fullWidth }
                { ...FormControlProps }
            >
                <InputLabel shrink={ false } disabled>
                    { isEmpty(input.value) ? placeholder : "" }
                </InputLabel>
                <Select
                    { ...input }
                    margin="dense"
                    { ...rest as SelectProps }
                >
                    { options?.map((option: DropDownItemInterface) => (
                        <MenuItem key={ option.value } value={ option.value }>
                            { option.text }
                        </MenuItem>
                    )) }
                </Select>
                { isError && <FormHelperText error>{ meta.error || meta.submitError }</FormHelperText> }
                { helperText && <FormHelperText>{ helperText }</FormHelperText> }
            </FormControl>
        </div>
    );
};

export default SelectFieldAdapter;
