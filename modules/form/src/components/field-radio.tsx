/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
import { Hint, Message } from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { RadioAdapter } from "./adapters";
import { FormFieldPropsInterface } from "./field";
import { FormFieldMessage } from "../models";

/**
 * Interface for the Radio field component.
 */
export interface FieldRadioPropsInterface extends FormFieldPropsInterface, IdentifiableComponentInterface {

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
 * Implementation of the Radio Field component.
 *
 * @param {FieldRadioPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const FieldRadio: FunctionComponent<FieldRadioPropsInterface> = (
    props: FieldRadioPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId,
        hint,
        message,
        ...rest
    } = props;

    const resolveInputFieldMessage = () => {

        const  {
            type,
            content,
            header
        } = message;

        switch (type) {
            case "info":
                return (
                    <Message
                        type={ type }
                        content={ content }
                        header={ header }
                    />
                );
            case "warning":
                return (
                    <Message
                        type={ type }
                        content={ content }
                        header={ header }
                    />
                );
            case "error":
                return (
                    <Message
                        type={ type }
                        content={ content }
                        header={ header }
                    />
                );
        }
    };

    return (
        <Fragment>
            <FinalFormField
                key={ componentId }
                type="radio"
                component={ RadioAdapter }
                data-componentid={ componentId }
                { ...rest }
            />
            {
                hint && (
                    <Hint compact>
                        { hint }
                    </Hint>
                )
            }
            { message && resolveInputFieldMessage() }
        </Fragment>
    );
};

/**
 * Default props for the component.
 */
FieldRadio.defaultProps = {
    "data-testid": "radio-field"
};
