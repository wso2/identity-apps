/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, { AutocompleteProps, AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import { FormControlProps } from "@oxygen-ui/react/FormControl";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import InputLabel, { InputLabelProps } from "@oxygen-ui/react/InputLabel";
import TextField, { TextFieldProps } from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { FieldRenderProps } from "react-final-form";

/**
 * Props interface of {@link AutocompleteFieldAdapter}
 */
export interface AutocompleteFieldAdapterPropsInterface
    extends FieldRenderProps<string, HTMLElement, string>,
        AutocompleteProps<unknown>,
        IdentifiableComponentInterface {
    /**
     * Form control props.
     */
    FormControlProps?: FormControlProps;
    /**
     * Props for the input element.
     */
    InputProps?: TextFieldProps;
    /**
     * Props for the input label.
     */
    InputLabelProps?: InputLabelProps;
    /**
     * Alias for `multiple` prop from `AutocompleteProps` since it's a reserved keyword in React Final Form.
     */
    multipleValues?: boolean;
}

/**
 * A custom Autocomplete field adapter for the React Final Form library.
 * This adapter wraps a `@oxygen-ui/react` Autocomplete component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered Select component.
 */
const AutocompleteFieldAdapter: FunctionComponent<AutocompleteFieldAdapterPropsInterface> = (
    props: AutocompleteFieldAdapterPropsInterface
): ReactElement => {
    const {
        input,
        meta,
        FormControlProps = {},
        InputProps = {},
        InputLabelProps = {},
        placeholder,
        options,
        fullWidth,
        required,
        helperText,
        label,
        multipleValues,
        ...rest
    } = props;

    const [ value, setValue ] = useState<unknown>(multipleValues ? [] : undefined);

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    return (
        <>
            <Autocomplete
                { ...input }
                disablePortal
                size="small"
                multiple={ multipleValues }
                value={ value }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <>
                        <InputLabel
                            disableAnimation
                            error={ isError }
                            htmlFor={ InputProps?.id ?? `${input.name}-input` }
                            shrink={ false }
                            required={ required }
                            { ...InputLabelProps }
                        >
                            { label }
                        </InputLabel>
                        { /* `autocomplete`, `capture`, etc. are not part of TextField API */ }
                        { /* TODO: Tracker: https://github.com/wso2/oxygen-ui/issues/292 */ }
                        { /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */ }
                        { /* @ts-ignore */ }
                        <TextField
                            { ...params }
                            id={ `${input.name}-input` }
                            margin="dense"
                            placeholder={ placeholder }
                            required={ required }
                            error={ isError }
                            size="small"
                            variant="outlined"
                            fullWidth={ fullWidth }
                            { ...InputProps }
                            { ...FormControlProps }
                        />
                        { isError && <FormHelperText error>{ meta.error || meta.submitError }</FormHelperText> }
                    </>
                ) }
                onChange={ (_: SyntheticEvent, value: any) => {
                    input.onChange(value);
                    setValue(value);
                } }
                options={ options }
                { ...rest }
            />
            <FormHelperText id={ `${input.name}-helper-text` }>{ helperText }</FormHelperText>
        </>
    );
};

AutocompleteFieldAdapter.defaultProps = {
    fullWidth: true
};

export default AutocompleteFieldAdapter;
