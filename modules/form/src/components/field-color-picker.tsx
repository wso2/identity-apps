/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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
import { Hint, Message } from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { ColorPickerAdapter } from "./adapters/__DEPRECATED__adapters";
import { FormFieldPropsInterface } from "./field";
import { FormFieldMessage } from "../models";

/**
 * Interface for the Color Picker field component.
 */
export interface FieldColorPickerPropsInterface extends FormFieldPropsInterface, IdentifiableComponentInterface {

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
 * Implementation of the Color Picker component.
 *
 * @param props - Props injected to the component.
 *
 * @returns
 */
export const FieldColorPicker: FunctionComponent<FieldColorPickerPropsInterface> = (
    props: FieldColorPickerPropsInterface
): ReactElement => {

    const {
        hint,
        message,
        name,
        [ "data-testid" ]: testId
    } = props;

    /**
     * Resolves the input message.
     *
     * @returns
     */
    const resolveInputFieldMessage = (): ReactElement => {
        switch (message.type) {
            case "info":
                return (
                    <Message
                        type={ message.type }
                        content={ message.content }
                        header={ message.header }
                    />
                );
            case "warning":
                return (
                    <Message
                        type={ message.type }
                        content={ message.content }
                        header={ message.header }
                    />
                );
            case "error":
                return (
                    <Message
                        type={ message.type }
                        content={ message.content }
                        header={ message.header }
                    />
                );
        }
    };

    return (
        <Fragment>
            <FinalFormField
                key={ testId }
                type="text"
                name={ name }
                parse={ (value: any) => value }
                component={ ColorPickerAdapter }
                { ...props }
            />
            {
                hint && (
                    <Hint compact>
                        { hint }
                    </Hint>
                )
            }
            {
                message && (
                    resolveInputFieldMessage()
                )
            }
        </Fragment>
    );
};

/**
 * Default props for the component.
 */
FieldColorPicker.defaultProps = {
    "data-componentid": "color-picker-field",
    editableInput: false
};
