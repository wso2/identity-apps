/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export class FieldConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
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
