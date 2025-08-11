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

import { URLInput } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { FieldRenderProps } from "react-final-form";
import { useTranslation } from "react-i18next";

/**
 * Props for the TextFieldAdapter component.
 */
export interface MultiValuedTextFieldAdapterPropsInterface extends FieldRenderProps<string, HTMLElement, string> {
    /**
     * The label to display above the TextField.
     */
    label: string;
    /**
     * Helper text to display below the TextField.
     */
    hint?: string;
    /**
     * Tooltip text to display on hover.
     */
    tooltip?: string;
    /**
     * Regex for validating the input.
     */
    validationRegex?: RegExp;
    /**
     * Error message to display when validation fails.
     */
    validationErrorMsg?: string;
}

/**
 * A custom MultiValuedTextField adapter for use with React Final Form.
 * This adapter wraps a URLInput component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered MultiValuedTextField component.
 */
const MultiValuedTextFieldAdapter: FunctionComponent<MultiValuedTextFieldAdapterPropsInterface> = (
    props: MultiValuedTextFieldAdapterPropsInterface
): ReactElement => {
    const {
        input,
        label,
        validationRegex,
        validationErrorMsg,
        placeholder,
        disabled,
        required,
        hint,
        tooltip
    } = props;

    const { t } = useTranslation();

    const multiValues: string = Array.isArray(input.value) ? input.value.join(",") : "";

    function validate(value: string): boolean {
        const modifiedList: string[] = value?.split(",")
            .map((item: string) => item.trim())
            .filter((item: string) => item !== "");

        return modifiedList.every((item: string) => validationRegex.test(item));
    }

    return (
        <URLInput
            isAllowEnabled={ false }
            labelEnabled={ false }
            urlState={ multiValues }
            setURLState={ (value: string) => {
                const modifiedList: string[] = value
                    .split(",")
                    .map((item: string) => item.trim())
                    .filter((item: string) => item !== "");

                const isUnmodified: boolean = modifiedList.length === input.value.length
                        && modifiedList.every((value: string, i: number) => value === input.value[i]);

                if (!isUnmodified) {
                    input.onChange(modifiedList);
                }
            } }
            labelName={ label }
            required={ required }
            value={ multiValues }
            validation={ validate }
            hint={ hint }
            placeholder={ placeholder }
            validationErrorMsg={ validationErrorMsg }
            showPredictions={ false }
            readOnly={ disabled }
            addURLTooltip={ tooltip }
            duplicateURLErrorMessage={ t("common:duplicateURLError") }
            skipInternalValidation
        />
    );
};

export default MultiValuedTextFieldAdapter;
