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
 * Class containing Form Field constants.
 */
export class FieldConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Form field validation errors.
     */
    public static INVALID_EMAIL_ERROR = "Please enter a valid email";
    public static INVALID_URL_ERROR = "Please enter a valid URL";
    public static INVALID_NAME_ERROR = "Please enter a valid name";
    public static INVALID_RESOURCE_ERROR = "Please enter a valid input";
    public static INVALID_SECRET_NAME_ERROR = "Please enter a valid secret name. "+
        "You can only use alphanumeric characters, underscores (_), dashes (-)";

    public static INVALID_CLIENT_ID_ERROR = "Please enter a valid Client ID";
    public static INVALID_DESCRIPTION_ERROR = "Please enter a valid description";
    public static INVALID_PHONE_NUMBER_ERROR = "Please enter a valid phone number";
    public static INVALID_SCOPES_ERROR = "Please include 'openid' scope";
    public static FIELD_REQUIRED_ERROR = "This field cannot be empty";
}
