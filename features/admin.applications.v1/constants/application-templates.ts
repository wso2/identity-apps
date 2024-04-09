/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { ApplicationTemplateCategoryInterface } from "../models/application-templates";

/**
 * Class containing application templates management constants.
 */
export class ApplicationTemplateConstants {
    public static readonly CONSOLE_BASE_URL_PLACEHOLDER: string = "{{CONSOLE_BASE_URL}}";

    public static readonly COMING_SOON_ATTRIBUTE_KEY: string = "comingSoon";

    public static readonly SUPPORTED_TECHNOLOGIES_ATTRIBUTE_KEY: string = "supportedTechnologies";

    public static readonly CUSTOM_PROTOCOL_APPLICATION_TEMPLATE_ID: string = "custom-protocol-application";

    public static readonly SUPPORTED_CATEGORIES_INFO: ApplicationTemplateCategoryInterface[] = [
        {
            displayName: "applications:templates.categories.default",
            displayOrder: 0,
            id: "DEFAULT"
        },
        {
            displayName: "applications:templates.categories.ssoIntegration",
            displayOrder: 1,
            id: "SSO-INTEGRATION"
        }
    ];

    public static readonly OTHER_CATEGORY_INFO: ApplicationTemplateCategoryInterface = {
        displayName: "applications:templates.categories.other",
        displayOrder: Infinity,
        id: "OTHER"
    }
}
