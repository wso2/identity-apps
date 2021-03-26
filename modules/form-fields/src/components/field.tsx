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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { Field, FieldProps } from "react-final-form";
import { Grid, MessageProps, SemanticWIDTHS } from "semantic-ui-react";
import {
    CopyFieldAdapter,
    PasswordFieldAdapter,
    TextAreaAdapter,
    TextFieldAdapter,
    ToggleAdapter
} from "./adapters";
import { getValidation } from "../utils";

interface FormFieldPropsInterface extends FieldProps<any,any,any>, TestableComponentInterface {
    /**
     * Aria label for the field.
     */
    ariaLabel: string;
    /**
     * Type of the form field.
     */
    fieldType?: "name" | "resourceName" | "email" | "url" | "copy-input" | "password" | "phoneNumber";
    /**
     * Hint of the form field.
     */
    hint?: string;
    /**
     * Max length of the input.
     */
    maxLength?: number;
    /**
     * Regex pattern to validate the input against.
     */
    pattern?: string;
    /**
     * Message to be displayed.
     */
    message?: ReactElement<MessageProps>;
    /**
     * Width of the message box
     */
    messageWidth?: SemanticWIDTHS;
    /**
     * Validation of the field.
     */
    validation?: any;
}

/**
 * Implementation of the Form Field component.
 * @param props
 */
export const FormField = (props: FormFieldPropsInterface): ReactElement => {

    const {
        fieldType,
        hint,
        maxLength,
        message,
        messageWidth,
        validation,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const formFieldGenerator = (): ReactElement => {
        if (props.type === "text") {
            return (
                <Field
                    { ...rest }
                    key={ testId }
                    type="text"
                    name={ props.name }
                    component={ TextFieldAdapter }
                    validate={ (value,allValues, meta) =>
                        getValidation(value, props.type, fieldType, validation)
                    }
                />
            );
        } else if (props.type === "textarea") {
            return (
                <Field
                    { ...rest }
                    key={ testId }
                    type="textarea"
                    name={ props.name }
                    component={ TextAreaAdapter }
                    validate={ (value,allValues, meta) =>
                        getValidation(value, props.type, fieldType, validation)
                    }
                />
            );
        } else if (props.type === "toggle") {
            return (
                <Field
                    { ...rest }
                    key={ testId }
                    type="checkbox"
                    name={ props.name }
                    component={ ToggleAdapter }
                    validate={ (value,allValues, meta) =>
                        getValidation(value, props.type, fieldType, validation)
                    }
                />
            );
        }
    };

    return (
        <>
            { formFieldGenerator() }
            {
                hint && (
                    <Hint>
                        { hint }
                    </Hint>
                )
            }
            {
                message && (
                    <Grid>
                        <Grid.Column width={ messageWidth ? messageWidth : props.width }>
                            <div>{ message }</div>
                        </Grid.Column>
                    </Grid>

                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
FormField.defaultProps = {
    maxLength: 50,
    width: 10
};
