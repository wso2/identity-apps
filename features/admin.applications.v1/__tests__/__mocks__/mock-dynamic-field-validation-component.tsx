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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import get from "lodash-es/get";
import React, { FunctionComponent, PropsWithChildren, useMemo, useState } from "react";
import useDynamicFieldValidations from "../../hooks/use-dynamic-field-validation";
import { MainApplicationInterface } from "../../models";
import { DynamicFieldInterface } from "../../models/dynamic-fields";

/**
 * Props interface for the `MockDynamicFieldValidationComponent`.
 */
export interface MockDynamicFieldValidationComponentProps extends IdentifiableComponentInterface {
    /**
     * Values to be validated.
     */
    formValues: MainApplicationInterface;
    /**
     * Metadata of the dynamic field.
     */
    field: DynamicFieldInterface;
}

/**
 * Mock component that uses the dynamic field validation.
 *
 * @param props - Props for the `MockDynamicFieldValidationComponent`.
 * @returns MockDynamicFieldValidationComponent
 */
const MockDynamicFieldValidationComponent: FunctionComponent<
    PropsWithChildren<MockDynamicFieldValidationComponentProps>
> = (
    props: PropsWithChildren<MockDynamicFieldValidationComponentProps>
) => {
    const {
        field,
        formValues,
        "data-componentid": componentId
    } = props;

    const [ displayMessage, setDisplayMessage ] = useState<string>("");

    const { validate } = useDynamicFieldValidations();

    useMemo(() => {
        validate(formValues, [ field ])
            .then((errors: { [key in keyof Partial<MainApplicationInterface>]: string }) => {
                const errorMsg: string = get(errors, field?.name);

                if (errorMsg) {
                    setDisplayMessage(errorMsg);
                }
            });
    }, [ formValues, field, validate ]);

    return <p data-componentid={ `${componentId}-display-message` }>{ displayMessage }</p>;
};

MockDynamicFieldValidationComponent.defaultProps = {
    "data-componentid": "mock-dynamic-field-validation-component"
};

export default MockDynamicFieldValidationComponent;
