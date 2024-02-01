/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import FormGroup from "@oxygen-ui/react/FormGroup";
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
import { FieldState } from "final-form";
import React, { ReactElement } from "react";
import { FieldProps, Field as FinalFormField } from "react-final-form";
import { 
    CopyFieldAdapter, 
    PasswordFieldAdapter, 
    QueryParamsAdapter, 
    ScopeFieldAdapter, 
    TextFieldAdapter 
} from "./adapters";
import { DynamicFieldInputTypes, FieldInputTypes } from "../models";
import { getValidation } from "../utils/validate";

export interface FieldInputPropsInterface extends Omit<FieldProps<any, any, any>, "component">, 
    IdentifiableComponentInterface, TestableComponentInterface {
        
    /**
     * Name of the input field.
     */
    name: string;
    /**
     * Type of the input field.
     */
    inputType: DynamicFieldInputTypes;
    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Validation of the field.
     */
    validation?: (value: string | number | any, allValues: Record<string, unknown>) => any;
}

/**
 * Implementation of the Input Field component.
 * @param props - Props injected to the component.
 */
export const FieldInput = (props: FieldInputPropsInterface): ReactElement => {

    const {
        inputType,
        validation,
        initialValue,
        ...rest
    } = props;

    const inputFieldGenerator = () => {
        if (inputType == FieldInputTypes.INPUT_NUMBER) {
            return (
                <FinalFormField
                    type="number"
                    render={ ( { input, meta } ) => (
                        <TextFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_TEXT) {
            return (
                <FinalFormField
                    type="text"
                    parse={ (value: any) => value }
                    render={ ( { input, meta } ) => (
                        <TextFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    { ...props }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_CLIENT_ID) {
            return (
                <FinalFormField
                    type="text"
                    parse={ (value: any) => value }
                    render={ ( { input, meta } ) => (
                        <TextFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    { ...props }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_PASSWORD) {
            return (
                <FinalFormField
                    type="password"
                    render={ ( { input, meta } ) => {
                        delete input.type;
                        
                        return (
                            <PasswordFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                        )
                    } }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_COPY) {
            return (
                <FinalFormField
                    type="text"
                    render={ ( { input, meta } ) => (
                        <CopyFieldAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_QUERY_PARAM) {
            return (
                <FinalFormField
                    type="text"
                    render={ ( { input, meta } ) => (
                        <QueryParamsAdapter input={ input } meta={ meta } name={ name } { ...rest } />
                    ) }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_SCOPE) {
            return (
                <FinalFormField
                    type="text"
                    name={ props.name }
                    component={ ScopeFieldAdapter }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    initialValue={ initialValue }
                    parse={ (value: any) => value }
                    { ...rest }
                />
            );
        } else {
            return (
                <FinalFormField
                    type="text"
                    name={ props.name }
                    parse={ (value: any) => value }
                    component={ TextFieldAdapter }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, props.required, validation)
                    }
                    { ...rest }
                />
            );
        }
    };

    return (
        <FormGroup>
            { inputFieldGenerator() }
            {
                props.hint && (
                    <Hint compact>
                        { props.hint }
                    </Hint>
                )
            }
        </FormGroup>
    );
};

/**
 * Default props for the component.
 */
FieldInput.defaultProps = {
    maxLength: 250,
    minLength: 3,
    width: 16
};

export default FieldInput;
