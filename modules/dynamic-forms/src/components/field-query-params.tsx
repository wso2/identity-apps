/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { QueryParamsAdapter } from "./adapters";
import { DynamicFieldProps } from "./dynamic-form-field";

export interface FieldQueryParamsProps extends DynamicFieldProps, TestableComponentInterface {
    /**
     * A comma separated string. if not an empty string.
     */
    value?: string;
    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Pass through onChange(value)
     */
    listen?: (value: string) => void;
}

/**
 * @param props - Props injected to the component.
 *
 * @returns
 */
export const FieldQueryParams: FunctionComponent<FieldQueryParamsProps> = (
    props: FieldQueryParamsProps
): ReactElement => {

    const { ["data-testid"]: testId, value, ...rest } = props;

    return (
        <React.Fragment>
            <FinalFormField
                key={ testId }
                name={ props.name }
                value={ value ?? "" }
                component={ QueryParamsAdapter }
                { ...rest }
            />
            { props.hint && <Hint compact>{ props.hint }</Hint> }
        </React.Fragment>
    );

};
