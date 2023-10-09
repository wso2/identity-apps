/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { ButtonAdapter } from "./adapters";
import { DynamicFieldProps } from "./dynamic-form-field";
import { FieldButtonTypes } from "../models";

export interface FieldButtonPropsInterface extends DynamicFieldProps {
    /**
     * Unique id of the form that needs to be submitted.
     */
    form: string;
    /**
     * Type of the button field.
     */
    buttonType: "primary_btn" | "cancel_btn" | "danger_btn" | "secondary_btn";
}

/**
 * Implementation of the Button Field component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const FieldButton = (props: FieldButtonPropsInterface): ReactElement => {

    const { form } = props;

    return (
        <FinalFormField
            form={ form }
            name={ props.name }
            component={ ButtonAdapter }
            { ...props }
        />
    );
};
