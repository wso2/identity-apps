/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { EmailTemplateManagementConstants } from "../constants";
import { EmailTemplateType } from "../models";

/**
 * Utility class for Email template.
 */
export class EmailTemplateUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Filter governance categories of a connector for a sub organization.
     * @param emailTemplateData - List of email template data that recieved to the console.
     * 
     * @returns Filtered templates as a list.
     */
    public static filterEmailTemplateTypesForOrganization
    (emailTemplateData: EmailTemplateType[]): any[] {

        return emailTemplateData.filter(data => {
            if (EmailTemplateManagementConstants.EMAIL_TEMPLATE_TYPES_FOR_ORGS.includes(data.id)) {
                return data;
            }
        });

    }

}
