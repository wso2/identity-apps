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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
import { FieldState } from "final-form";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { FieldProps, FieldRenderProps, Field as FinalFormField } from "react-final-form";
import SearchableSelectFieldAdapter from "../../../components/adapters/searchable-select-field-adapter";
import SelectFieldAdapter from "../../../components/adapters/select-field-adapter";
import { getValidation } from "../utils/validate";

/**
 * Option of a dynamic select field.
 */
interface DynamicFieldOptionInterface {

    text: ReactNode;
    value: string;
}

/**
 * Value a dynamic select field holds.
 */
type DynamicSelectFieldValueType = string;

interface FieldSelectPropsInterface
    extends Omit<FieldProps<DynamicSelectFieldValueType, FieldRenderProps<DynamicSelectFieldValueType>>, "component">,
    IdentifiableComponentInterface {

    name: string;
    options?: DynamicFieldOptionInterface[];
    label?: string;
    hint?: string | ReactElement;
    readOnly?: boolean;
    searchable?: boolean;
    loading?: boolean;
    validation?: (
        value: DynamicSelectFieldValueType,
        allValues: Record<string, unknown>
    ) => string | undefined | Promise<string | undefined>;
}

/**
 * Implementation of the Select Field component of the dynamic form.
 */
export const FieldSelect: FunctionComponent<FieldSelectPropsInterface> = (
    props: FieldSelectPropsInterface
): ReactElement => {

    const {
        hint,
        initialValue,
        label,
        loading,
        name,
        options,
        placeholder,
        readOnly,
        required,
        searchable,
        validation,
        [ "data-componentid" ]: componentId
    } = props;

    return (
        <FormGroup>
            <FinalFormField
                name={ name }
                parse={ (value: DynamicSelectFieldValueType) => value }
                initialValue={ initialValue }
                validate={ (
                    value: DynamicSelectFieldValueType,
                    allValues: Record<string, unknown>,
                    meta: FieldState<DynamicSelectFieldValueType>
                ) => getValidation(value, allValues, meta, required, validation) }
                render={ ({ input, meta }: FieldRenderProps<DynamicSelectFieldValueType>) => (
                    searchable
                        ? (
                            <SearchableSelectFieldAdapter
                                input={ input }
                                meta={ meta }
                                label={ label }
                                options={ options ?? [] }
                                placeholder={ placeholder }
                                required={ required }
                                readOnly={ readOnly }
                                loading={ loading }
                                data-componentid={ componentId ?? `${ name }-select-field` }
                            />
                        )
                        : (
                            <SelectFieldAdapter
                                input={ input }
                                meta={ meta }
                                label={ label }
                                options={ options ?? [] }
                                placeholder={ placeholder }
                                required={ required }
                                readOnly={ readOnly }
                                data-componentid={ componentId ?? `${ name }-select-field` }
                            />
                        )
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
