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
import { FinalFormField, SelectFieldAdapter } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { DropdownFormFieldPropsInterface } from "../../../models/ui";

/**
 * User profile dropdown field component.
 */
const DropdownFormField: FunctionComponent<DropdownFormFieldPropsInterface> = (
    {
        schema,
        fieldName,
        fieldLabel,
        initialValue,
        isUpdating,
        isReadOnly,
        isRequired,
        isMultiSelect = false,
        ["data-componentid"]: componentId = "dropdown-form-field"
    }: DropdownFormFieldPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    const dropdownOptions: LabelValue[] = schema.canonicalValues ?? [];

    const validateField = (value: string | string[]): string | undefined => {
        // Validate the required field.
        if (isEmpty(value) && isRequired) {
            return (
                t("user:profile.forms.generic.inputs.validations.required", { fieldName: fieldLabel })
            );
        }

        return undefined;
    };

    return (
        <FinalFormField
            component={ SelectFieldAdapter }
            data-componentid={ componentId }
            initialValue={ initialValue }
            isClearable={ !isRequired }
            ariaLabel={ fieldLabel }
            name={ fieldName }
            label={ fieldLabel }
            validate={ validateField }
            placeholder={ t("user:profile.forms.generic.inputs.dropdownPlaceholder", { fieldName: fieldLabel }) }
            options={ dropdownOptions?.map(({ label, value }: LabelValue) => {
                return {
                    text: label,
                    value
                };
            }) }
            multiple={ isMultiSelect }
            readOnly={ isReadOnly || isUpdating }
            required={ isRequired }
            disableClearable={ isRequired }
        />
    );
};

export default DropdownFormField;
