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

import { FormControlProps } from "@oxygen-ui/react/FormControl";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import TextField from "@oxygen-ui/react/TextField";
import React, { FunctionComponent, ReactElement } from "react";
import { FieldRenderProps } from "react-final-form";
import "./text-field-adapter.scss";

/**
 * Props for the TextFieldAdapter component.
 */
export interface TextFieldAdapterPropsInterface extends FieldRenderProps<string, HTMLElement, string> {
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
}

/**
 * A custom TextField adapter for use with React Final Form.
 * This adapter wraps a Material-UI TextField component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered TextField component.
 */
const TextFieldAdapter: FunctionComponent<TextFieldAdapterPropsInterface> = (
    props: TextFieldAdapterPropsInterface
): ReactElement => {
    const {
        input,
        meta,
        fullWidth = true,
        FormControlProps = {},
        helperText,
        required,
        readOnly,
        endAdornment,
        ...rest
    } = props;

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    return (
        <>
            <TextField
                className="text-field-adapter"
                fullWidth={ fullWidth }
                variant="outlined"
                error={ isError }
                margin="dense"
                { ...FormControlProps }
                { ...input }
                // TODO: Remove this once the `required` prop is supported by the Oxygen UI TextField component.
                InputLabelProps={ {
                    required
                } }
                InputProps={ {
                    endAdornment,
                    readOnly
                } }
                { ...rest }
            />
            { isError && <FormHelperText error>{ meta.error || meta.submitError }</FormHelperText> }
            { helperText && <FormHelperText>{ helperText }</FormHelperText> }
        </>
    );
};

export default TextFieldAdapter;
