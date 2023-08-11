/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

export const TYPE_PASSWORD = "password";
export const TYPE_TEXT = "text";
export const TYPE_EMAIL = "email";
export const TYPE_NUMBER = "number";
export const TYPE_URL = "url";
export const TYPE_DATE = "date";
export const TYPE_DEFAULT = "default";
export const TYPE_IDENTIFIER = "identifier";
export const TYPE_PHONE_NUMBER = "phoneNumber";
export const TYPE_NAME = "name";
export const TYPE_RESOURCE_NAME = "resourceName";
export const TYPE_CLIENT_ID = "clientId";
export const TYPE_COPY_INPUT = "copyInput";

/**
 * Dynamic input field types
 */
export type DynamicFieldInputTypes =
    | typeof TYPE_PASSWORD
    | typeof TYPE_TEXT
    | typeof TYPE_EMAIL
    | typeof TYPE_NUMBER
    | typeof TYPE_URL
    | typeof TYPE_DATE
    | typeof TYPE_DEFAULT
    | typeof TYPE_IDENTIFIER
    | typeof TYPE_PHONE_NUMBER
    | typeof TYPE_NAME
    | typeof TYPE_RESOURCE_NAME
    | typeof TYPE_CLIENT_ID
    | typeof TYPE_COPY_INPUT;

export enum FieldInputTypes {
    INPUT_DEFAULT = "default",
    INPUT_IDENTIFIER = "identifier",
    INPUT_PHONE_NUMBER = "phone_number",
    INPUT_NAME = "name",
    INPUT_NUMBER = "number",
    INPUT_RESOURCE_NAME = "resource_name",
    INPUT_CLIENT_ID = "client_id",
    INPUT_DESCRIPTION = "description",
    INPUT_EMAIL = "email",
    INPUT_URL = "url",
    INPUT_COPY = "copy_input",
    INPUT_PASSWORD = "password",
    INPUT_TEXT = "text"
}

export enum FieldButtonTypes {
    BUTTON_PRIMARY = "primary_btn",
    BUTTON_CANCEL = "cancel_btn",
    BUTTON_LINK = "link_btn",
    BUTTON_DANGER= "danger_btn",
    BUTTON_DEFAULT = "default_btn",
}
