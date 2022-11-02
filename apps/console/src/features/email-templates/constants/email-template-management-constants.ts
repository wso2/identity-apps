/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * A Boilerplate template to start email template editing.
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

    /**
     * Email template types that are enabled for organization domain
     */
    public static readonly EMAIL_TEMPLATE_TYPES_FOR_ORGS: string[] = [
        "UGFzc3dvcmRSZXNldA", // PasswordReset
        "QWNjb3VudElkUmVjb3Zlcnk", //AccountIdRecovery
        "QXNrUGFzc3dvcmQ" // AskPassword
    ]
}
