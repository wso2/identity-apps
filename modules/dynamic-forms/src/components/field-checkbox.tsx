/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import FormGroup from "@oxygen-ui/react/FormGroup";
import { Hint, Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { CheckboxAdapter } from "./adapters";
import { DynamicFieldProps } from "./dynamic-form-field";

/**
 * Interface for the Checkbox field component.
 */
export interface FieldCheckboxPropsInterface extends DynamicFieldProps {

    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Message to be displayed.
     */
    message?: any;
    /**
     * Call back to trigger on input onChange.
     */
    listen?: (values) => void;
}

/**
 * Implementation of the Checkbox Field component.
 *
 * @param props - Props injected to the component.
 *
 * @returns
 */
export const FieldCheckbox: FunctionComponent<FieldCheckboxPropsInterface> = (
    props: FieldCheckboxPropsInterface
): ReactElement => {

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
        <FormGroup>
            <FinalFormField
                type="checkbox"
                name={ props.name }
                component={ CheckboxAdapter }
                { ...props }
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
        </FormGroup>
    );
};
