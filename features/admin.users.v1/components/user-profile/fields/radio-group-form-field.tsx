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

import { LabelValue } from "@wso2is/core/models";
import { FinalFormField, RadioGroupFieldAdapter } from "@wso2is/form";
import React, { FunctionComponent, ReactElement } from "react";
import { RadioGroupFormFieldPropsInterface } from "../../../models/ui";

/**
 * User profile radio group form field component.
 */
const RadioGroupFormField: FunctionComponent<RadioGroupFormFieldPropsInterface> = (
    {
        schema,
        fieldName,
        fieldLabel,
        initialValue,
        isUpdating,
        isReadOnly,
        isRequired,
        validator,
        ["data-componentid"]: componentId = "radio-group-form-field"
    }: RadioGroupFormFieldPropsInterface
): ReactElement => {
    const radioOptions: LabelValue[] = schema.canonicalValues ?? [];

    return (
        <FinalFormField
            component={ RadioGroupFieldAdapter }
            initialValue={ initialValue }
            ariaLabel={ fieldLabel }
            name={ fieldName }
            label={ fieldLabel }
            options={ radioOptions }
            validate={ validator ?? undefined }
            readOnly={ isReadOnly || isUpdating }
            disabled={ isReadOnly || isUpdating }
            required={ isRequired }
            FormControlProps={ {
                fullWidth: true,
                margin: "dense"
            } }
            data-componentid={ componentId }
        />
    );
};

export default RadioGroupFormField;
