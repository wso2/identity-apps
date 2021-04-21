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

import React, { ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { ButtonAdapter } from "./adapters";
import { FormFieldPropsInterface } from "./field";
import { FieldButtonTypes } from "../models";

export interface FieldButtonPropsInterface extends FormFieldPropsInterface {
    /**
     * Type of the button field.
     */
    type: FieldButtonTypes.BUTTON_DANGER
        | FieldButtonTypes.BUTTON_LINK
        | FieldButtonTypes.BUTTON_PRIMARY
        | FieldButtonTypes.BUTTON_CANCEL
        | FieldButtonTypes.BUTTON_DEFAULT;
}

/**
 * Implementation of the Button Field component.
 * @param props
 */
export const FieldButton = (props: FieldButtonPropsInterface): ReactElement => {

    const { [ "data-testid" ]: testId } = props;

    return (
        <FinalFormField
            key={ testId }
            name={ props.name }
            component={ ButtonAdapter }
            { ...props }
        />
    );
};

/**
 * Default props for the component.
 */
FieldButton.defaultProps = {
    type: FieldButtonTypes.BUTTON_DEFAULT
};
