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
import { SelectAdapter } from "./adapters";
import { FormFieldPropsInterface } from "./field";
import { FormFieldMessage } from "../models";
import { getValidation } from "../utils";

export interface FieldDropdownPropsInterface extends FormFieldPropsInterface {
    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Message to be displayed.
     */
    message?: FormFieldMessage;
    /**
     * Call back to trigger on input onChange.
     */
    listen?: (values) => void;
}

/**
 * Implementation of the Dropdown Field component.
 * @param props
 */
export const FieldDropdown = (props: FieldDropdownPropsInterface): ReactElement => {

    const { [ "data-testid" ]: testId, initialValue, ...rest } = props;

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
                type="dropdown"
                name={ props.name }
                parse={ value => value }
                component={ SelectAdapter }
                validate={ (value, allValues, meta) =>
                    getValidation(value, meta, props.type, props.required)
                }
                { ...rest }
            />
            {
                (props.hint && typeof props.hint === "string")
                    ? (
                        <Hint compact>
                            { props.hint }
                        </Hint>
                    ) : (
                        <>
                            { props.hint }
                        </>
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
