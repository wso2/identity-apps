/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DatePicker from "@oxygen-ui/react/DatePicker";
import { FormControlProps } from "@oxygen-ui/react/FormControl";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import TextField from "@oxygen-ui/react/TextField";
import moment from "moment";
import React, { FunctionComponent, ReactElement } from "react";
import { FieldRenderProps } from "react-final-form";

/**
 * Props for the DatePickerFieldAdapter component.
 */
export interface DatePickerFieldAdapterPropsInterface extends FieldRenderProps<string, HTMLElement, string> {
    /**
     * The label to display above the TextField.
     */
    label: string;
    /**
     * Whether the TextField should take full width.
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
    /**
     * The date format to use.
     * Value will be displayed in this format in the input field.
     * Input value will also be parsed in this format.
     * Defaults to "YYYY-MM-DD".
     */
    dateFormat?: string;
    /**
     * Props to be passed to the DatePicker's slots.
     */
    slotProps?: object;
}

/**
 * A custom DatePicker adapter for use with React Final Form.
 * This adapter wraps a Material-UI DatePicker component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered DatePicker component.
 */
const DatePickerFieldAdapter: FunctionComponent<DatePickerFieldAdapterPropsInterface> = (
    props: DatePickerFieldAdapterPropsInterface
): ReactElement => {
    const {
        input,
        label,
        placeholder,
        meta,
        helperText,
        required,
        readOnly,
        fullWidth = true,
        dateFormat = "YYYY-MM-DD",
        isClearable = false,
        slotProps = {},
        ...rest
    } = props;

    // Parse the input value to a moment object.
    const formattedValue: moment.Moment = moment(input.value, dateFormat);

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    return (
        <>
            <LocalizationProvider dateAdapter={ AdapterMoment }>
                <DatePicker
                    slots={ { textField: TextField } }
                    slotProps={ {
                        field:{
                            clearable: isClearable,
                            onClear: () => input.onChange("")
                        },
                        textField: {
                            InputLabelProps: {
                                required
                            },
                            error: isError,
                            fullWidth: fullWidth,
                            margin: "dense",
                            placeholder: placeholder,
                            variant: "outlined"
                        },
                        ...slotProps
                    } }
                    label={ label }
                    { ...input }
                    value={ formattedValue.isValid() ? formattedValue : null }
                    onChange={ (date: any) => {
                        if (date && moment.isMoment(date) && date.isValid()) {
                            input.onChange(date.format(dateFormat));
                        } else {
                            input.onChange("");
                        }
                    } }
                    { ...rest as any }
                    format={ dateFormat }
                    readOnly={ readOnly }
                />
            </LocalizationProvider>
            { isError && <FormHelperText error>{ meta.error || meta.submitError }</FormHelperText> }
            { helperText && <FormHelperText>{ helperText }</FormHelperText> }
        </>
    );
};

export default DatePickerFieldAdapter;
