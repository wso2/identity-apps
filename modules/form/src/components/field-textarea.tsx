/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { Hint, Message } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { TextAreaAdapter } from "./adapters";
import { FormFieldPropsInterface } from "./field";
import { FormFieldMessage } from "../models";
import { getValidation } from "../utils";

export interface FieldTextareaPropsInterface extends FormFieldPropsInterface {
    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Maximum length of the input.
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
 * Implementation of the Textarea Field component.
 * @param props
 */
export const FieldTextarea = (props: FieldTextareaPropsInterface): ReactElement => {

    const { [ "data-testid" ]: testId, ...rest } = props;

    const resolveInputFieldMessage = () => {
        switch (props.message.type) {
            case "info":
                return (
                    <Message
                        type={ props.message.type }
                        content={ props.message.content }
                        header={ props.message.header }
                    />
                );
            case "warning":
                return (
                    <Message
                        type={ props.message.type }
                        content={ props.message.content }
                        header={ props.message.header }
                    />
                );
            case "error":
                return (
                    <Message
                        type={ props.message.type }
                        content={ props.message.content }
                        header={ props.message.header }
                    />
                );
        }
    };

    return (
        <>
            <FinalFormField
                key={ testId }
                type="textarea"
                name={ props.name }
                parse={ value => value }
                component={ TextAreaAdapter }
                validate={ (value,allValues, meta) =>
                    getValidation(value, meta, "textarea", props.required, props.type, props.validation)
                }
                { ...rest }
            />
            {
                props.hint && (
                    <Hint compact>
                        { props.hint }
                    </Hint>
                )
            }
            {
                props.message && (
                    resolveInputFieldMessage()
                )
            }
        </>
    );
};
