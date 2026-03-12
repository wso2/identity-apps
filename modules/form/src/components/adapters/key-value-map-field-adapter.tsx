/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { FieldRenderProps } from "react-final-form";
import { KeyValueMapField, KeyValueMapValueFieldTypes } from "../field-key-value-map";

/**
 * Props for the KeyValueMapAdapter component.
 */
export interface KeyValueMapAdapterPropsInterface
    extends FieldRenderProps<Record<string, string>, HTMLElement>,
        IdentifiableComponentInterface {
    /**
     * The label to display above the field.
     */
    label: string;
    /**
     * Whether the field should take full width.
     */
    fullWidth?: boolean;
    /**
     * Form control props.
     */
    FormControlProps?: FormControlProps;
    /**
     * Helper text to display below the field.
     */
    helperText?: string;
    /**
     * Name of the key column.
     */
    keyName?: string;
    /**
     * Options for the key dropdown.
     */
    keyOptions?: { text: ReactNode; value: string }[];
    /**
     * Placeholder text.
     */
    placeholder?: string;
    /**
     * Whether the field is read only.
     */
    readOnly?: boolean;
    /**
     * Whether the field is required.
     */
    required?: boolean;
    /**
     * Value field type.
     */
    valuetype?: KeyValueMapValueFieldTypes;
    /**
     * Aria label for accessibility.
     */
    "aria-label"?: string;
}

/**
 * A custom KeyValueMap adapter for use with React Final Form.
 * This adapter wraps the KeyValueMapField component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered KeyValueMapField component.
 */
const KeyValueMapAdapter: FunctionComponent<KeyValueMapAdapterPropsInterface> = (
    props: KeyValueMapAdapterPropsInterface
): ReactElement => {
    const {
        input,
        meta,
        fullWidth = true,
        FormControlProps = {},
        label,
        placeholder,
        readOnly,
        required,
        helperText,
        valuetype,
        keyOptions,
        keyName,
        ...rest
    } = props;

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    return (
        <>
            <KeyValueMapField
                { ...input }
                aria-label={ rest["aria-label"] }
                data-componentid={ rest["data-componentid"] }
                FormControlProps={ FormControlProps }
                fullWidth={ fullWidth }
                keyOptions={ keyOptions }
                label={ label }
                name={ input.name }
                placeholder={ placeholder }
                readOnly={ readOnly }
                required={ required }
                valuetype={ valuetype }
                keyName={ keyName }
            />
            { isError && <FormHelperText error>{ meta.error || meta.submitError }</FormHelperText> }
            { helperText && <FormHelperText>{ helperText }</FormHelperText> }
        </>
    );
};

export default KeyValueMapAdapter;
