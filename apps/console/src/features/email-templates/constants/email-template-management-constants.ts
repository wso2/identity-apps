/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

/**
 * Class containing Email template related constants.
 */
export class EmailTemplateManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * A Boilerplate template to start email template editing.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly EMAIL_STARTER_TEMPLATE: string = `<!DOCTYPE html>
        <html>
            <head>
                <title>HTML Email Template</title>
            </head>
            <body>
                <p>Hello {{user.claim.givenname}}!</p>
            </body>
        </html>`;

    public static readonly DEFAULT_BRANDING_ACTIVE_THEME = "LIGHT";
    public static readonly DEFAULT_BRANDING_PRIMRY_COLOR = "#FF5000";
    public static readonly DEFAULT_BRANDING_BACKGROUND_COLOR = "#F0F0F0";
    public static readonly DEFAULT_BRANDING_FONT = "Nunito Sans";
    public static readonly DEFAULT_BRANDING_FONT_COLOR = "#333";
    public static readonly DEFAULT_BRANDING_BUTTON_FONT_COLOR = "#FFFFFF";
    public static readonly DEFAULT_BRANDING_LIGHT_THEMED_BACKGROUND_COLOR = "#FFFFFF";
    public static readonly DEFAULT_BRANDING_DARK_THEMED_BACKGROUND_COLOR = "#181818";
    public static readonly DEFAULT_BRANDING_LOGO_URL 
        = "http://cdn.wso2.com/wso2/newsletter/images/nl-2017/wso2-logo-transparent.png";

    public static readonly DEFAULT_BRANDING_COPYRIGHT_TEXT = "&#169; YYYY WSO2 LLC.";
}
