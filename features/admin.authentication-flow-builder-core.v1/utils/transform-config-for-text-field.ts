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

import { TextFieldProps } from "@oxygen-ui/react/TextField";
import { BaseConfig } from "../models/base";

/**
 * Transforms the field configuration into props that can be passed to a Material-UI TextField component.
 *
 * @example
 * ```tsx
 * const textFieldProps = transformConfigForTextField(config);
 * ```
 *
 * @param config - The base configuration containing field and styles.
 * @returns The transformed props for the TextField component.
 */
const transformConfigForTextField = (config: BaseConfig): TextFieldProps => {
    const { field, styles } = config;

    return {
        className: field.className,
        defaultValue: field.defaultValue.i18nKey || field.defaultValue.fallback,
        helperText: field.hint.i18nKey || field.hint.fallback,
        inputProps: {
            maxLength: field.maxLength,
            minLength: field.minLength
        },
        label: field.label.i18nKey || field.label.fallback,
        multiline: field.multiline,
        placeholder: field.placeholder.i18nKey || field.placeholder.fallback || "",
        required: field.required,
        style: styles,
        type: field.type
    };
};

export default transformConfigForTextField;
