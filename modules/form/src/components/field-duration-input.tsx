/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Hint } from "@wso2is/react-components";
import React, { Fragment, ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { FormFieldMessage } from "../models";
import { getValidation } from "../utils";
import { DurationInputDropdownAdapter } from "./adapters";
import { FormFieldPropsInterface } from "./field";

export interface FieldDurationInputPropsInterface extends FormFieldPropsInterface, IdentifiableComponentInterface {
    hint?: string | ReactElement;
    listen?: (value) => void;
    message?: FormFieldMessage;
    validation?: any;
}

export const FieldDurationInput = (
    props: FieldDurationInputPropsInterface
): ReactElement => {

    const {
        inputType,
        hint,
        validation,
        [ "data-componentid" ]: testId,
        ...rest
    } = props;

    return (
        <Fragment>
            <FinalFormField
                key={ testId }
                type="number"
                name={ props.name }
                parse={ value => value }
                component={ DurationInputDropdownAdapter }
                validate={ (value, allValues, meta) =>
                    getValidation(
                        value,
                        meta,
                        "text",
                        props.required,
                        inputType,
                        validation
                    )
                }
                { ...rest }
            />
            {
                hint && (
                    <Hint compact>
                        { hint }
                    </Hint>
                )
            }
        </Fragment>
    );
};

/**
 * Default {@link DurationInputDropdownAdapter} props.
 */
DurationInputDropdownAdapter.defaultProps = {
    inputType: "number",
    maxLength: 50,
    minLength: 3,
    width: 16
};
