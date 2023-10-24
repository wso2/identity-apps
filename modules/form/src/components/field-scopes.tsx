/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { Hint } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { ScopeFieldAdapter } from "./adapters/__DEPRECATED__adapters";
import { FormFieldPropsInterface } from "./field";
import { FieldInputTypes, FormFieldMessage } from "../models";
import { getValidation } from "../utils";

export interface FieldInputPropsInterface extends FormFieldPropsInterface {
    /**
     * Type of the input field.
     */
    inputType: "default"
        | "identifier"
        | "name"
        | "number"
        | "resource_name"
        | "client_id"
        | "description"
        | "email"
        | "url"
        | "copy_input"
        | "password"
        | "phoneNumber";
    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Max length of the input.
     */
    maxLength: number;
    /**
     * Minimum length of the input.
     */
    minLength: number;
    /**
     * Message to be displayed.
     */
    message?: FormFieldMessage;
    /**
     * Validation of the field.
     */
    validation?: any;
    /**
     * Call back to trigger on input onChange.
     */
    listen?: (values) => void;
}

/**
 * Implementation of the Scopes Field component.
 * @param props- FieldInputPropsInterface
 */
export const FieldScopes = (props: FieldInputPropsInterface): ReactElement => {
    const {
        defaultValue,
        inputType,
        hint,
        message,
        validation,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    return (
        <>
            <FinalFormField
                key={ testId }
                type="text"
                name={ props.name }
                parse={ <T = any>(value: T) => value }
                component={ ScopeFieldAdapter }
                validate={ (value: any, meta: Record<string, unknown>) =>
                    getValidation(value, null, meta, "text", props.required, inputType, validation)
                }
                defaultValue={ defaultValue }
                hint={ hint }
                message={ message }
                { ...rest }
            />
            {
                props.hint && (
                    <Hint compact>
                        { props.hint }
                    </Hint>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
FieldScopes.defaultProps = {
    defaultValue: "openid",
    inputType: "default",
    maxLength: 50,
    minLength: 3,
    type: FieldInputTypes.INPUT_DEFAULT,
    width: 16
};
