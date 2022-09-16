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

const constants = {
    BUTTON_VALUE: "button",
    CHECKBOX_CHILD_1_LABEL: "label1",
    CHECKBOX_CHILD_1_VALUE: "value1",
    CHECKBOX_CHILD_2_LABEL: "label2",
    CHECKBOX_CHILD_2_VALUE: "value2",
    CHECKBOX_CHILD_3_LABEL: "label3",
    CHECKBOX_CHILD_3_VALUE: "value3",
    CHECKBOX_LABEL: "Checkbox label",
    CHECKBOX_NAME: "checkbox",
    CHECKBOX_REQUIRED_MESSAGE: "checkbox required",
    CHECKBOX_VALUE: [ "value2" ],
    CUSTOM_DATA_ID: "custom",
    CUSTOM_ELEMENT: <div data-test-id="custom" />,
    DROPDOWN_CHILD_1_KEY: 1,
    DROPDOWN_CHILD_1_VALUE: "value1",
    DROPDOWN_CHILD_2_KEY: 2,
    DROPDOWN_CHILD_2_VALUE: "value2",
    DROPDOWN_DEFAULT: "value2",
    DROPDOWN_LABEL: "Dropdown Label",
    DROPDOWN_NAME: "Dropdown",
    DROPDOWN_PLACEHOLDER: "Select something",
    DROPDOWN_REQUIRED_MESSAGE: "dropdown required",
    DROPDOWN_VALUE: "value1",
    GENERATE_PASSWORD: "Generate Password",
    HIDE_PASSWORD: "Hide Password",
    PASSWORD_LABEL: "Password box label",
    PASSWORD_NAME: "passwordBox",
    PASSWORD_PLACEHOLDER: "Password box placeholder",
    PASSWORD_REQUIRED_MESSAGE: "Password Required",
    PASSWORD_VALIDATION_FAILED: "Validation failed",
    PASSWORD_VALID_MESSAGE: "Password Validated",
    PASSWORD_VALUE: "Password box value",
    RADIO_CHILD_1_LABEL: "label1",
    RADIO_CHILD_1_VALUE: "value1",
    RADIO_CHILD_2_LABEL: "label2",
    RADIO_CHILD_2_VALUE: "value2",
    RADIO_DEFAULT: "value2",
    RADIO_LABEL: "Radio",
    RADIO_NAME: "Radio",
    RADIO_VALUE: "value1",
    RESET_VALUE: "reset",
    SHOW_PASSWORD: "Show Password",
    SUBMIT: "Submit",
    TEXT_BOX_LABEL: "Text box label",
    TEXT_BOX_NAME: "textBox",
    TEXT_BOX_PLACEHOLDER: "Text box placeholder",
    TEXT_BOX_REQUIRED_MESSAGE: "Required",
    TEXT_BOX_VALIDATION_FAILED: "Validation failed",
    TEXT_BOX_VALID_MESSAGE: "Text box Validated",
    TEXT_BOX_VALUE: "Text box value",
    listen: jest.fn((value) => value),
    onClick: jest.fn(),
    onSubmit: jest.fn((value) => value)
};

export default constants;
