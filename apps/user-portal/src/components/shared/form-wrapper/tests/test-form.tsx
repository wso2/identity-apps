/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React from "react";
import { Validation } from "../../../../models";
import { FormWrapper } from "../form-wrapper";
import constants from "./constants";

const testForm = (
    <FormWrapper
        formFields={ [
            {
                label: constants.TEXT_BOX_LABEL,
                name: constants.TEXT_BOX_NAME,
                placeholder: constants.TEXT_BOX_PLACEHOLDER,
                required: true,
                requiredErrorMessage: constants.TEXT_BOX_REQUIRED_MESSAGE,
                type: "text",
                validation: (value: string, validation: Validation) => {
                    if (value !== constants.TEXT_BOX_VALID_MESSAGE) {
                        validation.isValid = false;
                        validation.errorMessages.push(
                            constants.TEXT_BOX_VALIDATION_FAILED
                        );
                    }
                },
                value: constants.TEXT_BOX_VALUE,
                width: 15
            },
            {
                label: constants.PASSWORD_LABEL,
                name: constants.PASSWORD_NAME,
                placeholder: constants.PASSWORD_PLACEHOLDER,
                required: true,
                requiredErrorMessage: constants.PASSWORD_REQUIRED_MESSAGE,
                type: "password",
                validation: (value: string, validation: Validation) => {
                    if (value !== constants.PASSWORD_VALID_MESSAGE) {
                        validation.isValid = false;
                        validation.errorMessages.push(
                            constants.PASSWORD_VALIDATION_FAILED
                        );
                    }
                },
                value: constants.PASSWORD_VALUE,
                width: 15
            },
            {
                type: "checkbox",
                children: [
                    {
                        label: constants.CHECKBOX_CHILD_1_LABEL,
                        value: constants.CHECKBOX_CHILD_1_VALUE
                    },
                    {
                        label: constants.CHECKBOX_CHILD_2_LABEL,
                        value: constants.CHECKBOX_CHILD_2_VALUE
                    }
                ]
                ,
                label: constants.CHECKBOX_LABEL,
                required: false,
                requiredErrorMessage: constants.CHECKBOX_REQUIRED_ERROR_MESSAGE,
                name: constants.CHECKBOX_NAME,
            },
            {
                type: "submit",
                value: constants.SUBMIT,
            }
        ] }
        onSubmit={ (value) => constants.onSubmit(value) }
    />
);

export default testForm;
