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

import { FinalFormField, TextFieldAdapter } from "@wso2is/form";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { TextFormFieldPropsInterface } from "../../../models/ui";

/**
 * User profile text field component.
 */
const TextFormField: FunctionComponent<TextFormFieldPropsInterface> = (
    {
        fieldName,
        fieldLabel,
        initialValue,
        isUpdating,
        isReadOnly,
        isRequired,
        maxLength,
        validator,
        placeholder,
        type,
        ["data-componentid"]: componentId = "component-id"
    }: TextFormFieldPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    return (
        <FinalFormField
            component={ TextFieldAdapter }
            data-componentid={ componentId }
            initialValue={ initialValue }
            ariaLabel={ fieldLabel }
            name={ fieldName }
            type={ type ?? "text" }
            label={ fieldLabel }
            placeholder={ placeholder || t("user:profile.forms.generic.inputs.placeholder",
                { fieldName: fieldLabel })
            }
            validate={ (value: string) => validator ? validator(value) : undefined }
            maxLength={ maxLength }
            readOnly={ isReadOnly || isUpdating }
            required={ isRequired }
        />
    );
};

export default TextFormField;
