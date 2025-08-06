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
import { CheckboxGroupFieldAdapter, FinalFormField } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { CheckBoxGroupFormFieldPropsInterface } from "../../../models/ui";

/**
 * User profile checkbox group form field component.
 */
const CheckBoxGroupFormField: FunctionComponent<CheckBoxGroupFormFieldPropsInterface> = (
    {
        schema,
        fieldName,
        fieldLabel,
        initialValue,
        isUpdating,
        isReadOnly,
        isRequired,
        ["data-componentid"]: componentId = "checkbox-group-form-field"
    }: CheckBoxGroupFormFieldPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    const checkboxOptions: LabelValue[] = schema.canonicalValues ?? [];

    const validate = (value: string[]): string => {
        if (isEmpty(value) && isRequired) {
            return (
                t("user:profile.forms.generic.inputs.validations.required", { fieldName: fieldLabel })
            );
        }

        return undefined;
    };

    return (
        <FinalFormField
            component={ CheckboxGroupFieldAdapter }
            initialValue={ initialValue }
            ariaLabel={ fieldLabel }
            name={ fieldName }
            label={ fieldLabel }
            validate={ validate }
            readOnly={ isReadOnly || isUpdating }
            disabled={ isReadOnly || isUpdating }
            required={ isRequired }
            FormControlProps={ {
                fullWidth: true,
                margin: "dense"
            } }
            options={ checkboxOptions }
            data-componentid={ componentId }
        />
    );
};

export default CheckBoxGroupFormField;
