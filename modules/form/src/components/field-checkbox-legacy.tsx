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
import React, { ReactElement, useState } from "react";
import { Field as FinalFormField } from "react-final-form";
import { ToggleAdapter } from "./adapters";
import { FormFieldPropsInterface } from "./field";
import { FormFieldMessage } from "../models";

export interface FieldCheckboxLegacyPropsInterface extends FormFieldPropsInterface {
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
 * Implementation of the Checkbox Field component.
 * @deprecated Use `Field.Checkbox` instead.
 *
 * @param {FieldCheckboxLegacyPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const FieldCheckboxLegacy = (props: FieldCheckboxLegacyPropsInterface): ReactElement => {

    const { [ "data-testid" ]: testId, ...rest } = props;

    const [ checkboxValue, setCheckboxValue ] = useState<boolean>(!(props?.childFieldProps?.value?.length == 0));

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
        }
    };

    return (
        <>
            <FinalFormField
                key={ testId }
                parse={ value => value === undefined
                    ? setCheckboxValue(!(props?.childFieldProps?.value?.length == 0)) : setCheckboxValue(value) }
                type="checkbox"
                name={ props.name }
                defaultValue={ checkboxValue }
                component={ ToggleAdapter }
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
