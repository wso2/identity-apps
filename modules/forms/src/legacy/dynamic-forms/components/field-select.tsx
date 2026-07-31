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

import FormGroup from "@oxygen-ui/react/FormGroup";
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
import { FieldState } from "final-form";
import React, { ReactElement, ReactNode } from "react";
import { FieldProps, FieldRenderProps, Field as FinalFormField } from "react-final-form";
import SelectFieldAdapter from "../../../components/adapters/select-field-adapter";
import { getValidation } from "../utils/validate";

/**
 * Option of a dynamic select field.
 */
export interface DynamicFieldOptionInterface {
    /**
     * Text displayed for the option.
     */
    text: ReactNode;
    /**
     * Value persisted when the option is selected.
     */
    value: string;
}

export interface FieldSelectPropsInterface extends Omit<FieldProps<any, any, any>, "component">,
    IdentifiableComponentInterface, TestableComponentInterface {

    /**
     * Name of the select field.
     */
    name: string;
    /**
     * Options of the select field.
     */
    options?: DynamicFieldOptionInterface[];
    /**
     * Label of the select field.
     */
    label?: string;
    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Whether the field is read only.
     */
    readOnly?: boolean;
    /**
     * Validation of the field.
     */
    validation?: (value: string | number | any, allValues: Record<string, unknown>) => any;
}

/**
 * Implementation of the Select Field component of the dynamic form.
 *
 * @param props - Props injected to the component.
 */
export const FieldSelect = (props: FieldSelectPropsInterface): ReactElement => {

    const {
        hint,
        initialValue,
        label,
        name,
        options,
        placeholder,
        readOnly,
        required,
        validation,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    return (
        <FormGroup>
            <FinalFormField
                name={ name }
                parse={ (value: any) => value }
                initialValue={ initialValue }
                validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                    getValidation(value, allValues, meta, required, validation)
                }
                render={ ({ input, meta }: FieldRenderProps<any>) => (
                    <SelectFieldAdapter
                        input={ input }
                        meta={ meta }
                        label={ label }
                        options={ options ?? [] }
                        placeholder={ placeholder }
                        required={ required }
                        readOnly={ readOnly }
                        data-componentid={ componentId ?? testId ?? `${ name }-select-field` }
                    />
                ) }
            />
            {
                hint && (
                    <Hint compact>
                        { hint }
                    </Hint>
                )
            }
        </FormGroup>
    );
};
