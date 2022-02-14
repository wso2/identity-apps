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

/**
 * Class containing form field data constants.
 */
export class FieldTestConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // Input field constants
    public static readonly BUTTON_VALUE: string =  "button";
    public static readonly HIDE_PASSWORD: string = "Hide Password";
    public static readonly PASSWORD_LABEL: string = "Password field label";
    public static readonly PASSWORD_NAME: string = "passwordBox";
    public static readonly PASSWORD_PLACEHOLDER: string = "Password box placeholder";
    public static readonly PASSWORD_REQUIRED_MESSAGE: string = "Password Required";
    public static readonly PASSWORD_VALIDATION_FAILED: string = "Validation failed";
    public static readonly PASSWORD_VALID_MESSAGE: string = "Password Validated";
    public static readonly PASSWORD_VALUE: string = "Password field value";
    public static readonly SHOW_PASSWORD: string = "Show Password";
    public static readonly SUBMIT: string = "Submit";
    public static readonly TEXT_FIELD_LABEL: string = "Text field label";
    public static readonly TEXT_FIELD_NAME: string = "textBox";
    public static readonly TEXT_FIELD_PLACEHOLDER: string = "Text field placeholder";
    public static readonly TEXT_FIELD_VALIDATION_FAILED: string = "Please enter a valid input";
    public static readonly TEXT_FIELD_REQUIRED_MESSAGE = "This field is required";
    public static readonly TEXT_FIELD_VALID_MESSAGE: string = "Text field Validated";
    public static readonly TEXT_FIELD_VALUE: string = "Text field value";
    public static readonly TEXT_FIELD_ARIA_LABEL: string = "Text field aria label";
    public static readonly TEXT_FIELD_TYPE_NAME: string = "name";
    public static readonly listen = jest.fn((value) => value);
    public static readonly onClick = jest.fn();
    public static readonly onSubmit = jest.fn((value) => value);
}
