/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
export const TYPE_QUERY_PARAM_INPUT = "queryParamInput";
export const TYPE_SCOPE_INPUT = "scopeInput";
export const TYPE_BUTTON = "button";

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
    | typeof TYPE_COPY_INPUT
    | typeof TYPE_QUERY_PARAM_INPUT
    | typeof TYPE_SCOPE_INPUT;

export enum FieldInputTypes {
    INPUT_DEFAULT = "default",
    INPUT_IDENTIFIER = "identifier",
    INPUT_PHONE_NUMBER = "phoneNumber",
    INPUT_NAME = "name",
    INPUT_NUMBER = "number",
    INPUT_RESOURCE_NAME = "resourceName",
    INPUT_CLIENT_ID = "clientId",
    INPUT_DESCRIPTION = "description",
    INPUT_EMAIL = "email",
    INPUT_URL = "url",
    INPUT_COPY = "copyInput",
    INPUT_PASSWORD = "password",
    INPUT_TEXT = "text",
    INPUT_QUERY_PARAM = "queryParamInput",
    INPUT_SCOPE = "scopeInput",
}

export enum FieldButtonTypes {
    BUTTON_PRIMARY = "primary_btn",
    BUTTON_CANCEL = "cancel_btn",
    BUTTON_LINK = "link_btn",
    BUTTON_DANGER= "danger_btn",
    BUTTON_DEFAULT = "default_btn",
}
