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
import { Hint, MessageWithIcon } from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { ColorPickerAdapter } from "./adapters";
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
 * @param {FieldColorPickerPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
     * @return {ReactElement}
     */
    const resolveInputFieldMessage = (): ReactElement => {
        switch (message.type) {
            case "info":
                return (
                    <MessageWithIcon
                        type={ message.type }
                        content={ message.content }
                        header={ message.header }
                    />
                );
            case "warning":
                return (
                    <MessageWithIcon
                        type={ message.type }
                        content={ message.content }
                        header={ message.header }
                    />
                );
            case "error":
                return (
                    <MessageWithIcon
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
                parse={ value => value }
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
